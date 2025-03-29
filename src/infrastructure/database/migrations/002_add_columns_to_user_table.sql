ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD external_id INT UNIQUE;

CREATE INDEX idx_user_externalId ON users(external_id);