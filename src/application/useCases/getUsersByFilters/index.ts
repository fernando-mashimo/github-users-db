import { getByFilters } from "../../../infrastructure/database/functions/read";
import { GetUsersByFiltersUseCaseInput } from "./input";
import { GetUsersByFiltersUseCaseOutput } from "./output";

export const getUsersByFilters = async (
  input: GetUsersByFiltersUseCaseInput
): Promise<GetUsersByFiltersUseCaseOutput | undefined> => {
  const users = await getByFilters(input);

  if (!users) return;

  return users;
};
