import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getUserInformation } from "./github";

const axiosMock = new MockAdapter(axios);

const fetchedUserDataMock = {
  id: 109400329,
  name: "Fernando Mashimo",
  location: "São Paulo, Brazil",
  email: null,
  avatar_url: "https://avatars.githubusercontent.com/u/109400329?v=4",
  html_url: "https://github.com/fernando-mashimo",
  hireable: null,
  bio: "Kinda nerd and geek.\r\n#back-end",
  created_at: "2022-07-16T03:00:21Z",
};

const fetchedReposDataMock = [
  {
    language: "TypeScript",
  },
  {
    language: "JavaScript",
  },
];

beforeEach(() => jest.restoreAllMocks());
afterEach(() => axiosMock.reset());

describe("Should return requested user data", () => {
  const username = "some-username";

  test("when user with provided username exists on Git Hub", async () => {
    axiosMock
      .onGet(`https://api.github.com/users/${username}`)
      .reply(200, fetchedUserDataMock);

    axiosMock
      .onGet(`https://api.github.com/users/${username}/repos`)
      .reply(200, fetchedReposDataMock);

    const result = await getUserInformation(username);

    expect(result).toEqual({
      externalId: fetchedUserDataMock.id,
      name: fetchedUserDataMock.name,
      location: fetchedUserDataMock.location,
      email: fetchedUserDataMock.email,
      pageUrl: fetchedUserDataMock.html_url,
      avatarUrl: fetchedUserDataMock.avatar_url,
      bio: fetchedUserDataMock.bio,
      createdAt: fetchedUserDataMock.created_at,
      programmingLanguages: ["TypeScript", "JavaScript"],
    });
  });
});

describe("Should not return requested user data", () => {
  test("when user with provided username does not exist", async () => {
    const username = "non-existent-username";
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    axiosMock
      .onGet(`https://api.github.com/users/${username}`)
      .reply(404, { message: "Not Found" });

    const result = await getUserInformation(username);

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      `HTTP Error: 404 - User with username ${username} not found at GitHub.`
    );
  });

  test("when requester credentials are invalid", async () => {
    const username = "any-username";
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    axiosMock
      .onGet(`https://api.github.com/users/${username}`)
      .reply(401, { message: "Bad credentials" });

    const result = await getUserInformation(username);

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      "HTTP Error: 401: Unauthorized credentials"
    );
  });

  test("when credentials are forbidden to get the resource", async () => {
    const username = "any-username";
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    axiosMock
      .onGet(`https://api.github.com/users/${username}`)
      .reply(403, { message: "Forbidden" });

    const result = await getUserInformation(username);

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      "HTTP Error: 403: Forbidden access"
    );
  });
});
