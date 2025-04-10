import fs from "fs/promises";
import path from "path";
import { db } from "./infrastructure/config/database";

const SEEDS_DIR = path.join(__dirname, "./infrastructure/database/seeds");

const runSeeds = async () => {
  try {
    const files = await fs.readdir(SEEDS_DIR);

    const sqlFiles = files.filter((file) => file.endsWith(".sql")).sort();

    for (const file of sqlFiles) {
      const filePath = path.join(SEEDS_DIR, file);
      console.log(`Seeding DB from file: ${file}...`);

      const sql = await fs.readFile(filePath, "utf8");
      await db.none(sql);

      console.log(`Successfully seeded from file: ${file}`);
    }

    console.log("All seeds successfully ran");
  } catch (error) {
    console.error("Error seeding database:", error);
    return;
  }
};

runSeeds().finally(() => db.$pool.end());
