export type FetchAndPersistUserDataUseCaseOutput =
  | {
      userName: string;
      name: string;
      location: string;
      email: string;
      pageUrl: string;
      avatarUrl: string;
      bio: string;
      createdAt: string;
      programmingLanguages: string[];
    }
  | undefined;
