-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE
    email=$1
    AND deleted_at IS NULL
LIMIT 1;

-- name: GetUserBySessionToken :one
SELECT u.*
FROM users u
LEFT JOIN user_sessions us
    ON u.id = us.user_id
WHERE us.token=$1
    AND us.deleted_at IS NULL
    AND u.deleted_at IS NULL
LIMIT 1;

-- name: InsertUser :copyfrom
INSERT INTO users
    (id, name, email, password, password_crypto)
VALUES
    ($1, $2, $3, $4, $5);


-- name: InsertUserSession :one
INSERT INTO user_sessions
    (token, user_id, refresh_token, expires_at, ip_address)
VALUES
    ($1, $2, $3, $4, $5)
RETURNING *;

-- name: DeleteUserSession :exec
UPDATE user_sessions
    SET deleted_at = NOW()
WHERE
    token=$1;

-- name: InsertBlogPost :one
INSERT INTO blog_posts
    (id, title, description, slug, thumbnail_url, content_json, published_at)
VALUES
    ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: UpdateBlogPost :one
UPDATE blog_posts
SET
    title = $1,
    slug = $2,
    description = $3,
    thumbnail_url = $4,
    content_json = $5,
    published_at = $6,
    updated_at = NOW()
WHERE
    id = $7
RETURNING *;

-- name: DeleteBlogPost :exec
UPDATE blog_posts
    SET deleted_at = NOW()
WHERE
    id=$1;

-- name: GetPublishedBlogPost :one
SELECT * FROM blog_posts
WHERE
    deleted_at IS NULL
    AND published_at IS NOT NULL
    AND slug = $1
LIMIT 1;

-- name: AdminGetBlogPost :one
SELECT * FROM blog_posts
WHERE
    deleted_at IS NULL
    AND id = $1
LIMIT 1;

-- name: GetBlogPostForUpdate :one
SELECT * FROM blog_posts
WHERE id = $1
LIMIT 1;

-- name: GetPublishedBlogPosts :many
SELECT * FROM blog_posts
WHERE
    deleted_at IS NULL
    AND published_at IS NOT NULL
    AND (CASE WHEN @is_before::bool THEN published_at < @before_date ELSE TRUE END)
    AND (CASE WHEN @is_after::bool THEN published_at > @after_date ELSE TRUE END)
ORDER BY
    CASE WHEN @is_after::varchar = 'asc' THEN published_at END ASC,
    CASE WHEN @is_before::varchar = 'desc' THEN published_at END DESC
LIMIT 100;

-- name: AdminGetBlogPosts :many
SELECT * FROM blog_posts
WHERE
    deleted_at IS NULL
    AND (CASE WHEN @is_before::bool THEN created_at < @before_date ELSE TRUE END)
    AND (CASE WHEN @is_after::bool THEN created_at > @after_date ELSE TRUE END)
ORDER BY
    CASE WHEN @is_after::varchar = 'asc' THEN created_at END ASC,
    CASE WHEN @is_before::varchar = 'desc' THEN created_at END DESC
LIMIT 100;

-- name: InsertBlogPostRev :one
INSERT INTO blog_post_revs
    (id, blog_post_id, title, content_json, description, thumbnail_url, slug)
VALUES
    ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;
