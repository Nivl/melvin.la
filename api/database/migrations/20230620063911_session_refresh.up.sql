BEGIN;

ALTER TABLE user_sessions
    ADD COLUMN refresh_token UUID NOT NULL,
    ADD COLUMN expires_at timestamptz NOT NULL,
    ADD COLUMN refreshed_as UUID,
    ADD COLUMN ip_address cidr;

COMMIT;
