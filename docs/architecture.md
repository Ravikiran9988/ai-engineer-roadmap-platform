# Architecture

The AI Engineer Roadmap is a full-stack learning platform for an AI engineering curriculum.

## Stack
- **Frontend**: React + Vite + JavaScript/JSX + Tailwind CSS.
- **Backend**: Node.js + Express.js.
- **Database**: PostgreSQL.
- **Authentication**: JWT + bcrypt.
- **Validation**: Joi.
- **Security middleware**: Helmet, CORS, and rate limiting.
- **Deployment target**: Docker/Docker Compose and a managed cloud service.

## Frontend architecture

Static curriculum content is stored in canonical data modules:

- `phases.js`
- `topics.js`
- `learningPaths.js`
- `videos.js`
- `documentation.js`
- `githubNotes.js`
- `playlists.js`
- `assignments.js`
- `projects.js`
- `dailyTasks.js`

User-specific state is server-backed through `api.js` and `ProgressContext`. Browser `localStorage` is used only for the JWT/user session cache; learning progress is persisted in PostgreSQL.

## Learning data flow

```
Learning Path
  -> Phase
    -> Topic
      -> Subtopic
        -> Individual Videos
        -> Documentation
        -> GitHub Notes / Code
        -> Practice
        -> Assignment
      -> Phase Project
  -> Final Capstone
```

## Backend architecture

The backend follows a layered Express structure:

- **Routes**: endpoint definitions and authentication protection.
- **Controllers**: request validation, database operations, and responses.
- **Config**: environment and PostgreSQL connection settings.
- **Middleware**: JWT authentication and global error handling.
- **Database**: persistent users, progress, assignment submissions, and project submissions.

Assignment and project submissions are stored both in dedicated PostgreSQL tables and in the user's progress JSONB map so the existing progress dashboard remains compatible.

## Progress model

Progress is server-authoritative:

```
React UI
  -> ProgressContext
    -> REST API
      -> PostgreSQL
```

There is no client-side localStorage source of truth for learning progress.

## Resource model

Individual YouTube videos are external links with manual completion. The previous embedded-player/video-playback tracking implementation has been removed because external YouTube playback cannot be treated as a reliable first-party progress source.

## Data integrity

`backend/scripts/validate-data.js` validates:

- every topic's subtopic IDs and names have matching lengths;
- assignment subtopic IDs exist;
- assignment required video IDs exist;
- assignment required documentation IDs exist.

Run:

```bash
cd backend
npm run validate:data
```
