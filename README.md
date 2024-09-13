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

## Task 1: Practices Used

1. **Session Management:**
   - Sessions are stored in **MongoDB**, and user information is cached in **Redis** with the same lifetime as the access token.
   - The session can be refreshed using a refresh token, also stored in **MongoDB**.
   - If the access token is not refreshed within an hour, the session is automatically deleted.

2. **Caching:**
   - Browser information and user payload are cached in **Redis** due to its high-speed data access and efficiency in handling frequently accessed information.

3. **Database:**
   - Main data is stored in **PostgreSQL** for its robust relational database capabilities, reliability, and support for complex queries and transactions, essential for data integrity and storing critical data.

4. **Server Clustering:**
   - Set up clustering to run the program in parallel across all threads. This improves server resource utilization and ensures high availability and performance.

5. **Data Validation & Error Handling:**
   - Added validation to ensure the accuracy of incoming data.
   - Implemented global error handlers to mitigate the risk of unforeseen errors and improve data processing reliability.

6. **Security:**
   - User passwords are stored in an encrypted format to maintain confidentiality.
   - Various strategies have been implemented to protect against attacks and secure the application.

---

## Task 2: System Design Discussion

### Scalability and Parallelism
- A **microservice architecture** is used to ensure scalability and parallelism. Each system component handles distinct functionality:
  - **Game server:** Distributes the load across multiple nodes to support multiple game sessions simultaneously.
  - **Caching system:** Provides quick access to frequently used data, reducing the load on databases.
  - **Gateway API:** Manages request routing and load balancing across services.

### Data Consistency
- The following strategies are used to ensure data consistency:
  - **Database clustering** for load balancing and high availability.
  - **Consensus protocols** (e.g., Paxos, Raft) ensure statefulness across replicas.
  - **Data replication** reduces delays when accessing data from different regions.

### Real-Time Communication
- **WebSockets** enable two-way communication between clients and servers for real-time updates.
- **Message queues** handle traffic spikes and process asynchronous requests.

### Security
- **OAuth2** and **OpenID Connect** are used for authentication and authorization, providing protection against unauthorized access.
- **Data encryption** is applied at all levels, both in transit and storage.
- **DDoS protection** is ensured using Web Application Firewalls (WAF) and specialized protection services.

### Disaster Recovery
- **Data backups** are regularly created for critical data.
- **Recovery plans** are in place to restore system operations in case of disruptions, including the use of backup data centers and emergency sites.

### Compromises
- **Latency vs. consistency:** In systems with high speed requirements, a reduced level of consistency may be necessary.
- **Scaling costs:** Increasing the number of services and databases can increase infrastructure and administrative costs.
