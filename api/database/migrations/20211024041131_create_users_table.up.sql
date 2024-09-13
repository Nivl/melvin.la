BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE CHECK (char_length(email) <= 255),
    password TEXT NOT NULL CHECK (char_length(password) <= 255),
    password_crypto TEXT NOT NULL CHECK (char_length(password_crypto) <= 30),
    name TEXT NOT NULL CHECK (char_length(name) <= 50),
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW(),
    deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS user_sessions (
    token UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW(),
    deleted_at timestamptz
);

COMMIT;
