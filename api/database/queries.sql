-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE
    email=$1
    AND deleted_at IS NULL
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
