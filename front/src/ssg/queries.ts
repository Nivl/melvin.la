import { BlogPost } from '../models/blog/post';
import { database } from './database';

export const getAllBlogPosts = () => {
  const db = database();
  const stmt = db.prepare('SELECT * FROM blog_posts');
  return stmt.all() as BlogPost[];
};

export const getLatestBlogPosts = () => {
  const db = database();
  const stmt = db.prepare(
    'SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 10',
  );
  return stmt.all() as BlogPost[];
};

export const getBlogPost = (slug: string) => {
  const db = database();
  const stmt = db.prepare('SELECT * FROM blog_posts WHERE slug = ?');
  return stmt.get(slug) as BlogPost | undefined;
};
