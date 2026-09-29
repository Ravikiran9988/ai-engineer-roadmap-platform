# Architecture

The AI Engineer Roadmap is a full-stack web application designed to track learning progress across an AI engineering curriculum.

## Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (for persistent user data, progress, submissions).
- **Cache**: Redis (for rate limiting, session, caching).
- **Deployment**: Docker, Docker Compose.

## Frontend
The frontend uses a Context-based state management system (`ProgressContext`) which currently caches data to `localStorage`. An `api.js` service is built to easily switch to backend REST calls in the future.

## Backend
The backend follows a classic layered architecture:
- **Routes**: API endpoint definitions.
- **Controllers**: Request handling and response formatting.
- **Services**: Business logic and database interactions.
- **Models / Config**: Database connection and queries.
