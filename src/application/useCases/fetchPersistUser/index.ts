import { User } from "../../../domain/entities/user";
import { createUser } from "../../../infrastructure/database/functions/create";
import { getByExtId } from "../../../infrastructure/database/functions/read";
import { updateUser } from "../../../infrastructure/database/functions/update";
import { fetchUserDataFromGitHub } from "../../../infrastructure/github/github";
import { FetchAndPersistUserDataUseCaseInput } from "./input";
import { FetchAndPersistUserDataUseCaseOutput } from "./output";

export const fetchPersistUser = async (
  input: FetchAndPersistUserDataUseCaseInput
): Promise<FetchAndPersistUserDataUseCaseOutput | undefined> => {
  console.info(`Fetching user ${input.username} data from GitHub...`);
  const userGhData: User | undefined = await fetchUserDataFromGitHub(
    input.username
  );
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

  console.info(
    "User data successfully fetched and created/updated in the database!"
  );
  return userGhData;
};
