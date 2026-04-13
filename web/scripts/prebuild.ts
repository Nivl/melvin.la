import { createHash } from "node:crypto";
import { readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { type DatabaseSync } from "node:sqlite";

import matter from "gray-matter";

import { BlogPost } from "#features/blog/models.ts";
import { database } from "#features/blog/ssg/database.ts";
import { BLOG_POSTS_DIR, BUILD_DIR } from "#features/blog/ssg/paths.ts";

import { setup } from "./utils";

type Frontmatter = Omit<BlogPost, "updatedAt" | "imageHash" | "ogImageHash"> & {
  updatedAt?: string;
};

function isFrontmatter(value: Record<string, unknown>): value is Frontmatter {
  return (
    typeof value.slug === "string" &&
    typeof value.language === "string" &&
    typeof value.title === "string" &&
    typeof value.content === "string" &&
    typeof value.excerpt === "string" &&
    typeof value.image === "string" &&
    typeof value.ogImage === "string" &&
    typeof value.createdAt === "string" &&
    (typeof value.updatedAt === "string" || value.updatedAt === undefined)
  );
}

function parseFrontmatter(
  value: Record<string, unknown>,
  slug: string,
  language: string,
  content: string,
): Frontmatter | undefined {
  const candidate = { ...value, slug, language, content };
  return isFrontmatter(candidate) ? candidate : undefined;
}

async function hashImageFile(slug: string, filename: string): Promise<string> {
  const filePath = path.join("public/assets/blog", slug, filename);
  try {
    const data = await readFile(filePath);
    return createHash("sha256").update(data).digest("hex").slice(0, 8);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      throw new Error(`Image file not found: ${filePath}`, { cause: error });
    }
    throw error;
  }
}

const main = async () => {
  // we make sure we start from scratch
  await rm(BUILD_DIR, { recursive: true, force: true });

  await setup();
  const db = database();
  await createAndPopulatePosts(db);
};

// slug - unique (per language) identifier for the post. Every post must have the same slug across languages
// language - language code
// title
// content
// excerpt
// image - main image displayed in the post
// imageHash - SHA-256 (first 8 chars) of the image file, used for cache-busting
// ogImage - image used for social sharing
// ogImageHash - SHA-256 (first 8 chars) of the ogImage file, used for cache-busting
// createdAt
// updatedAt
const createAndPopulatePosts = async (db: DatabaseSync) => {
  db.exec(
    `CREATE TABLE IF NOT EXISTS blog_posts
    (slug TEXT, language TEXT, title TEXT, content TEXT, excerpt TEXT, image TEXT, imageHash TEXT, ogImage TEXT, ogImageHash TEXT, createdAt TEXT, updatedAt TEXT)`,
  );

  const stmt = db.prepare(
    `INSERT INTO blog_posts (slug, language, title, content, excerpt, image, imageHash, ogImage, ogImageHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  const articlesDirs = await readdir(BLOG_POSTS_DIR, {
    withFileTypes: true,
  });

  await Promise.all(
    articlesDirs.map(async (articleDir) => {
      if (!articleDir.isDirectory()) {
        throw new Error(`file found in root blog posts directory: ${articleDir.name}`);
      }
      const articleDirPath = path.join(BLOG_POSTS_DIR, articleDir.name);
      const slug = articleDir.name;

      const files = await readdir(articleDirPath, { withFileTypes: true });

      const mdxFiles = files.filter((f) => f.isFile() && f.name.endsWith(".mdx"));
      if (mdxFiles.length === 0) {
        throw new Error(`no MDX files found in ${articleDirPath}`);
      }

      // Parse the first MDX file to get image filenames (shared across all languages)
      const firstRaw = await readFile(path.join(mdxFiles[0].parentPath, mdxFiles[0].name), "utf8");
      const firstMdx = matter(firstRaw);
      const firstLang = path
        .basename(mdxFiles[0].name, path.extname(mdxFiles[0].name))
        .toLocaleLowerCase();
      const firstFrontmatter = parseFrontmatter(firstMdx.data, slug, firstLang, firstMdx.content);
      if (!firstFrontmatter) {
        throw new Error(`invalid frontmatter for ${mdxFiles[0].name}`);
      }

      // Hash image files once per slug (assets are shared across languages)
      const [imageHash, ogImageHash] = await Promise.all([
        hashImageFile(slug, firstFrontmatter.image),
        hashImageFile(slug, firstFrontmatter.ogImage),
      ]);

      await Promise.all(
        files.map(async (file) => {
          if (!file.isFile() || !file.name.endsWith(".mdx")) {
            throw new Error(`file found in a blog post directory: ${file.name}`);
          }

          const language = path.basename(file.name, path.extname(file.name)).toLocaleLowerCase();
          const content = await readFile(path.join(file.parentPath, file.name), "utf8");
          const mdxSource = matter(content);
          const frontmatter = parseFrontmatter(mdxSource.data, slug, language, mdxSource.content);

          if (!frontmatter) {
            throw new Error(`invalid frontmatter for ${file.name}`);
          }

          const { title, createdAt, updatedAt, excerpt, image, ogImage } = frontmatter;

          const createdAtDT = new Date(createdAt).toISOString();
          const updatedAtDT = updatedAt ? new Date(updatedAt).toISOString() : createdAtDT;

          stmt.run(
            slug,
            language,
            title,
            mdxSource.content,
            excerpt,
            image,
            imageHash,
            ogImage,
            ogImageHash,
            createdAtDT,
            updatedAtDT,
          );
        }),
      );
    }),
  );
};

await main();
