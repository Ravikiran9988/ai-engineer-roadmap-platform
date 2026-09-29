# AI Engineer Roadmap

A full-stack learning platform for AI engineering, from foundations through production AI systems.

## Structure
- `frontend/`: React + Vite + JavaScript/JSX + Tailwind CSS
- `backend/`: Node.js + Express + PostgreSQL
- `database/`: Database schema and migrations
- `docs/`: Architecture and API documentation

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
Make sure PostgreSQL is running locally.
```bash
cd backend
npm install
cp .env.example .env
# Set DB credentials and a strong JWT_SECRET in .env
npm run dev
```

### Validate roadmap data
```bash
cd backend
npm run validate:data
```

The validator checks topic/subtopic alignment and assignment references to videos and documentation.

## Database

Create the base schema from `database/schema.sql`.

For an existing database created before the current platform schema, apply the idempotent migration:

```text
database/migrations/001_platform_integrity.sql
```

The migration preserves existing user data and creates/updates the submission structures required by the current backend.

## Docker
```bash
docker-compose up --build
```

This starts the frontend, backend, PostgreSQL, and the existing Redis service. Redis is currently reserved for future caching/background-job use; the core progress and submission flows use PostgreSQL.

## Progress and resources

Learning progress is persisted through the backend and PostgreSQL. The browser stores only the authentication session cache.

Individual YouTube videos are external links with manual completion. The platform does not rely on embedded YouTube playback tracking.

See `docs/API.md` and `docs/architecture.md` for the current API and architecture.
