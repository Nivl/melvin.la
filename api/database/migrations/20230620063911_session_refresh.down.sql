BEGIN;

ALTER TABLE user_sessions
    DROP COLUMN IF EXISTS refresh_token,
    DROP COLUMN IF EXISTS refreshed_as,
    DROP COLUMN IF EXISTS ip_address,
    DROP COLUMN IF EXISTS expires_at;

COMMIT;
