# TaskFlow

A simple task management web application built with HTML, CSS, JavaScript, Node.js, Express and SQLite.

## Project structure

```text
TaskFlow/
├── database/
│   └── tasks.db          # Created automatically when the server starts
├── public/
│   ├── index.html        # Page structure
│   ├── style.css         # Page styling
│   └── script.js         # Browser interactions and API calls
├── src/
│   └── server.js         # Express server, API routes and SQLite operations
└── package.json
```

## Requirements

- Node.js and npm
- An internet connection for the initial dependency installation

## Run the application

1. Open this folder in VS Code.
2. Open a terminal in the project root (the folder containing `package.json`).
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the backend:

   ```bash
   npm start
   ```

5. Open `http://localhost:3000` in your browser.

Keep the terminal open while using the application. Stop the server with `Ctrl + C`.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Add a task |
| PATCH | `/api/tasks/:id` | Update a task's completed status |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Check backend status |

## Database

The server creates `database/tasks.db` and the `tasks` table automatically if they do not already exist. The table contains:

- `id`: unique task identifier
- `title`: task description
- `completed`: `0` for incomplete and `1` for completed

The database file is intentionally not included in the ZIP. It is generated automatically when you run the server. Keep the `database` folder in the project.

## Architecture summary

- **Presentation tier:** HTML, CSS and browser-side JavaScript.
- **Application tier:** One Node.js + Express backend (monolithic), containing API routes, task handling and database access responsibilities.
- **Data tier:** SQLite database file.

The frontend communicates with the backend using HTTP requests and JSON. The backend communicates with SQLite using SQL queries through `better-sqlite3`.

## Notes for the presentation

- This is a local demonstration application; it is not configured for public deployment.
- Redis caching, Amazon SQS and AWS Lambda are not implemented. They are only possible future additions discussed in the architecture presentation.
- The backend's PATCH and DELETE handlers are intentionally simple and do not check whether the requested task ID exists before returning their success message.
