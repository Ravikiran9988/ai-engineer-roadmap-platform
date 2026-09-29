# AI Engineer Roadmap

A full-stack monorepo for the AI Engineer Roadmap application.

## Structure
- `frontend/`: React + Vite + Tailwind CSS
- `backend/`: Node.js + Express + PostgreSQL + Redis
- `database/`: Database schemas and migrations
- `docs/`: Architecture and API documentation

## Local Development (Without Docker)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
Make sure you have PostgreSQL and Redis running locally.
```bash
cd backend
npm install
cp .env.example .env # Update credentials in .env
npm run dev
```

## Docker (Recommended)
```bash
docker-compose up --build
```
This will start:
- Frontend on http://localhost:5173
- Backend API on http://localhost:5000
- PostgreSQL on port 5432
- Redis on port 6379
