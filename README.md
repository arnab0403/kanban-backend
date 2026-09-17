# Kanban Backend

A REST API for managing Kanban tasks. It is built with Node.js, Express, and TypeScript and uses an in-memory repository for storage.

## Architecture

The project follows the **Controller-Service-Repository (CSR)** pattern:

```text
HTTP request
    |
Route -> Controller -> Service -> Repository -> In-memory task array
            |           |
        HTTP response  Business logic and events
```

- **Controller:** Receives HTTP requests, calls the appropriate service method, and sends an HTTP response.
- **Service:** Contains business logic, validation, task operations, and event publishing.
- **Repository:** Provides data-access methods and manages the in-memory task array.

This separation keeps request handling, business rules, and data access independent and easier to maintain.

## Project Structure

```text
kanban-backend/
|-- src/
|   |-- task/
|   |   |-- data.json           # Sample task data
|   |   |-- task.controller.ts  # Request and response handling
|   |   |-- task.events.ts      # Task event definitions and EventEmitter
|   |   |-- task.model.ts       # TypeScript types and interfaces
|   |   |-- task.repository.ts  # In-memory data access
|   |   |-- task.routes.ts      # API route definitions
|   |   `-- task.service.ts     # Business logic and validation
|   |-- app.ts                  # Express application and middleware setup
|   `-- server.ts               # Starts the HTTP server
|-- package.json                # Scripts and dependencies
|-- package-lock.json           # Locked dependency versions
`-- tsconfig.json               # TypeScript compiler configuration
```

## Packages Used

### Runtime dependencies

- **express:** Creates the HTTP server and API routes.
- **cors:** Allows requests from the frontend running at `http://localhost:3000`.
- **morgan:** Logs incoming HTTP requests during development.

### Development dependencies

- **typescript:** Adds static typing and compiles the source code to JavaScript.
- **@types/node:** Provides Node.js type definitions.
- **@types/express:** Provides Express type definitions.
- **@types/cors:** Provides CORS type definitions.
- **@types/morgan:** Provides Morgan type definitions.

## Requirements

- Node.js 22.18 or newer
- npm

## Installation

Clone the repository, open the project directory, and install its dependencies:

```bash
npm install
```

## Running the Project

Start the development server with file watching:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

To create and run a production build:

```bash
npm run build
npm start
```

Compiled files are written to the `dist` directory.

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/` | Check whether the server is running |
| `GET` | `/api/board` | Get all tasks |
| `GET` | `/api/user` | Get all unique, non-empty assignee names |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/:id` | Partially update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/events` | Subscribe to task events using Server-Sent Events (SSE) |

## Data Storage

Tasks are currently stored in an in-memory array inside `task.repository.ts`. Changes are lost whenever the server restarts. The repository layer can later be replaced with a database implementation without moving data-access logic into controllers or services.
