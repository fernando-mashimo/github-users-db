import { getByFilters } from "../../../infrastructure/database/functions/read";
import { GetUsersByFiltersUseCaseInput } from "./input";
import { GetUsersByFiltersUseCaseOutput } from "./output";
import dotenv from "dotenv";
dotenv.config();

export const getUsersByFilters = async (
  input: GetUsersByFiltersUseCaseInput
): Promise<GetUsersByFiltersUseCaseOutput | undefined> => {
  console.info("Fetching users data from database...");
  const users = await getByFilters(input);

  if (!users) return;

  if (!users.length) {
    if (input.location || input.programmingLanguage)
      console.info("No users found with the given filters in the database");
    else console.info("No users found in the database");
    return;
  }

  return { users };
};
