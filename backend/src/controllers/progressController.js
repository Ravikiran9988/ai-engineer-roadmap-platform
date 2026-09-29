const db = require('../config/database');

exports.getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { rows } = await db.query('SELECT * FROM user_progress WHERE user_id = $1', [userId]);
    
    if (rows.length === 0) {
      // Return empty default state
      return res.status(200).json({
        activePath: null,
        streak: 0,
        lastActive: null,
        completedSubtopics: [],
        completedTasks: [],
        completedVideos: [],
        readResources: [],
        assignments: {},
        projects: {}
      });
    }

    const p = rows[0];
    res.status(200).json({
      activePath: p.active_path,
      streak: p.streak,
      lastActive: p.last_active,
      completedSubtopics: p.completed_subtopics || [],
      completedTasks: p.completed_tasks || [],
      completedVideos: p.completed_videos || [],
      readResources: p.read_resources || [],
      assignments: p.assignments || {},
      projects: p.projects || {}
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { 
      activePath, streak, lastActive, completedSubtopics, 
      completedTasks, completedVideos, readResources, 
      assignments, projects 
    } = req.body;

    const query = `
      INSERT INTO user_progress (
        user_id, active_path, streak, last_active, completed_subtopics, 
        completed_tasks, completed_videos, read_resources, assignments, projects, updated_at
      ) VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10::jsonb, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
        active_path = EXCLUDED.active_path,
        streak = EXCLUDED.streak,
        last_active = EXCLUDED.last_active,
        completed_subtopics = EXCLUDED.completed_subtopics,
        completed_tasks = EXCLUDED.completed_tasks,
        completed_videos = EXCLUDED.completed_videos,
        read_resources = EXCLUDED.read_resources,
        assignments = EXCLUDED.assignments,
        projects = EXCLUDED.projects,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      userId, 
      activePath, 
      streak, 
      lastActive, 
      JSON.stringify(completedSubtopics || []),
      JSON.stringify(completedTasks || []),
      JSON.stringify(completedVideos || []),
      JSON.stringify(readResources || []),
      JSON.stringify(assignments || {}),
      JSON.stringify(projects || {})
    ];

    const { rows } = await db.query(query, values);
    res.status(200).json({ message: 'Progress updated successfully', progress: rows[0] });
  } catch (error) {
    next(error);
  }
};
