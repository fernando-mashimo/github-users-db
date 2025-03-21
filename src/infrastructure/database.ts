import pgPromise from "pg-promise";

const pgp = pgPromise();

const db = pgp({
  host: "localhost",
  port: 5432,
  database: "github-db",
  user: "postgres",
  password: "password",
});

const closeDbConnection = () => {
  pgp.end();
};

export { db, closeDbConnection };
