UPDATE users SET bio = 'I''m a software engineer'
WHERE id = 1;

UPDATE users SET external_id = 123456789
WHERE id = 1;

INSERT INTO
  users (
    username,
    name,
    location,
    email,
    page_url,
    avatar_url,
    created_at,
    bio,
    external_id
  )
VALUES
  (
    'other-user-987654321',
    'Other User',
    'Other City, SS',
    'other_user@email.com',
    'https://github.com/some-user-987654321',
    'https://avatars.githubusercontent.com/u/987654321?v=4',
    NOW(),
    'I''m a ux designer',
    987654321
  );

INSERT INTO
  languages (name)
VALUES
  ('Python'),
  ('Ruby'),
  ('Go'),
  ('Rust');

INSERT INTO
  user_languages (user_id, language_id)
VALUES
  (2, 5),
  (2, 6),
  (2, 7),
  (2, 8);

