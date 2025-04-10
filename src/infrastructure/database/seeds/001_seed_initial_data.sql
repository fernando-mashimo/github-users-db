INSERT INTO
  users (
    username,
    name,
    location,
    email,
    page_url,
    avatar_url,
    created_at
  )
VALUES
  (
    'some-user-123456789',
    'Some User',
    'Some City, SS, US',
    'some_user@email.com',
    'https://github.com/some-user-123456789',
    'https://avatars.githubusercontent.com/u/123456789?v=4',
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