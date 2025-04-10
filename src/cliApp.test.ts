import { fetchAndPersistUser } from "./application/useCases/fetchPersistUser";
import { getUsersByFilters } from "./application/useCases/getUsersByFilters";
import { main } from "./cliApp";
import { User } from "./domain/entities/user";

const originalArgv = process.argv;

const mockedUser: User = {
  username: "mocked-username",
  location: "test location",
  programmingLanguages: ["test"],
  externalId: 0,
  name: "Mocked Name",
  email: "mocked@email.com",
  pageUrl: "mocked-url",
  avatarUrl: "mocked-avatar-url",
  bio: "mocked bio",
  createdAt: new Date("2025-01-01T00:00:00Z").toLocaleString(),
};

const expectedUser = {
  ...mockedUser,
  createdAt: new Date(mockedUser.createdAt).toLocaleString("en-US", {
    timeZone: "America/Sao_Paulo",
  }),
  programmingLanguages: mockedUser.programmingLanguages.join(", "),
};

const invalidArgumentsMessage =
  "Invalid arguments. Please use one of the following commands:\n" +
  "  'gh-users fetch <username>'\n" +
  "  'gh-users list [-l or --location <location>] " +
  "[-p or --programmingLanguages <programmingLanguages>]'.";

jest.mock("./application/useCases/getUsersByFilters", () => ({
  getUsersByFilters: jest.fn(),
}));

jest.mock("./application/useCases/fetchPersistUser", () => ({
  fetchPersistUser: jest.fn(),
}));

afterEach(() => {
  process.argv = originalArgv;
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("Should list users", () => {
  test("when list command provided with no parameters", async () => {
    process.argv = ["node", "script", "list"];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "table");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(expectedUser);
  });

  test("when list command provided with -l parameter", async () => {
    process.argv = ["node", "script", "list", "-l", "test location"];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "table");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(expectedUser);
  });

  test("when list command provided with -p parameter", async () => {
    process.argv = ["node", "script", "list", "-p", "test"];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "table");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(expectedUser);
  });

  test("when list command provided with --location parameter", async () => {
    process.argv = ["node", "script", "list", "--location", "test location"];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "table");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(expectedUser);
  });

  test("when list provided with --programmingLanguages parameter", async () => {
    process.argv = [
      "node",
      "script",
      "list",
      "--programmingLanguages",
      "test1,test2",
    ];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "table");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(expectedUser);
  });

  test("when list provided with -l and -p parameters", async () => {
    process.argv = [
      "node",
      "script",
      "list",
      "-l",
      "test location",
      "-p",
      "test",
    ];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "table");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(expectedUser);
  });

  test("when provided --location and --programmingLanguages", async () => {
    process.argv = [
      "node",
      "script",
      "list",
      "--location",
      "test location",
      "--programmingLanguages",
      "test1,test2",
    ];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "table");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(expectedUser);
  });
});

describe("Should not list users", () => {
  test("when not provided value for a parameter", async () => {
    process.argv = ["node", "script", "list", "-l"];
    const consoleSpy = jest.spyOn(console, "error");

    const exitCode = await main();

    expect(exitCode).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(invalidArgumentsMessage);
  });

  test("when one of the options provided is not valid", async () => {
    process.argv = ["node", "script", "list", "-x", "test"];
    const consoleSpy = jest.spyOn(console, "error");

    const exitCode = await main();

    expect(exitCode).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(invalidArgumentsMessage);
  });

  test("when no users with provided filters have been found", async () => {
    process.argv = ["node", "script", "list", "-l", "test location"];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([]);
    const consoleSpy = jest.spyOn(console, "info");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      "No users found with the given filters in the database"
    );
  });

  test("when no users have been found in the database", async () => {
    process.argv = ["node", "script", "list"];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([]);
    const consoleSpy = jest.spyOn(console, "info");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith("No users found in the database");
  });
});

describe("Should fetch/persist user data", () => {
  test("when provided a username", async () => {
    process.argv = ["node", "script", "fetch", "test-username"];
    const consoleTableSpy = jest.spyOn(console, "table");
    const consoleInfoSpy = jest.spyOn(console, "info");
    (fetchAndPersistUser as jest.Mock).mockResolvedValueOnce(mockedUser);

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleTableSpy).toHaveBeenCalledWith(expectedUser);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      "User data successfully fetched and created/updated in the database!"
    );
  });
});

describe("Should not fetch/persist user data", () => {
  test("when not provided a username", async () => {
    process.argv = ["node", "script", "fetch"];
    const consoleSpy = jest.spyOn(console, "error");

    const exitCode = await main();

    expect(exitCode).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(invalidArgumentsMessage);
  });
});

describe("Should not list nor fetch/persist user data", () => {
  test("when not provided a command argument", async () => {
    process.argv = ["node", "script"];
    const consoleSpy = jest.spyOn(console, "error");

    const exitCode = await main();

    expect(exitCode).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(invalidArgumentsMessage);
  });

  test("when provided command argument is not 'fetch' nor 'list'", async () => {
    process.argv = ["node", "script", "invalidCommand"];
    const consoleSpy = jest.spyOn(console, "error");

    const exitCode = await main();

    expect(exitCode).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(invalidArgumentsMessage);
  });
});
