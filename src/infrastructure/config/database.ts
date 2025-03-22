import pgPromise from "pg-promise";
import { CONFIG } from "./environment";

const pgp = pgPromise();

const db = pgp({
  host: CONFIG.DB_HOST || "localhost",
  port: Number(CONFIG.DB_PORT) || 5432,
  database: CONFIG.DB_NAME || "github-db",
  user: CONFIG.DB_USER || "postgres",
  password: CONFIG.DB_PASSWORD || "password",
});

const closeDbConnection = () => {
  pgp.end();
};

export { db, closeDbConnection };
