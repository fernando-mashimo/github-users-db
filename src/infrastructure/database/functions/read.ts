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

export const getByFilters = async (filters?: {
  location?: string;
  programmingLanguages?: string;
}): Promise<User[]> => {
  const records = await db.manyOrNone(
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
    WHERE
      ($1 IS NULL OR LOWER(u.location) LIKE '%' || $1 || '%')
      AND ($2 IS NULL OR $2 IN (
        SELECT LOWER(l2.name)
        FROM user_languages ul2
        JOIN languages l2 ON l2.id = ul2.language_id
        WHERE ul2.user_id = u.id
      ))
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
    [
      filters?.location?.toLowerCase(),
      filters?.programmingLanguages?.toLowerCase(),
    ]
  );

  const users = records.map((record) => mapDbObjectToUser(record));
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
