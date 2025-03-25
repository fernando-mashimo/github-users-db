#!/usr/bin/env ts-node
import { fetchPersistUser } from "./application/useCases/fetchPersistUser";
import { getUsersByFilters } from "./application/useCases/getUsersByFilters";
import { User } from "./domain/entities/user";

type Arguments = {
  command: "fetch" | "list" | "invalid";
  username?: string;
  location?: string;
  programmingLanguage?: string;
};

const formatUsers = (users: User[]): User[] => {
  return users.map((user) => ({
    ...user,
    programmingLanguages: [...user.programmingLanguages],
  }));
};

const parseArguments = (args: string[]): Arguments => {
  const command =
    args[2] === "fetch" || args[2] === "list" ? args[2] : "invalid";

  if (command === "fetch") return { command, username: args[3] };

  if (command === "list") {
    const location = args.includes("-l")
      ? args[args.indexOf("-l") + 1]
      : args.includes("--location")
        ? args[args.indexOf("--location") + 1]
        : undefined;
    const programmingLanguage = args.includes("-p")
      ? args[args.indexOf("-p") + 1]
      : args.includes("--programmingLanguage")
        ? args[args.indexOf("--programmingLanguage") + 1]
        : undefined;

    return {
      command,
      location,
      programmingLanguage,
    };
  }

  return { command };
};

const main = async (): Promise<number> => {
  const argument = parseArguments(process.argv);

  if (argument.command === "invalid") {
    console.error(
      "Invalid command. Please use 'gh-users fetch' or 'gh-users list'."
    );
    return 1;
  }

  if (argument.command === "fetch") {
    if (!argument.username || process.argv.length > 4) {
      console.error("Please provide one username to fetch user data.");
      return 1;
    }

    try {
      const persistedUser = await fetchPersistUser({
        username: argument.username,
      });
      if (persistedUser) {
        console.info(
          `User data successfully fetched and created/updated in the database!
              \nPersisted user data:`
        );
        console.info(persistedUser);
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching and persisting user data:",
        error
      );
      return 1;
    }
  }

  if (argument.command === "list") {
    try {
      const users = await getUsersByFilters({
        location: argument.location,
        programmingLanguage: argument.programmingLanguage,
      });
      if (users && users.users.length) {
        const usersFormatted = formatUsers(users.users);
        console.info("Found users data:", usersFormatted);
      }
    } catch (error) {
      console.error("An error occurred while fetching users:", error);
      return 1;
    }
  }

  return 0;
};

(async () => {
  const exitCode = await main();
  process.exit(exitCode);
})();
