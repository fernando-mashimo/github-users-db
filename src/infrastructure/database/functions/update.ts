import { User } from "../../../domain/entities/user";
import { db } from "../../config/database";

export const updateUser = async (user: User): Promise<string | undefined> => {
  try {
    await db.tx(async (transaction) => {
      const { id: userId } = await transaction.one(
        `UPDATE users SET
          username = $2,
          name = $3,
          location = $4,
          email = $5,
          page_url = $6,
          avatar_url = $7,
          bio = $8,
          created_at = $9
          WHERE external_id = $1 RETURNING id`,
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

      await transaction.none("DELETE FROM user_languages WHERE user_id = $1", [
        userId,
      ]);

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
      "Some error has occurred while updating user in database",
      error
    );
    return;
  }
};
