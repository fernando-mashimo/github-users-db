import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();

const pgp = pgPromise();

const db = pgp({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "github-db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
});

const closeDbConnection = () => {
  pgp.end();
};

export { db, closeDbConnection };
