const mockUserData = {
  externalId: "123",
  username: "testuser",
  name: "Test User",
  location: "Test Location",
  email: "test@example.com",
  pageUrl: "https://github.com/testuser",
  avatarUrl: "https://avatars.githubusercontent.com/testuser",
  bio: "Test bio",
  createdAt: "2023-01-01",
  programmingLanguages: ["JavaScript", "TypeScript"],
};

import { fetchPersistUser } from ".";
import { createUser } from "../../../infrastructure/database/functions/create";
import { getByExtId } from "../../../infrastructure/database/functions/read";
import { updateUser } from "../../../infrastructure/database/functions/update";
import { fetchUserDataFromGitHub } from "../../../infrastructure/github/github";
import { FetchAndPersistUserDataUseCaseInput } from "./input";

jest.mock("../../../infrastructure/github/github", () => ({
  fetchUserDataFromGitHub: jest.fn().mockResolvedValue(mockUserData),
}));

jest.mock("../../../infrastructure/database/functions/read", () => ({
  getByExtId: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../../infrastructure/database/functions/create", () => ({
  createUser: jest.fn().mockResolvedValue(mockUserData),
}));

jest.mock("../../../infrastructure/database/functions/update", () => ({
  updateUser: jest.fn().mockResolvedValue(mockUserData),
}));

const useCaseInput: FetchAndPersistUserDataUseCaseInput = {
  username: "some-user",
};

describe("Should fetch and persist user data", () => {
  test("when user still not created in the database", async () => {
    const consoleSpy = jest.spyOn(console, "info").mockImplementation();

    const result = await fetchPersistUser(useCaseInput);

    expect(result).toEqual(mockUserData);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Creating new user in the database..."
    );
  });

  test("when user has already been created in the database", async () => {
    (getByExtId as jest.Mock).mockResolvedValueOnce(mockUserData);
    const consoleSpy = jest.spyOn(console, "info").mockImplementation();

    const result = await fetchPersistUser(useCaseInput);

    expect(result).toEqual(mockUserData);
    expect(consoleSpy).toHaveBeenCalledWith(
      "User already exists in the database. Updating user data..."
    );
  });
});

describe("Should not fetch/persist user data", () => {
  test("when user does not exist in GitHub", async () => {
    (fetchUserDataFromGitHub as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await fetchPersistUser(useCaseInput);

    expect(result).toBeUndefined();
  });

  test("when an error occurs while creating user data", async () => {
    (createUser as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await fetchPersistUser(useCaseInput);

    expect(result).toBeUndefined();
  });

  test("when an error occurs while updating user data", async () => {
    (getByExtId as jest.Mock).mockResolvedValueOnce(mockUserData);
    (updateUser as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await fetchPersistUser(useCaseInput);

    expect(result).toBeUndefined();
  });
});
