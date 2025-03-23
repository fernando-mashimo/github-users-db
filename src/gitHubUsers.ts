// import { db, closeDbConnection } from "./infrastructure/config/database";
import dotenv from "dotenv";
import { getUserData } from "./infrastructure/github/github";

export const gitHubUsers = async () => {
  dotenv.config();

  const userData = await getUserData("fernando-mashimo");
  console.log("User data:", userData);
};

gitHubUsers();
