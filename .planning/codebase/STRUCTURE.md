# Codebase Structure

**Analysis Date:** 2026-04-17

## Directory Layout

```
[project-root]/
├── config/          # Configuration files (database, auth)
├── controllers/     # Request handlers (input validation, response formatting)
├── middlewares/     # Custom middleware functions
├── openspec/        # OpenSpec change proposals and implementations
├── routes/          # API route definitions
├── scripts/         # Utility scripts (migrations, etc.)
├── services/        # Business logic layer
├── .planning/       # Generated codebase maps (this directory)
├── index.js         # Application entry point
├── package.json     # Project dependencies and scripts
└── README.md        # Project documentation
```

## Directory Purposes

**[config]:**
- Purpose: Configuration for external services and infrastructure
- Contains: Database connection setup, authentication configuration
- Key files: `connect.js` (MySQL connection pooling), `auth.js` (Better-Auth setup)

**[controllers]:**
- Purpose: Handle HTTP requests and responses
- Contains: Request handler functions that validate input and call services
- Key files: `scores.controllers.js` (score operations), `auth.controller.js` (auth helpers)

**[middlewares]:**
- Purpose: Custom middleware functions
- Contains: Application-specific middleware
- Key files: (Directory exists but no files shown in exploration)

**[openspec]:**
- Purpose: Experimental changes and proposals using OpenSpec workflow
- Contains: Feature proposals, implementation tasks, archived changes
- Key files: (Directory structure for OpenSpec workflow)

**[routes]:**
- Purpose: Define API endpoints and connect them to controllers
- Contains: Express route definitions
- Key files: `auth.routes.js` (auth endpoints), `scores.routes.js` (score endpoints)

**[scripts]:**
- Purpose: Utility and maintenance scripts
- Contains: Database migration scripts, administrative tools
- Key files: `better-auth-migrate.js` (auth migration script)

**[services]:**
- Purpose: Implement business logic and data operations
- Contains: Core application logic
- Key files: `scores.services.js` (score operations), `auth.service.js` (auth helpers)

## Key File Locations

**Entry Points:**
- `index.js`: Main application entry point that initializes the server

**Configuration:**
- `config/connect.js`: Database connection pooling and initialization
- `config/auth.js`: Authentication service configuration (Better-Auth)

**Core Logic:**
- `services/scores.services.js`: Score-related business logic
- `services/auth.service.js`: Authentication-related business logic
- `controllers/scores.controllers.js`: Score request handling
- `controllers/auth.controller.js`: Auth request handling

**Testing:**
- None detected (no test files found in exploration)

## Naming Conventions

**Files:**
- PascalCase for service files: `scores.services.js`, `auth.service.js`
- PascalCase for controller files: `scores.controllers.js`, `auth.controller.js`
- camelCase for route files: `auth.routes.js`, `scores.routes.js`
- camelCase for config files: `connect.js`, `auth.js`
- kebab-case for scripts: `better-auth-migrate.js`

**Directories:**
- lowercase plural: `controllers`, `services`, `routes`, `config`, `scripts`

## Where to Add New Code

**New Feature (e.g., member management):**
- Primary code: `services/members.services.js`
- Controller: `controllers/members.controllers.js`
- Routes: `routes/members.routes.js`
- Tests: `services/members.services.test.js` (when testing is implemented)

**New Component/Module:**
- Implementation: `services/[feature].services.js`
- Interface: `controllers/[feature].controllers.js`
- Routes: `routes/[feature].routes.js`

**Utilities:**
- Shared helpers: Create `utils/` directory or add to existing services
- Configuration: Add to `config/` directory

## Special Directories

**[.planning]:**
- Purpose: Generated codebase maps for AI agent consumption
- Generated: Yes (by /gsd-map-codebase command)
- Committed: Yes (contains strategic documentation)

**[openspec]:**
- Purpose: Experimental workflow for proposing and implementing changes
- Generated: Partially (manual proposals become implemented code)
- Committed: Yes (contains both proposals and implemented features)

---

*Structure analysis: 2026-04-17*