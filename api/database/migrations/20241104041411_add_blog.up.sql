BEGIN;

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL CHECK (char_length(title) <= 100),
    slug TEXT NOT NULL CHECK (char_length(slug) <= 105),
    thumbnail_url TEXT CHECK (char_length(thumbnail_url) <= 255),
    description TEXT CHECK (char_length(description) <= 130),
    content_json JSONB,
    published_at timestamptz,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW(),
    deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS blog_post_revs (
    id UUID PRIMARY KEY,
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    content_json JSONB,
    created_at timestamptz DEFAULT NOW(),
    deleted_at timestamptz
);

COMMIT;
