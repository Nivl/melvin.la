BEGIN;

INSERT INTO users
    (id, email, password, password_crypto, name)
VALUES
    (gen_random_uuid(), 'test@domain.tld', '$2y$10$GSIPZfHMzOQSq0o77sF8/Oz2j8g0VlDuCZ/ujzo4K4wCq4j6ReQ9K', 'bcrypt', 'Test User');

COMMIT;
