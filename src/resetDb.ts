import fs from "fs/promises";
import path from "path";
import { db } from "./infrastructure/config/database";

const ROLLBACK_DIR = path.join(
  __dirname,
  "./infrastructure/database/migrations/rollback"
);

const resetDb = async () => {
  try {
    const files = await fs.readdir(ROLLBACK_DIR);

    const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();

    for (const file of sqlFiles) {
      const filePath = path.join(ROLLBACK_DIR, file);
      console.log(`Resetting database with file: ${file}...`);

      const sql = await fs.readFile(filePath, "utf8");
      await db.none(sql);

      console.log(`Successfully resetted database with file: ${file}`);
    }

    console.log("Database reset completed");
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
};

resetDb().finally(() => db.$pool.end());
