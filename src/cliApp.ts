#!/usr/bin/env ts-node
import { fetchPersistUser } from "./application/useCases/fetchPersistUser";
import { getUsersByFilters } from "./application/useCases/getUsersByFilters";

type Arguments = {
  command: "fetch" | "list";
  username?: string;
  location?: string;
  programmingLanguage?: string;
};

const validateArguments = (args: string[]): boolean => {
  const allowedCommands = ["fetch", "list"];
  const allowedOptions = ["-l", "--location", "-p", "--programmingLanguage"];

  if (args.length < 3 || !allowedCommands.includes(args[2])) return false;

  if (args[2] === "list") {
    const options = args.slice(3);
    if (options.length === 0) return true;

    if (options.length % 2 !== 0) return false;

    const isOptionsValid = options.every((_, i) =>
      i % 2 === 0 ? allowedOptions.includes(options[i]) : true
    );
    return isOptionsValid;
  }

  return args.length === 4; // when args[2] === "fetch"
};

const parseArguments = (args: string[]): Arguments => {
  const command = args[2] as Arguments["command"];

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

  return { command, username: args[3] };
};

export const main = async (): Promise<number> => {
  const isArgumentsValid = validateArguments(process.argv);
  if (!isArgumentsValid) {
    console.error(
      "Invalid arguments. Please use one of the following commands:\n" +
        "  'gh-users fetch <username>'\n" +
        "  'gh-users list [-l or --location <location>] " +
        "[-p or --programmingLanguage <programmingLanguage>]'."
    );
    return 1;
  }

  const argument = parseArguments(process.argv);

  if (argument.command === "fetch") {
    try {
      const persistedUser = await fetchPersistUser({
        username: argument.username!,
      });
      if (persistedUser) {
        console.info("Persisted user data:", persistedUser);
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
      if (users && users.length) {
        console.info("Found users data:", users);
      }
    } catch (error) {
      console.error("An error occurred while fetching users:", error);
      return 1;
    }
  }

  return 0;
};

if (require.main === module) {
  (async () => {
    const exitCode = await main();
    process.exit(exitCode);
  })();
}
