-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    selected_path VARCHAR(50) DEFAULT 'job_ready',
    learning_streak INTEGER DEFAULT 0,
    last_active DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create User Progress Table (Tracks completed topics/subtopics)
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'topic' or 'subtopic'
    item_id VARCHAR(100) NOT NULL,  -- e.g., 'python', 'python-core'
    status VARCHAR(50) DEFAULT 'completed',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_type, item_id)
);

-- Create Video Progress Table
CREATE TABLE IF NOT EXISTS video_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    video_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'watched',
    watched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, video_id)
);

-- Create Daily Task Progress Table
CREATE TABLE IF NOT EXISTS daily_task_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    task_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, task_id)
);

-- Create Assignment Submissions Table
CREATE TABLE IF NOT EXISTS assignment_submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    assignment_id VARCHAR(100) NOT NULL,
    github_url VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, assignment_id)
);

-- Create Project Submissions Table
CREATE TABLE IF NOT EXISTS project_submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    project_id VARCHAR(100) NOT NULL,
    github_url VARCHAR(255) NOT NULL,
    live_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'submitted',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, project_id)
);
