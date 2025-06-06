import { User } from "../../../domain/entities/user";
import { db } from "../../config/database";

export const getByExtId = async (
  externalId: number
): Promise<User | undefined> => {
  try {
    const record = await db.oneOrNone(
      `SELECT
        u.id,
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
      LEFT JOIN user_languages ul ON ul.user_id = u.id
      LEFT JOIN languages l ON l.id = ul.language_id
      WHERE external_id = $/externalId/
      GROUP BY
        u.id,
        u.external_id,
        u.username,
        u.name,
        u.location,
        u.email,
        u.page_url,
        u.avatar_url,
        u.bio,
        u.created_at`,
      { externalId }
    );

    if (!record) {
      return;
    }

    const user = mapDbObjectToUser(record);
    return user;
  } catch (error) {
    console.error(
      "Some error has occurred while fetching user by ext id from database",
      error
    );
    return;
  }
};

export const getByFilters = async (filters?: {
  location?: string;
  programmingLanguages?: string[];
}): Promise<User[] | undefined> => {
  const programmingLanguagesWhereClause = filters?.programmingLanguages
    ? `OR EXISTS (
        SELECT 1
        FROM user_languages ul2
        JOIN languages l2 ON l2.id = ul2.language_id
        WHERE ul2.user_id = u.id
        AND LOWER(l2.name) = ANY($/programmingLanguages/)
      )`
    : "";

  try {
    const records = await db.manyOrNone(
      `SELECT
        u.id,
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
      LEFT JOIN user_languages ul ON ul.user_id = u.id
      LEFT JOIN languages l ON l.id = ul.language_id
      WHERE
        (
          $/location/ IS NULL
          OR LOWER(u.location) LIKE LOWER(CONCAT('%', $/location/, '%'))
        )
      AND
        ($/programmingLanguages/ IS NULL
        ${programmingLanguagesWhereClause}
      )
      GROUP BY
        u.id,
        u.external_id,
        u.username,
        u.name,
        u.location,
        u.email,
        u.page_url,
        u.avatar_url,
        u.bio,
        u.created_at`,
      {
        location: filters?.location?.toLowerCase() || null,
        programmingLanguages:
          filters?.programmingLanguages?.map((language) =>
            language.toLowerCase()
          ) || null,
      }
    );

    const users = records.map((record) => mapDbObjectToUser(record));
    return users;
  } catch (error) {
    console.error(
      "Some error has occurred while fetching users by filters from database",
      error
    );
    return;
  }
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
  const programmingLanguages = dbUser.programming_languages.filter(
    (language) => language
  );

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
    programmingLanguages,
  };
};
