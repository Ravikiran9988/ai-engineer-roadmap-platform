# API Documentation

Base URL: `/api`

All authenticated endpoints require `Authorization: Bearer <JWT>`.

## Health
- `GET /api/health`: Service health check.

## Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate and return a JWT.
- `GET /api/auth/me`: Get the current authenticated user.

## Progress
- `GET /api/progress`: Get the authenticated user's learning progress.
- `POST /api/progress`: Validate and persist learning progress.

Progress includes the selected path, streak, completed subtopics/tasks/videos, read resources, assignment submissions, and project submissions.

## Assignments
- `GET /api/assignments`: Get the authenticated user's assignment submissions.
- `POST /api/assignments/:id/submit`: Create or update an assignment GitHub submission.

The server validates that the URL is an HTTPS GitHub URL and stores the submission in PostgreSQL.

## Projects
- `GET /api/projects`: Get the authenticated user's project submissions.
- `POST /api/projects/:id/submit`: Create or update a project GitHub/live-demo submission.

The server validates the required GitHub URL and optional HTTPS live-demo URL.

## Error handling
Validation errors return HTTP 400 with a `message` and, where applicable, a `details` array. Authentication failures return HTTP 401. Duplicate resources use the relevant conflict response where applicable.
