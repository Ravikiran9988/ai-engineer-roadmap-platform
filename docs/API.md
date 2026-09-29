# API Documentation

Base URL: `/api`

## Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate and return a JWT.
- `GET /api/auth/me`: Get current authenticated user profile.

## Progress
- `GET /api/progress`: Get user progress map.
- `POST /api/progress`: Update progress for a topic/task.

## Assignments
- `GET /api/assignments`: Get all assignment statuses for user.
- `POST /api/assignments/:id/submit`: Submit a GitHub URL for an assignment.

## Projects
- `GET /api/projects`: Get all project statuses.
- `POST /api/projects/:id/submit`: Submit project URLs (GitHub & Live).

*(Note: API is currently a work in progress and endpoints may return placeholder data).*
