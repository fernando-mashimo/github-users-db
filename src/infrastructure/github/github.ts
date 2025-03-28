import axios, { AxiosError } from "axios";
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

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
};

export const fetchUserDataFromGitHub = async (
  username: string
): Promise<User | undefined> => {
  try {
    const [userDataResponse, reposDataResponse] = await Promise.all([
      fetchUserBaseData(username),
      fetchUserReposData(username),
    ]);
    return userDataMapper(userDataResponse, reposDataResponse);
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

const fetchUserBaseData = async (
  username: string
): Promise<FetchedUserData> => {
  const userDataUrl = `https://api.github.com/users/${username}`;

  const response = await axios.get(userDataUrl, { headers });

  return response.data;
};

const fetchUserReposData = async (
  username: string
): Promise<FetchedReposData> => {
  const reposDataUrl = `https://api.github.com/users/${username}/repos`;

  const response = await axios.get(reposDataUrl, { headers });

  if (response.headers.link) {
    const lastPage = parseInt(
      response.headers.link
        .split(", ")
        // eslint-disable-next-line prettier/prettier
        .find((link: string) => link.includes("rel=\"last\""))!
        .match(/page=(\d+)>; rel="last"/)![1]
    );

    // Create an array with the page numbers to fetch.
    // Since first page is already fetched, the array:
    // - has a length of (lastPage - 1) elements
    // - starts from 2
    const pages = Array.from({ length: lastPage - 1 }, (_, index) => index + 2);

    const additionalReposData = await Promise.all(
      pages.map((page) =>
        axios.get(`${reposDataUrl}?page=${page}`, { headers })
      )
    );

    const allReposData = additionalReposData.reduce(
      (acc, additionalData) => acc.concat(additionalData.data),
      response.data
    );

    return allReposData;
  }

  return response.data;
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
    location: fetchedUserData.location ?? "",
    email: fetchedUserData.email,
    pageUrl: fetchedUserData.html_url,
    avatarUrl: fetchedUserData.avatar_url,
    bio: fetchedUserData.bio,
    createdAt: fetchedUserData.created_at,
    programmingLanguages,
  };
};
