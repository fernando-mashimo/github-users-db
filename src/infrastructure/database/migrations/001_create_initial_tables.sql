CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT,
  github_url TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_languages (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, language_id)
);

CREATE INDEX idx_user_location ON users(location);
CREATE INDEX idx_language_name ON languages(name);