# LSCS Scoreboard API

Backend API for LSCS member score tracking with Google OAuth authentication and bulk upload capabilities.

## Quick Start

### Prerequisites

- Node.js >= 23.6.1
- MySQL database
- Google OAuth credentials
- LSCS Core API access

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your credentials

# Run auth migrations
npm run auth:migrate

# Start development server
npm run dev
```

Server runs at `http://localhost:3000`

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │◄────►│  Express    │◄────►│   MySQL     │
│  (Members)  │      │    API      │      │  Database   │
└─────────────┘      └──────┬──────┘      └─────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        ┌─────────┐   ┌─────────┐   ┌─────────┐
        │ Google  │   │  LSCS   │   │  File   │
        │  OAuth  │   │  Core   │   │ Upload  │
        └─────────┘   └─────────┘   └─────────┘
```

### Request Flow

```
Request → API Key Check → Session Check → Route Handler → Service → Database
```

### Project Structure

```
scoreboard-node-api/
├── config/         # Database & auth configuration
├── controllers/    # HTTP request handlers
├── middlewares/    # Auth middleware
├── routes/         # API route definitions
├── services/       # Business logic
├── scripts/        # Migration utilities
├── index.js        # Application entry point
└── package.json
```

## API Routes

All score routes require both API key and session authentication.

### Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/auth/login` | No | Get login URL for Google OAuth |
| ALL | `/api/auth/*` | No | Better-auth endpoints |

### Scores

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/scores` | Yes | Get all scores |
| GET | `/api/scores/top` | Yes | Get top 10 scores |
| GET | `/api/scores/:id` | Yes | Get score by member ID |
| POST | `/api/scores` | Yes | Create new score |
| PUT | `/api/scores/:id` | Yes | Update score |
| DELETE | `/api/scores/:id` | Yes | Delete score |
| POST | `/api/scores/upload` | Yes | Bulk upload (Excel/CSV) |

### Examples

**Get all scores:**
```bash
curl http://localhost:3000/api/scores \
  -H "x-api-key: YOUR_API_SECRET" \
  -b "session_cookie=value"
```

**Create score:**
```bash
curl -X POST http://localhost:3000/api/scores \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_SECRET" \
  -b "session_cookie=value" \
  -d '{"member_id": 12345, "score": 100}'
```

**Upload scores (bulk):**
```bash
curl -X POST http://localhost:3000/api/scores/upload \
  -H "x-api-key: YOUR_API_SECRET" \
  -b "session_cookie=value" \
  -F "file=@members.xlsx" \
  -F "points=5"
```

File format: Excel or CSV with member_id in the 3rd column.

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health status |

## Authentication Flow

1. User clicks login → Frontend requests `/api/auth/login`
2. Backend redirects to Google OAuth
3. Google returns user to callback → better-auth creates session
4. Before user creation → LSCS Core API verifies membership
5. Frontend receives session cookie → Can access score routes

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (auto-reload) |
| `npm start` | Start production server |
| `npm run auth:migrate` | Run better-auth database migrations |

## Troubleshooting

**Database connection fails:**
- Verify MySQL is running
- Check `.env` credentials

**OAuth errors:**
- Ensure `BETTER_AUTH_URL` matches your domain
- Verify Google Cloud Console redirect URIs

**LSCS Core API failures:**
- Check `LSCS_CORE_URL` and `LSCS_CORE_API_KEY`
- Verify LSCS Core service is accessible

## Contributing

1. Create branch: `git checkout -b feature/description`
2. Follow code style in [AGENTS.md](AGENTS.md)
3. Test locally
4. Open PR

---

Built with Express, better-auth, and MySQL.