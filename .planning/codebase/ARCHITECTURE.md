# Architecture

**Analysis Date:** 2026-04-17

## Pattern Overview

**Overall:** Layered Architecture (3-tier: Controller-Service-Repository)

**Key Characteristics:**
- Separation of concerns between request handling, business logic, and data access
- Dependency flow: Controllers → Services → Database (no direct controller-to-database access)
- Middleware for cross-cutting concerns (authentication, body parsing)
- Environment-based configuration via dotenv

## Layers

**[Presentation Layer (Controllers)]:**
- Purpose: Handle HTTP requests, validate input, format responses
- Location: `controllers/`
- Contains: Request handler functions that validate input and call services
- Depends on: Services layer
- Used by: Routes layer

**[Business Logic Layer (Services)]:**
- Purpose: Implement business logic, coordinate data operations
- Location: `services/`
- Contains: Functions that implement business rules and data manipulation
- Depends on: Database layer (via direct mysql2 calls)
- Used by: Controllers layer

**[Data Access Layer (Database)]:**
- Purpose: Handle database connections and raw SQL operations
- Location: `config/connect.js` (connection pooling)
- Contains: Database connection pool and query execution functions
- Depends on: None (infrastructure layer)
- Used by: Services layer

**[Routes Layer]:**
- Purpose: Define API endpoints and route requests to controllers
- Location: `routes/`
- Contains: Express route definitions mapping paths to controller functions
- Depends on: Controllers layer
- Used by: Main application (index.js)

**[Middleware Layer]:**
- Purpose: Handle cross-cutting concerns like authentication and body parsing
- Location: Applied in index.js and route definitions
- Contains: Better-Auth middleware, Express body parsers
- Depends on: External libraries (better-auth, express)
- Used by: Routes layer

## Data Flow

**[Request Processing Flow]:**

1. Client sends HTTP request to Express server (index.js)
2. Express router matches route and applies middleware (authentication, body parsing)
3. Route handler calls appropriate controller function
4. Controller validates input and delegates to service layer
5. Service implements business logic and interacts with database
6. Database layer executes queries and returns results
7. Results flow back up: Service → Controller → Route → Client response

**State Management:**
- Stateless request handling (no server-side session storage in controllers/services)
- Authentication state managed by Better-Auth via cookies/database sessions
- Database connection pooling for efficient resource reuse

## Key Abstractions

**[Database Connection Pool]:**
- Purpose: Manage efficient MySQL connections
- Examples: `config/connect.js` (mysql.createPool)
- Pattern: Singleton pool with retry logic and connection validation

**[Better-Auth Integration]:**
- Purpose: Handle authentication and session management
- Examples: `config/auth.js` (betterAuth configuration)
- Pattern: Third-party auth library with custom database adapter

**[File Upload Processing]:**
- Purpose: Handle file uploads and parse spreadsheet data
- Examples: `controllers/scores.controllers.js` (multer + xlsx processing)
- Pattern: Stream-based file parsing with format detection

## Entry Points

**[Main Application Entry Point]:**
- Location: `index.js`
- Triggers: Node.js process start (via `node index.js` or `nodemon index.js`)
- Responsibilities: 
  - Initialize Express app
  - Initialize database connection
  - Apply middleware
  - Register routes
  - Start HTTP server
  - Handle graceful shutdown

**[Authentication Entry Point]:**
- Location: `routes/auth.routes.js` (handles `/api/auth/*` paths)
- Triggers: Requests to auth endpoints
- Responsibilities:
  - Handle login URL generation
  - Delegate auth processing to Better-Auth middleware

## Error Handling

**Strategy:** Centralized error handling in controllers with try/catch blocks

**Patterns:**
- Try/catch wrappers around async operations in all controller functions
- Error forwarding to Express via `res.status(500).json({ error: error.message })`
- Specific error code handling (e.g., ER_DUP_ENTRY for duplicate entries)
- Custom error messages for validation failures
- Logging of unexpected errors via `console.error`

## Cross-Cutting Concerns

**Logging:** Console-based logging (`console.log` for info, `console.error` for errors)
- Used throughout for database connection events, file upload errors, and server events

**Validation:** Input validation in controller functions
- Manual validation of required fields and data types
- Specific validation in score upload processing (member ID format checking)

**Authentication:** Better-Auth middleware integration
- Applied via `toNodeHandler(auth)` on auth routes
- Session management handled by Better-Auth library
- Environment-based configuration for security settings

---

*Architecture analysis: 2026-04-17*