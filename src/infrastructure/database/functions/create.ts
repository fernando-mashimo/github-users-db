import { User } from "../../../domain/entities/user";
import { db } from "../../config/database";

export const createUser = async (user: User): Promise<string | undefined> => {
  try {
    await db.tx(async (transaction) => {
      const { id: userId } = await transaction.one(
        `INSERT INTO users (
          external_id,
          username,
          name,
          location,
          email,
          page_url,
          avatar_url,
          bio,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (external_id) DO NOTHING RETURNING id`,
        [
          user.externalId,
          user.username,
          user.name,
          user.location,
          user.email,
          user.pageUrl,
          user.avatarUrl,
          user.bio,
          user.createdAt,
        ]
      );

      for (const language of user.programmingLanguages) {
        const { id: languageId } =
          (await transaction.oneOrNone(
            `INSERT INTO languages (
            name
            ) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id`,
            [language]
          )) ||
          (await transaction.one("SELECT id FROM languages WHERE name = $1", [
            language,
          ]));

        await transaction.none(
          `INSERT INTO user_languages (user_id, language_id) VALUES ($1, $2)
          ON CONFLICT DO NOTHING`,
          [userId, languageId]
        );
      }
    });

    return user.username;
  } catch (error) {
    console.error(
      "Some error has occurred while creating user in database",
      error
    );
    return;
  }
};
