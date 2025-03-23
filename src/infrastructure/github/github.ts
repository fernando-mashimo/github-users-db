import axios, { AxiosError } from "axios";
import { CONFIG } from "../config/environment";

export type UserData = {
  plainData: {
    id: string;
    name: string;
    location: string;
    email: string;
    html_url: string;
    avatar_url: string;
    created_at: string;
    [key: string]: string | number | boolean | object | null;
  };
  repositories: {
    language: string;
    [key: string]: string | number | boolean | object | null;
  }[];
};

export const getUserData = async (
  username: string
): Promise<UserData | undefined> => {
  try {
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
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 401)
        console.error(`Error: ${error.status}: Unauthorized credentials`);
      if (error.status === 403)
        console.error(`Error: ${error.status}: Forbidden access`);
      if (error.status === 404)
        console.error(
          `Error: ${error.status} - User with username ${username} not found.`
        );
      return undefined;
    }
    console.error("Some error has occurred while fetching user data", error);
    return undefined;
  }
};
