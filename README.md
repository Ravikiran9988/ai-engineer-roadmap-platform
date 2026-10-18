# AI Engineer Roadmap Platform

A full-stack learning platform that helps developers progress from programming and machine-learning fundamentals to building, evaluating, securing, and deploying production-oriented AI systems.

The curriculum is organized into learning paths, phases, topics, and subtopics, with curated resources and practical work to help learners follow a structured plan.

## Learning paths

| Path | Best for | Estimated duration |
|---|---|---:|
| **Job Ready** | A focused route through essential AI engineering skills and practical production workflows | 12 weeks |
| **Intermediate** | Learners who want deeper ML, deep learning, fine-tuning, advanced RAG, and stronger MLOps knowledge | 20 weeks |
| **Advanced** | Learners who want to work through the complete roadmap, including all phases and topics | 36 weeks |

Durations are curriculum estimates, not guarantees. Adjust the pace to your background and available study time.

## Features

- **Structured roadmap:** Explore the curriculum from phases to topics and individual subtopics.
- **Curated learning resources:** Find recommended YouTube videos, documentation, GitHub notes, and playlists alongside the curriculum.
- **Practical assignments:** Work through topic-related assignments and submit GitHub repository links.
- **Project-based learning:** Follow project requirements and milestones, then submit GitHub repositories and optional live demos.
- **Capstone project:** Bring skills together in a larger end-to-end project.
- **Progress dashboard:** Review topic completion, learning streaks, estimated learning time, video completion, and assignment/project submissions.
- **Persistent progress:** Authenticated learning progress and submissions are saved through the API in PostgreSQL.
- **Authentication and admin tools:** Register and sign in, access protected submission workflows, and provide authorized admins with user and submission management.

### Learning workflow

```text
Choose a learning path
  └── Phase
      └── Topic
          └── Subtopic
              ├── Recommended videos
              ├── Documentation
              ├── GitHub notes / code
              └── Practical assignment
  └── Phase projects
  └── Final capstone
```

**Video progress is manual:** videos open as external YouTube links. The platform does not track playback or mark a video complete based on watch history.

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | JWT and bcrypt |
| Validation | Joi |
| API security | Helmet, CORS configuration, and rate limiting |
| Optional service | Redis (the current core progress and submission flows use PostgreSQL) |
| Local deployment | Docker Compose |

## Architecture and repository layout

```text
.
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI and layout
│       ├── context/      # Authentication and progress state
│       ├── data/         # Curriculum, paths, videos, docs, tasks and projects
│       ├── pages/        # Roadmap, learning, resources, projects and dashboard pages
│       └── services/     # API and resource access
├── backend/
│   ├── src/
│   │   ├── config/       # Environment, database and Redis configuration
│   │   ├── controllers/  # Request handling and application logic
│   │   ├── middleware/   # Authentication and shared middleware
│   │   └── routes/       # API routes
│   └── scripts/          # Curriculum data validation
├── database/
│   ├── schema.sql
│   └── migrations/
├── docs/
│   ├── API.md
│   └── architecture.md
└── docker-compose.yml
```

The curriculum is maintained in frontend data modules. User-specific progress and submissions are sent to the backend and persisted in PostgreSQL; browser `localStorage` is used for the authentication session cache, not as the source of truth for learning progress.

More detail:
- [Architecture](docs/architecture.md)
- [API reference](docs/API.md)
- [Database schema](database/schema.sql)

## Getting started

### Prerequisites

For local development, install:

- **Node.js 22.12 or newer** and npm
- **PostgreSQL 15 or newer**
- **Git**
- Redis is optional for the current core progress and submission workflows.

### 1. Clone the repository

```bash
git clone https://github.com/Ravikiran9988/ai-engineer-roadmap-platform.git
cd ai-engineer-roadmap-platform
```

### 2. Create and initialize the database

Create a database named `ai_roadmap` in your local PostgreSQL instance, then run the schema:

```bash
psql -U postgres -c "CREATE DATABASE ai_roadmap;"
psql -U postgres -d ai_roadmap -f database/schema.sql
```

If the database already contains data from an older platform schema, review and apply the migration in [`database/migrations/001_platform_integrity.sql`](database/migrations/001_platform_integrity.sql) instead of recreating the database.

### 3. Configure and start the backend

Open a terminal at the repository root:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set the database credentials to match your PostgreSQL setup. Set `JWT_SECRET` to a strong, private value. Keep secrets out of source control.

Install dependencies and start the API:

```bash
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default. Check `http://localhost:5000/api/health` for the health endpoint.

### 4. Start the frontend

In a **second terminal**, from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The frontend defaults to `http://localhost:5000/api` for API requests. To use a different API address, set `VITE_API_URL` in your frontend environment.

### 5. Validate the curriculum data

From the repository root:

```bash
cd backend
npm run validate:data
```

This checks topic/subtopic alignment and verifies that assignment references point to existing video and documentation entries.

## Docker Compose

A Compose configuration is provided for the frontend, API, PostgreSQL, and Redis:

```bash
docker compose up --build
```

**Runtime note:** the current Dockerfiles use a Node 18 image, while the frontend's Vite 8 dependency requires a newer Node runtime. Before relying on the container workflow, update the `FROM node:18-alpine` line in both `frontend/Dockerfile` and `backend/Dockerfile` to a compatible Node 22 image.

The Compose file contains example database credentials and a placeholder JWT secret for local development. Change these values before using any shared or deployed environment; never ship example secrets to production.

To stop the services:

```bash
docker compose down
```

To also delete the local PostgreSQL and Redis volumes, use `docker compose down -v`. **This permanently deletes the data stored in those Compose volumes.**

## API overview

The API is served under `/api`. Authenticated routes require a bearer token:

```http
Authorization: Bearer <JWT>
```

| Area | Endpoints |
|---|---|
| Health | `GET /api/health` |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Progress | `GET /api/progress`, `POST /api/progress` |
| Assignments | `GET /api/assignments`, `POST /api/assignments/:id/submit` |
| Projects | `GET /api/projects`, `POST /api/projects/:id/submit` |

See [docs/API.md](docs/API.md) for endpoint behavior and validation details.

## Useful development scripts

Run these from the relevant directory:

| Directory | Command | Purpose |
|---|---|---|
| `frontend/` | `npm run dev` | Start the Vite development server |
| `frontend/` | `npm run build` | Build the frontend for deployment |
| `frontend/` | `npm run lint` | Run Oxlint |
| `frontend/` | `npm run preview` | Preview a frontend production build |
| `backend/` | `npm run dev` | Start the API with Nodemon |
| `backend/` | `npm start` | Start the API |
| `backend/` | `npm test` | Run the backend Node.js test suite |
| `backend/` | `npm run validate:data` | Validate curriculum references |

## Contributing

Contributions that improve the curriculum, fix bugs, clarify documentation, or improve accessibility are welcome.

1. Fork the repository and create a branch for your change.
2. Keep curriculum IDs and references consistent across topics, subtopics, videos, documentation, and assignments.
3. Run the relevant checks before opening a pull request, especially `npm run validate:data` for curriculum changes.
4. Describe the change, why it is useful, and any manual testing performed.

For larger changes, open an issue first to discuss the proposed approach.

---

Built to make the journey from AI fundamentals to practical AI engineering more structured, trackable, and project-focused.
