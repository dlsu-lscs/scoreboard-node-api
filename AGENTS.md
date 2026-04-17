# AGENTS.md

## Project Overview

Backend API for LSCS Members' scoreboard built with Node.js, Express, and MySQL. Provides authentication and score management functionality.

## Setup Commands

- Install dependencies: `npm install`
- Copy environment template: `cp .env.example .env` and fill in required values
- Start development server: `npm run dev`
- Start production server: `npm start`
- Run authentication migration: `npm run auth:migrate`

## Development Workflow

- Development server: `npm run dev` (uses nodemon for auto-restart)
- Production server: `npm start`
- Environment variables: Set in `.env` file (see `.env.example` for template)
- Database initialization: Automatic on server start via `initDB()` in index.js
- Graceful shutdown: Handles SIGTERM and SIGINT signals for clean database disconnection

## Testing Instructions

Currently no test framework is configured. To implement testing:

1. Add a test framework (e.g., Jest, Vitest)
2. Create test files in a `__tests__` or `test` directory
3. Update the "test" script in package.json
4. Run tests with `npm test`

## Code Style Guidelines

- JavaScript/Node.js with ES modules (`type: "module"` in package.json)
- RESTful API design with Express
- MVC-like structure:
  - Controllers: Handle HTTP requests/responses
  - Services: Business logic
  - Routes: Define API endpoints
  - Config: Database and middleware configuration
  - Middleware: Authentication and request processing
- Named exports/imports with destructuring
- Async/await for asynchronous operations
- Error handling with try/catch blocks
- Environment variable configuration with dotenv

## Build and Deployment

- No build step required (interpreted JavaScript)
- Start server: `node index.js` or `npm start`
- Requires MySQL database connection
- Environment variables must be set:
  - API_SECRET: For JWT signing
  - PORT: Server port (defaults to 3000)
  - DB_HOST, DB_USER, DB_PASS, DB_DATABASE, DB_PORT: MySQL connection
  - BETTER_AUTH_SECRET, BETTER_AUTH_URL: For authentication
  - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET: For Google OAuth

## Additional Notes

- Uses better-auth for authentication handling
- MySQL database with both `mysql` and `mysql2` drivers
- File uploads handled with multer
- Excel processing with xlsx library
- Request body parsing with express.json() and express.urlencoded()
- CORS not explicitly configured - may need to add for frontend integration
- No API documentation currently implemented (consider adding Swagger/OpenAPI)

## Project Structure

```
scoreboard-node-api/
├── index.js              # Application entry point
├── config/               # Database and middleware configuration
├── controllers/          # Request handlers
├── routes/               # API route definitions
├── services/             # Business logic
├── middlewares/          # Custom middleware
├── scripts/              # Utility scripts (e.g., auth migration)
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── .git/                 # Git version control
```

## API Endpoints

- `GET /` - Health check endpoint
- `/api/auth/*` - Authentication routes (handled by better-auth)
- `/api/scores/*` - Score management routes
