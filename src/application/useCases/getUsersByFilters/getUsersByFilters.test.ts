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

import { getUsersByFilters } from ".";
import { getByFilters } from "../../../infrastructure/database/functions/read";

jest.mock("../../../infrastructure/database/functions/read", () => ({
  getByFilters: jest.fn().mockResolvedValue([mockUserData]),
}));

describe("Should fetch users by filters", () => {
  // eslint-disable-next-line max-len
  test("when no filtering parameters are provided and users are found in the database", async () => {
    const useCaseInput = {};
    const result = await getUsersByFilters(useCaseInput);

    expect(result).toEqual([mockUserData]);
  });

  // eslint-disable-next-line max-len
  test("when filtering parameters are provided and users are found in the database", async () => {
    const useCaseInput = { location: "Test Location" };
    const result = await getUsersByFilters(useCaseInput);

    expect(result).toEqual([mockUserData]);
  });
});

describe("Should not fetch users by filters", () => {
  // eslint-disable-next-line max-len
  test("when no filtering parameters are provided and no users are found in the database", async () => {
    (getByFilters as jest.Mock).mockResolvedValueOnce([]);

    const useCaseInput = {};

    const result = await getUsersByFilters(useCaseInput);

    expect(result).toEqual([]);
  });

  // eslint-disable-next-line max-len
  test("when filtering parameters are provided and no users are found in the database", async () => {
    (getByFilters as jest.Mock).mockResolvedValueOnce([]);

    const useCaseInput = { location: "Test Location" };

    const result = await getUsersByFilters(useCaseInput);

    expect(result).toEqual([]);
  });
});
