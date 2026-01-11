import { readdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { type DatabaseSync } from 'node:sqlite';

import matter from 'gray-matter';

import { BlogPost } from '#models/blog/post';
import { database } from '#ssg/database';
import { BLOG_POSTS_DIR, BUILD_DIR } from '#ssg/paths';

import { setup } from './utils';

type Frontmatter = Omit<BlogPost, 'updatedAt'> & {
  updatedAt?: string;
};

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
// ogImage - image used for social sharing
// createdAt
// updatedAt
const createAndPopulatePosts = async (db: DatabaseSync) => {
  db.exec(
    `CREATE TABLE IF NOT EXISTS blog_posts
    (slug TEXT TEXT, language TEXT, title TEXT, content TEXT, excerpt TEXT, image TEXT, ogImage TEXT, createdAt TEXT, updatedAt TEXT)`,
  );

  const stmt = db.prepare(
    `INSERT INTO blog_posts (slug, language, title, content, excerpt, image, ogImage, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  const articlesDirs = await readdir(BLOG_POSTS_DIR, {
    withFileTypes: true,
  });

  for (const articleDir of articlesDirs) {
    if (!articleDir.isDirectory()) {
      throw new Error(
        `file found in root blog posts directory: ${articleDir.name}`,
      );
    }
    const articleDirPath = path.join(BLOG_POSTS_DIR, articleDir.name);
    const slug = articleDir.name;

    const files = await readdir(articleDirPath, { withFileTypes: true });
    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith('.mdx')) {
        throw new Error(`file found in a blog post directory: ${file.name}`);
      }

      const language = path
        .basename(file.name, path.extname(file.name))
        .toLocaleLowerCase();
      const content = await readFile(
        path.join(file.parentPath, file.name),
        'utf8',
      );
      const mdxSource = matter(content);

      const { title, createdAt, updatedAt, excerpt, image, ogImage } =
        mdxSource.data as Frontmatter;

      const createdAtDT = createdAt + ' T8:00:00.000Z';
      const updatedAtDT = updatedAt
        ? updatedAt + ' T8:00:00.000Z'
        : createdAtDT;

      stmt.run(
        slug,
        language,
        title,
        mdxSource.content,
        excerpt,
        image,
        ogImage,
        createdAtDT,
        updatedAtDT,
      );
    }
  }
};

await main();
