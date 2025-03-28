import { User } from "../../../domain/entities/user";
import { db } from "../../config/database";

export const updateUser = async (user: User): Promise<string | undefined> => {
  try {
    await db.tx(async (transaction) => {
      const { id: userId } = await transaction.one(
        `UPDATE users SET
          username = $/username/,
          name = $/name/,
          location = $/location/,
          email = $/email/,
          page_url = $/pageUrl/,
          avatar_url = $/avatarUrl/,
          bio = $/bio/,
          created_at = $/createdAt/
          WHERE external_id = $/externalId/
        RETURNING id`,
        user
      );

      await transaction.none(
        "DELETE FROM user_languages WHERE user_id = $/userId/",
        {
          userId,
        }
      );

      for (const language of user.programmingLanguages) {
        const { id: languageId } =
          (await transaction.oneOrNone(
            `INSERT INTO languages (
            name
            ) VALUES (
             $/language/
            ) ON CONFLICT (name) DO NOTHING
            RETURNING id`,
            { language }
          )) ||
          (await transaction.one(
            "SELECT id FROM languages WHERE name = $/language/",
            { language }
          ));

        await transaction.none(
          `INSERT INTO user_languages (
            user_id,
            language_id
          ) VALUES (
            $/userId/,
            $/languageId/
          ) ON CONFLICT DO NOTHING`,
          { userId, languageId }
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
