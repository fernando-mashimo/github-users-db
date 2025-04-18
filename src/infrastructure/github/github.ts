import axios, { AxiosError } from "axios";
import { User } from "../../domain/entities/user";

const GITHUB_API_BASE_URL = "https://api.github.com";

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  Authorization: process.env.GITHUB_API_TOKEN
    ? `Bearer ${process.env.GITHUB_API_TOKEN}`
    : "",
};

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

export const getUserInformation = async (
  username: string
): Promise<User | undefined> => {
  const userRawData = await fetchUserDataFromGitHub(username);

  if (!userRawData) return;

  return userDataMapper(userRawData.userData, userRawData.reposData);
};

export const fetchUserDataFromGitHub = async (
  username: string
): Promise<
  { userData: FetchedUserData; reposData: FetchedReposData } | undefined
> => {
  try {
    const [userDataResponse, reposDataResponse] = await Promise.all([
      fetchDataFromGitHub(
        `${GITHUB_API_BASE_URL}/users/${username}`
      ) as Promise<FetchedUserData>,
      fetchDataFromGitHub(
        `${GITHUB_API_BASE_URL}/users/${username}/repos`
      ) as Promise<FetchedReposData>,
    ]);

    return {
      userData: userDataResponse,
      reposData: reposDataResponse,
    };
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
      return;
    }
    console.error("Some error has occurred while fetching user data", error);
    return;
  }
};

const fetchDataFromGitHub = async (
  url: string
): Promise<FetchedUserData | FetchedReposData> => {
  const response = await axios.get(url, { headers });

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

    const additionalData = await Promise.allSettled(
      pages.map((page) => axios.get(`${url}?page=${page}`, { headers }))
    );

    return additionalData.reduce(
      (acc, currAdditionalData) =>
        currAdditionalData.status === "fulfilled"
          ? acc.concat(currAdditionalData.value.data)
          : acc,
      response.data
    );
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
