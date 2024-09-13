# Prerequisites

-   Ensure you have **Node.js version 20.17.0** and **npm version 10.8.3** installed.
-   Install the required dependencies by running the following command:

```bash
npm install
```

# Running the Server

To run the server, use the following commands:

### Start in production mode

```bash
npm run start
```

### Start in development mode

```bash
npm run start:dev
```

### Build the project

```bash
npm run build
```

# Required Environment Variables

Make sure to define the following environment variables before running the application:

-   `POSTGRES_HOST`: The host address for the database.
-   `POSTGRES_PORT`: The port used to connect to the database.
-   `POSTGRES_USER`: The username for database authentication.
-   `POSTGRES_PASSWORD`: The password for database authentication.
-   `POSTGRES_DB`: The postgres database.
-   `JWT_SECRET`: The secret key used to sign JWT tokens.
-   `REDIS_URL`: The Redis server url.
-   `MONGODB_URI`: The mongo uri.

Ensure these variables are set in your `.env` file or environment before starting the server.
