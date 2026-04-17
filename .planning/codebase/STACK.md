# Technology Stack

**Analysis Date:** 2026-04-17

## Languages

**Primary:**
- JavaScript (ES2020) [Version: Node.js 23.6.1] - Used throughout the codebase (index.js, routes, controllers, services, config)

## Runtime

**Environment:**
- Node.js [Version: 23.6.1]

**Package Manager:**
- npm [Version: bundled with Node.js]
- Lockfile: present (package-lock.json)

## Frameworks

**Core:**
- Express [Version: 5.2.1] - Web framework for building the API
- better-auth [Version: 1.6.4] - Authentication library

**Testing:**
- Not detected (no test framework configured in package.json)

**Build/Dev:**
- nodemon [Version: 3.1.11] - Development utility for auto-restarting server

## Key Dependencies

**Critical:**
- mysql2 [Version: 3.16.2] - MySQL database driver for connecting to LSCS Member database
- axios [Version: 1.13.4] - HTTP client for external API calls (e.g., to university systems)
- jsonwebtoken [Version: 9.0.3] - For JWT token handling (though better-auth may handle this internally)
- multer [Version: 2.0.2] - Middleware for handling multipart/form-data (file uploads)
- xlsx [Version: 0.18.5] - For reading/writing Excel files (likely for scoreboard data)

**Infrastructure:**
- dotenv [Version: 17.2.3] - Loads environment variables from .env file

## Configuration

**Environment:**
- Configured via .env file (present in root) and .env.example
- Key configs required: DB_HOST, DB_USER, DB_PASS, DB_DATABASE, DB_PORT, PORT, and better-auth related variables

**Build:**
- No build process (plain Node.js/Express application)
- Scripts defined in package.json: dev (nodemon), start (node), auth:migrate

## Platform Requirements

**Development:**
- Node.js >=18.x (tested with 23.6.1)
- MySQL database instance

**Production:**
- Deployment target: Any Node.js hosting platform (e.g., Docker, VM, PaaS)
- Requires environment variables for database and authentication

---

*Stack analysis: 2026-04-17*