import matter from 'gray-matter';
import { rm } from 'node:fs/promises';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { type DatabaseSync } from 'node:sqlite';

import { BlogPost } from '#models/blog/post';

import { database } from '../src/ssg/database';
import { BLOG_POSTS_DIR, BUILD_DIR } from '../src/ssg/paths';
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

const createAndPopulatePosts = async (db: DatabaseSync) => {
  db.exec(
    `CREATE TABLE IF NOT EXISTS blog_posts
    (slug TEXT, title TEXT, content TEXT, excerpt TEXT, image TEXT, ogImage TEXT, createdAt TEXT, updatedAt TEXT)`,
  );

  const stmt = db.prepare(
    `INSERT INTO blog_posts (slug, title, content, excerpt, image, ogImage, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  const files = await readdir(BLOG_POSTS_DIR, { withFileTypes: true });
  for (const file of files) {
    if (!file.isFile() || !file.name.endsWith('.mdx')) return;

    const content = await readFile(join(file.parentPath, file.name), 'utf-8');
    const mdxSource = matter(content);

    const { title, slug, createdAt, updatedAt, excerpt, image, ogImage } =
      mdxSource.data as Frontmatter;

    const createdAtDT = createdAt + ' T8:00:00.000Z';
    const updatedAtDT = updatedAt ? updatedAt + ' T8:00:00.000Z' : createdAtDT;

    stmt.run(
      slug,
      title,
      mdxSource.content,
      excerpt,
      image,
      ogImage,
      createdAtDT,
      updatedAtDT,
    );
  }
};

main().catch((error: unknown) => {
  process.stderr.write(`Error during prebuild: ${error}\n`);
  process.exit(1);
});
