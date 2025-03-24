#!/usr/bin/env ts-node
import { Command } from "commander";
// eslint-disable-next-line max-len
import { getUsersByFilters } from "../../application/useCases/getUsersByFilters";
import { fetchPersistUser } from "../../application/useCases/fetchPersistUser";

const program = new Command();

program
  .command("fetch <username>")
  .description("Fetch user data from GitHub and persist it in the database")
  .action(async (username: string) => {
    await fetchPersistUser({ username });
    process.exit(1);
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
    if (users) console.info(users);
    process.exit(1);
  });

program.parse(process.argv);
