import { getByFilters } from "../../../infrastructure/database/functions/read";
import { GetUsersByFiltersUseCaseInput } from "./input";
import { GetUsersByFiltersUseCaseOutput } from "./output";

export const getUsersByFilters = async (
  input: GetUsersByFiltersUseCaseInput
): Promise<GetUsersByFiltersUseCaseOutput | undefined> => {
  try {
    console.info("Getting users data...");
    const users = await getByFilters(input);
    if (!users.length) {
      if (input.location || input.programmingLanguage)
        console.info("No users found with the given filters");
      else console.info("No users found in the database");
      return;
    }

    return { users };
  } catch (error) {
    console.error(
      "Some error has occurred while getting users by filters",
      error
    );
    return undefined;
  }
};
