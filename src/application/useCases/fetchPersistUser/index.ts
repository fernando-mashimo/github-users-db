import { User } from "../../../domain/entities/user";
import { createUser } from "../../../infrastructure/database/functions/create";
import { getByExtId } from "../../../infrastructure/database/functions/read";
import { updateUser } from "../../../infrastructure/database/functions/update";
import { getUserInformation } from "../../../infrastructure/github/github";
import { FetchAndPersistUserDataUseCaseInput } from "./input";
import { FetchAndPersistUserDataUseCaseOutput } from "./output";

export const fetchAndPersistUser = async (
  input: FetchAndPersistUserDataUseCaseInput
): Promise<FetchAndPersistUserDataUseCaseOutput | undefined> => {
  const userGhData: User | undefined = await getUserInformation(input.username);
  // if user not found in GitHub or credentials invalid, return undefined
  if (!userGhData) return;

  // verify if user already exists in DB
  const existingUserInDb = await getByExtId(userGhData.externalId);
  if (existingUserInDb) {
    // update existing user data
    console.info("User already exists in the database. Updating user data...");
    const updatedUser = await updateUser(userGhData);
    if (!updatedUser) return;
  } else {
    // create new user
    console.info("Creating new user in the database...");
    const createdUser = await createUser(userGhData);
    if (!createdUser) return;
  }

  return userGhData;
};
