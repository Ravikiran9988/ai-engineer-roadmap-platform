CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  active_path VARCHAR(50),
  streak INTEGER DEFAULT 0,
  last_active DATE,
  completed_subtopics JSONB DEFAULT '[]'::jsonb,
  completed_tasks JSONB DEFAULT '[]'::jsonb,
  completed_videos JSONB DEFAULT '[]'::jsonb,
  read_resources JSONB DEFAULT '[]'::jsonb,
  assignments JSONB DEFAULT '{}'::jsonb,
  projects JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
