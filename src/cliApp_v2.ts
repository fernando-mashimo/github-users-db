#!/usr/bin/env ts-node
import { Command } from "commander";
import { getUsersByFilters } from "./application/useCases/getUsersByFilters";
import { fetchAndPersistUser } from "./application/useCases/fetchPersistUser";
import dotenv from "dotenv";
dotenv.config();

const program = new Command();

program
  .command("fetch <username>")
  .description("Fetch user data from GitHub and persist it in the database")
  .action(async (username: string) => {
    try {
      const persistedUser = await fetchAndPersistUser({ username });
      if (persistedUser) {
        console.info("Persisted user data:");
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
    "-p, --programmingLanguages <programmingLanguages>",
    "Filter Users by programming languages"
  )
  .action(async (options) => {
    const location = options.location || undefined;
    const programmingLanguages =
      options.programmingLanguages?.split(",") || undefined;
    const users = await getUsersByFilters({ location, programmingLanguages });
    if (users && users.length) {
      console.info("Found users data:", users);
    }
    process.exit(0);
  });

program.parse(process.argv);
