-- AI Engineer Roadmap database schema
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  selected_path VARCHAR(50) NOT NULL DEFAULT 'job_ready' CHECK (selected_path IN ('job_ready','intermediate','advanced')),
  learning_streak INTEGER NOT NULL DEFAULT 0,
  last_active DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  active_path VARCHAR(50) NOT NULL DEFAULT 'job_ready',
  streak INTEGER NOT NULL DEFAULT 0,
  last_active DATE,
  completed_subtopics JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_videos JSONB NOT NULL DEFAULT '[]'::jsonb,
  read_resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  assignments JSONB NOT NULL DEFAULT '{}'::jsonb,
  projects JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);


CREATE TABLE IF NOT EXISTS assignment_submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id VARCHAR(100) NOT NULL,
  github_url VARCHAR(500) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, assignment_id)
);

CREATE TABLE IF NOT EXISTS project_submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id VARCHAR(100) NOT NULL,
  github_url VARCHAR(500) NOT NULL,
  live_url VARCHAR(500),
  status VARCHAR(50) NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_assignment_submissions_user_id ON assignment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_project_submissions_user_id ON project_submissions(user_id);
