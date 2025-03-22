# github-users-db
This application retrieves, persists and displays users' data from GitHub through CLI commands.

Before running any command on terminal, let's make sure that:
- you have a GitHub personal access token (classic)
  - in case you still do not hold an access token, see:
  🔗 https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic
- you have Docker and Docker Compose installed and ready
  - if you do not have any of these components ready, see:
    - 🔗 **Docker**: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
    - 🔗 **Docker Compose**: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)  
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
// add migrations

Additional commands:
- npm run lint: checks code compliance to the defined formatting rules:
  - line max length: 80 chars;
  - indentation: 2 spaces, no tab;

TO DO:
- add an Entity Relationship Diagram, if needed
- update env.example