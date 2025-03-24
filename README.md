# github-users-db

Simple application to retrieve, persist and display GitHub users' data through CLI commands. It's been designed to run in Node.js (version 18 or above recommended).

## Pre-requisites

Before running any command on terminal, please make sure that:

- you have Node.js installed (version 18 or later recommended):
  - run the command "node -v" in the terminal.
    - if the output format is like "v18.xx.y", you are good to go.
    - otherwise, you should install Node.
      - At first, install NVM. See: 🔗 https://github.com/nvm-sh/nvm
      - Proceed installing Node.js through NVM commands.
- you have Docker and Docker Compose installed and ready
  - if you do not have any of these components ready, see:
    - 🔗 **Docker**: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
    - 🔗 **Docker Compose**: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)
- you have a GitHub personal access token (classic)
  - in case you still do not hold an access token, see:
    🔗 https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic
- you have created a .env file in the project root directory and added the following variables:
  - GITHUB_API_TOKEN="your GitHub personal access token"
  - DB_HOST=localhost
  - DB_PORT=5432
  - DB_NAME=github-db
  - DB_USER=postgres
  - DB_PASSWORD=postgres

Now, let's enable the local environment to run the application. Please, run the following commands:

- npm install: to install required Node packages;
- docker compose up -d: to start up the database container
- npm run migrations: to create the database tables
  - alternatively run "npm run migrations:seeds" to also seed fictional data into the tables
- npm link: required to make the CLI application globally available (through the command "gh-users").

## Running the CLI app
### Main commands
Once you have fulfilled all pre-requisites and run all prep commands, you may start using the app by running the following commands in the terminal:

- gh-users fetch "GitHub user name": to fetch user's data from GitHub (through its official public API) and persist them in the locally run PostgreSQL database.
  - example: `gh-users fetch fernando-mashimo`
  - expected behavior: should fetch user "fernando-mashimo" data from GitHub and persist them in the database.
- gh-users list: to fetch and display a list of all users persisted in the database.
  - optional parameters (mixed use available): to fetch and display a list of users filtered according to the parameters (filters) provided.
    - "-l location" or "--location location"
    - "-p programmingLanguage" or "--programmingLanguage programmingLanguage"
      - example: `gh-users list -l "US" -p "Java"`
      - expected behavior: should fetch and display data from database related to users who are based in the US and have proven knowledge/experience with Java programming language.

### Additional commands
- npm run lint: checks code compliance to the defined formatting rules:
  - line max length: 80 chars;
  - indentation: 2 spaces, no tab;
- npm run reset-db: in case you wish to purge database tables. Just make sure to run "npm run migration" again.
- npm run test <testFileName.test.ts>: runs tests with Jest.

## Database Structure

The database tables are structured according to the below ERD:

![ERD Diagram](./ERD.png)

## Technical Choices

### Commander.js (CLI tool)

Commander.js is a popular npm package used to create CLI applications in Node.js. It provides a simple way to define commands, handle arguments and options, and display help messages. While it was perfectly possible to build a CLI parser using process.argv, Commander.js was chosen to be used instead, due to providing a robust, reliable and easy-to-use solution that reduces development time, improves maintainability, and enhances user experience.
