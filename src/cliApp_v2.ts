#!/usr/bin/env ts-node
import { Command } from "commander";

import { getUsersByFilters } from "./application/useCases/getUsersByFilters";
import { fetchPersistUser } from "./application/useCases/fetchPersistUser";

const program = new Command();

program
  .command("fetch <username>")
  .description("Fetch user data from GitHub and persist it in the database")
  .action(async (username: string) => {
    try {
      const persistedUser = await fetchPersistUser({ username });
      if (persistedUser) {
        console.info(
          `User data successfully fetched and created/updated in the database!
          \nPersisted user data:`
        );
        console.info(persistedUser);
      }
    } catch (error) {
      console.error("An error occurred while fetching user data:", error);
    } finally {
      process.exit(0);
    }
  });

program
  .command("list")
  .description("List users in the database (with optional filters)")
  .option("-l, --location <location>", "Filter Users by location")
  .option(
    "-p, --programmingLanguage <programmingLanguage>",
    "Filter Users by programming language"
  )
  .action(async (options) => {
    const users = await getUsersByFilters(options);
    if (users && users.users.length) {
      const usersFormatted = users.users.map((user) => ({
        ...user,
        programmingLanguages: [...user.programmingLanguages],
      }));
      console.info("Found users data:", usersFormatted);
    }
    process.exit(0);
  });

program.parse(process.argv);
