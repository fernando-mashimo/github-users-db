INSERT INTO
  users (
    name,
    location,
    email,
    github_url,
    avatar_url,
    created_at
  )
VALUES
  (
    'Some User',
    'Some City, SS',
    'some_user@email.com',
    'https://github.com/some-user-12345',
    'https://avatars.githubusercontent.com/u/12345?v=4',
    NOW()
  );

INSERT INTO
  languages (name)
VALUES
  ('JavaScript'),
  ('TypeScript'),
  ('C#'),
  ('Java');

INSERT INTO
  user_languages (user_id, language_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4);