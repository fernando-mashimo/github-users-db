import { User } from "../../../domain/entities/user";
import { db } from "../../config/database";

export const getByExtId = async (
  externalId: number
): Promise<User | undefined> => {
  const record = await db.oneOrNone(
    `SELECT
      u.external_id,
      u.username,
      u.name,
      u.location,
      u.email,
      u.page_url,
      u.avatar_url,
      u.bio,
      u.created_at,
      array_agg(l.name) AS programming_languages
    FROM users as u
    JOIN user_languages ul ON ul.user_id = u.id
    JOIN languages l ON l.id = ul.language_id
    WHERE external_id = $1
    GROUP BY
      u.external_id,
      u.username,
      u.name,
      u.location,
      u.email,
      u.page_url,
      u.avatar_url,
      u.bio,
      u.created_at`,
    [externalId]
  );

  if (!record) {
    return;
  }

  const user = mapDbObjectToUser(record);
  return user;
};

export const listUsers = async (options: {
  location?: string;
  programmingLanguages?: string;
}): Promise<User[]> => {
  let query = `SELECT
    external_id,
    name,
    location,
    email,
    page_url,
    avatar_url,
    bio,
    created_at,
    FROM users`;
  let params = [];

  if (options.location) {
    query +=
      params.length > 0 ? " AND location LIKE $2" : " WHERE location LIKE $1";
    params.push(`%${options.location}%`);
  }

  if (options.programmingLanguages) {
    query += ` JOIN user_languages ul ON ul.user_id = users.id
      JOIN languages l ON l.id = ul.language_id
      WHERE l.name = $${params.length + 1}`;
    params.push(options.programmingLanguages);
  }

  const users = await db.any(query, params);

  return users;
};

type DbUser = {
  id: number;
  external_id: number;
  username: string;
  name: string;
  location: string;
  email: string;
  page_url: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  programming_languages: string[];
};

const mapDbObjectToUser = (dbUser: DbUser): User => {
  return {
    externalId: dbUser.external_id,
    username: dbUser.username,
    name: dbUser.name,
    location: dbUser.location,
    email: dbUser.email,
    pageUrl: dbUser.page_url,
    avatarUrl: dbUser.avatar_url,
    bio: dbUser.bio,
    createdAt: dbUser.created_at,
    programmingLanguages: dbUser.programming_languages,
  };
};

// listUsers({ username: "some-user-123456789" });
// listUsers({ location: "Some City, SS" });
