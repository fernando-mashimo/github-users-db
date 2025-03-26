import { fetchPersistUser } from "./application/useCases/fetchPersistUser";
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
  createdAt: "mocked date",
};

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
    const consoleSpy = jest.spyOn(console, "info");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith("Found users data:", [mockedUser]);
  });

  test("when list command provided with -l parameter", async () => {
    process.argv = ["node", "script", "list", "-l", "test location"];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "info");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith("Found users data:", [mockedUser]);
  });

  test("when list command provided with -p parameter", async () => {
    process.argv = ["node", "script", "list", "-p", "test"];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "info");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith("Found users data:", [mockedUser]);
  });

  test("when list command provided with --location parameter", async () => {
    process.argv = ["node", "script", "list", "--location", "test location"];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "info");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith("Found users data:", [mockedUser]);
  });

  test("when list provided with --programmingLanguage parameter", async () => {
    process.argv = ["node", "script", "list", "--programmingLanguage", "test"];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "info");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith("Found users data:", [mockedUser]);
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
    const consoleSpy = jest.spyOn(console, "info");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith("Found users data:", [mockedUser]);
  });

  test("when provided --location and --programmingLanguage", async () => {
    process.argv = [
      "node",
      "script",
      "list",
      "--location",
      "test location",
      "--programmingLanguage",
      "test",
    ];

    (getUsersByFilters as jest.Mock).mockResolvedValueOnce([mockedUser]);
    const consoleSpy = jest.spyOn(console, "info");

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith("Found users data:", [mockedUser]);
  });
});

describe("Should not list users", () => {
  test("when not provided value for a parameter", async () => {
    process.argv = ["node", "script", "list", "-l"];
    const consoleSpy = jest.spyOn(console, "error");

    const exitCode = await main();

    expect(exitCode).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Invalid arguments. Please use one of the following commands:\n" +
        "  'gh-users fetch <username>'\n" +
        "  'gh-users list [-l or --location <location>] " +
        "[-p or --programmingLanguage <programmingLanguage>]'."
    );
  });

  test("when one of the options provided is not valid", async () => {
    process.argv = ["node", "script", "list", "-x", "test"];
    const consoleSpy = jest.spyOn(console, "error");

    const exitCode = await main();

    expect(exitCode).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Invalid arguments. Please use one of the following commands:\n" +
        "  'gh-users fetch <username>'\n" +
        "  'gh-users list [-l or --location <location>] " +
        "[-p or --programmingLanguage <programmingLanguage>]'."
    );
  });
});

describe("Should fetch/persist user data", () => {
  test("when provided a username", async () => {
    process.argv = ["node", "script", "fetch", "test-username"];
    const consoleSpy = jest.spyOn(console, "info");
    (fetchPersistUser as jest.Mock).mockResolvedValueOnce(mockedUser);

    const exitCode = await main();

    expect(exitCode).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith("Persisted user data:", mockedUser);
  });
});

describe("Should not fetch/persist user data", () => {
  test("when not provided a username", async () => {
    process.argv = ["node", "script", "fetch"];
    const consoleSpy = jest.spyOn(console, "error");

    const exitCode = await main();

    expect(exitCode).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Invalid arguments. Please use one of the following commands:\n" +
        "  'gh-users fetch <username>'\n" +
        "  'gh-users list [-l or --location <location>] " +
        "[-p or --programmingLanguage <programmingLanguage>]'."
    );
  });
});

describe("Should not list nor fetch/persist user data", () => {
  test("when not provided a command argument", async () => {
    process.argv = ["node", "script"];
    const consoleSpy = jest.spyOn(console, "error");

    const exitCode = await main();

    expect(exitCode).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Invalid arguments. Please use one of the following commands:\n" +
        "  'gh-users fetch <username>'\n" +
        "  'gh-users list [-l or --location <location>] " +
        "[-p or --programmingLanguage <programmingLanguage>]'."
    );
  });

  test("when provided command argument is not 'fetch' nor 'list'", async () => {
    process.argv = ["node", "script", "invalidCommand"];
    const consoleSpy = jest.spyOn(console, "error");

    const exitCode = await main();

    expect(exitCode).toBe(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Invalid arguments. Please use one of the following commands:\n" +
        "  'gh-users fetch <username>'\n" +
        "  'gh-users list [-l or --location <location>] " +
        "[-p or --programmingLanguage <programmingLanguage>]'."
    );
  });
});
