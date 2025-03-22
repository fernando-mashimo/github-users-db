import axios from "axios";
import { CONFIG } from "../config/environment";

export type UserData = {
  plainData: {
    name: string;
    location: string;
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
    [key: string]: string | number | boolean | object | null;
  };
  repositories: {
    language: string;
    [key: string]: string | number | boolean | object | null;
  }[];
};

export const getUserData = async (username: string): Promise<UserData> => {
  const userDataUrl = `https://api.github.com/users/${username}`;
  const userRepositoriesUrl = `https://api.github.com/users/${username}/repos`;

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${CONFIG.GITHUB_API_TOKEN}`,
  };

  const [userDataResponse, userReposResponse] = await Promise.all([
    axios.get(userDataUrl, { headers }),
    axios.get(userRepositoriesUrl, { headers }),
  ]);

  const userData = userDataResponse.data;
  const userRepos = userReposResponse.data;

  return {
    plainData: userData,
    repositories: userRepos,
  };
};
