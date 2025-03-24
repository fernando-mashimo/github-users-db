import axios, { AxiosError } from "axios";
import { CONFIG } from "../config/environment";
import { User } from "../../domain/entities/user";

type FetchedUserData = {
  id: number;
  login: string;
  name: string;
  location: string;
  email: string;
  html_url: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  [key: string]: string | number | boolean | object | null;
};

type FetchedReposData = {
  language: string;
  [key: string]: string | number | boolean | object | null;
}[];

export const fetchUserDataFromGitHub = async (
  username: string
): Promise<User | undefined> => {
  try {
    const userDataUrl = `https://api.github.com/users/${username}`;
    const reposDataUrl = `https://api.github.com/users/${username}/repos`;

    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${CONFIG.GITHUB_API_TOKEN}`,
    };

    const [userDataResponse, reposDataResponse] = await Promise.all([
      axios.get(userDataUrl, { headers }),
      axios.get(reposDataUrl, { headers }),
    ]);

    return userDataMapper(userDataResponse.data, reposDataResponse.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 401)
        console.error(`HTTP Error: ${error.status}: Unauthorized credentials`);
      if (error.status === 403)
        console.error(`HTTP Error: ${error.status}: Forbidden access`);
      if (error.status === 404)
        console.error(
          `HTTP Error: ${error.status} - User with username ` +
            `${username} not found at GitHub.`
        );
      return undefined;
    }
    console.error("Some error has occurred while fetching user data", error);
    return undefined;
  }
};

const userDataMapper = (
  fetchedUserData: FetchedUserData,
  fetchedReposData: FetchedReposData
): User => {
  const programmingLanguages = Array.from(
    new Set<string>(fetchedReposData.map((repos) => repos.language))
  ).filter((language) => language);

  return {
    externalId: fetchedUserData.id,
    username: fetchedUserData.login,
    name: fetchedUserData.name,
    location: fetchedUserData.location,
    email: fetchedUserData.email,
    pageUrl: fetchedUserData.html_url,
    avatarUrl: fetchedUserData.avatar_url,
    bio: fetchedUserData.bio,
    createdAt: fetchedUserData.created_at,
    programmingLanguages,
  };
};
