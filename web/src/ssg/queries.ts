import { BlogPost } from '../models/blog/post';
import { database } from './database';

export const getAllBlogPosts = () => {
  const db = database();
  const stmt = db.prepare('SELECT * FROM blog_posts');
  return stmt.all() as BlogPost[];
};

// TODO(melvin): Add pagination
export const getLatestBlogPosts = (language: string) => {
  const db = database();
  const stmt = db.prepare(
    'SELECT * FROM blog_posts WHERE language = ? ORDER BY createdAt DESC',
  );
  return stmt.all(language) as BlogPost[];
};

export const getBlogPost = (key: string, language: string) => {
  const db = database();
  const stmt = db.prepare(
    'SELECT * FROM blog_posts WHERE key = ? AND language = ?',
  );
  return stmt.get(key, language) as BlogPost | undefined;
};
