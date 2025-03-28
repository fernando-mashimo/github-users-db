import { User } from "../../../domain/entities/user";
import { db } from "../../config/database";

export const createUser = async (user: User): Promise<string | undefined> => {
  try {
    await db.tx(async (transaction) => {
      const { id: userId } = await transaction.oneOrNone(
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
        ) VALUES (
          $/externalId/,
          $/username/,
          $/name/,
          $/location/,
          $/email/,
          $/pageUrl/,
          $/avatarUrl/,
          $/bio/,
          $/createdAt/
        )
        ON CONFLICT (external_id) DO NOTHING
        RETURNING id`,
        user
      );

      if (!userId) return;

      for (const language of user.programmingLanguages) {
        const { id: languageId } =
          (await transaction.oneOrNone(
            `INSERT INTO languages (
              name
            ) VALUES (
              $/language/
            )
            ON CONFLICT (name) DO NOTHING
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
          )
          ON CONFLICT DO NOTHING`,
          { userId, languageId }
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
