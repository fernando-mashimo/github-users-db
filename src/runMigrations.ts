import fs from "fs/promises";
import path from "path";
import { db } from "./infrastructure/config/database";

const MIGRATIONS_DIR = path.join(
  __dirname,
  "./infrastructure/database/migrations"
);

const runMigrations = async () => {
  try {
    const files = await fs.readdir(MIGRATIONS_DIR);

    const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();

    for (const file of sqlFiles) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      console.log(`Running migration file: ${file}...`);

      const sql = await fs.readFile(filePath, "utf8");
      await db.none(sql);

      console.log(`Successfully run migration file: ${file}`);
    }

    console.log("All migrations successfully ran");
  } catch (error) {
    console.error("Error executing migrations:", error);
    process.exit(1);
  }
};

runMigrations().finally(() => db.$pool.end());
