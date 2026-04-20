import { BlogPost } from "#features/blog/models";

import { database } from "./database";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBlogPost(value: unknown): value is BlogPost {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.slug === "string" &&
    typeof value.language === "string" &&
    typeof value.title === "string" &&
    typeof value.content === "string" &&
    typeof value.image === "string" &&
    typeof value.imageHash === "string" &&
    typeof value.ogImage === "string" &&
    typeof value.ogImageHash === "string" &&
    typeof value.excerpt === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

export const getAllBlogPosts = () => {
  const db = database();
  const stmt = db.prepare("SELECT * FROM blog_posts");
  return stmt.all().filter((post) => isBlogPost(post));
};

export const getLatestBlogPosts = (language: string) => {
  const db = database();
  const stmt = db.prepare("SELECT * FROM blog_posts WHERE language = ? ORDER BY createdAt DESC");
  return stmt.all(language).filter((post) => isBlogPost(post));
};

export const getBlogPost = (slug: string, language: string) => {
  const db = database();
  const stmt = db.prepare("SELECT * FROM blog_posts WHERE slug = ? AND language = ?");
  const post = stmt.get(slug, language);
  return isBlogPost(post) ? post : undefined;
};
