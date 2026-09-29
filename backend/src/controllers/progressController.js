const Joi = require('joi');
const db = require('../config/database');

const emptyProgress = {
  activePath: 'job_ready', streak: 0, lastActive: null,
  completedSubtopics: [], completedTasks: [], completedVideos: [],
  readResources: [], assignments: {}, projects: {}
};

const progressSchema = Joi.object({
  activePath: Joi.string().valid('job_ready', 'intermediate', 'advanced').default('job_ready'),
  streak: Joi.number().integer().min(0).max(100000).default(0),
  lastActive: Joi.string().pattern(/^\\d{4}-\\d{2}-\\d{2}$/).allow(null, ''),
  completedSubtopics: Joi.array().items(Joi.string().max(150)).default([]),
  completedTasks: Joi.array().items(Joi.string().max(150)).default([]),
  completedVideos: Joi.array().items(Joi.string().max(150)).default([]),
  readResources: Joi.array().items(Joi.string().max(1000)).default([]),
  assignments: Joi.object().default({}),
  projects: Joi.object().default({})
}).unknown(false);

exports.getProgress = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT active_path,streak,last_active,completed_subtopics,completed_tasks,completed_videos,read_resources,assignments,projects FROM user_progress WHERE user_id=$1',
      [req.user.id]
    );
    if (!rows[0]) return res.json(emptyProgress);
    const p = rows[0];
    res.json({
      activePath:p.active_path, streak:p.streak, lastActive:p.last_active,
      completedSubtopics:p.completed_subtopics || [], completedTasks:p.completed_tasks || [],
      completedVideos:p.completed_videos || [], readResources:p.read_resources || [],
      assignments:p.assignments || {}, projects:p.projects || {}
    });
  } catch (error) { next(error); }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { error, value } = progressSchema.validate(req.body || {}, { abortEarly: false, stripUnknown: false });
    if (error) return res.status(400).json({ message: 'Invalid progress payload', details: error.details.map(d => d.message) });
    const b = value;
    const values = [
      req.user.id, b.activePath, b.streak, b.lastActive || null,
      JSON.stringify(b.completedSubtopics), JSON.stringify(b.completedTasks),
      JSON.stringify(b.completedVideos), JSON.stringify(b.readResources),
      JSON.stringify(b.assignments), JSON.stringify(b.projects)
    ];
    const query = `
      INSERT INTO user_progress
      (user_id,active_path,streak,last_active,completed_subtopics,completed_tasks,completed_videos,read_resources,assignments,projects)
      VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7::jsonb,$8::jsonb,$9::jsonb,$10::jsonb)
      ON CONFLICT (user_id) DO UPDATE SET
      active_path=EXCLUDED.active_path,streak=EXCLUDED.streak,last_active=EXCLUDED.last_active,
      completed_subtopics=EXCLUDED.completed_subtopics,completed_tasks=EXCLUDED.completed_tasks,
      completed_videos=EXCLUDED.completed_videos,read_resources=EXCLUDED.read_resources,
      assignments=EXCLUDED.assignments,projects=EXCLUDED.projects,updated_at=CURRENT_TIMESTAMP
      RETURNING *;`;
    const { rows } = await db.query(query, values);
    res.json({ message:'Progress updated successfully', progress:rows[0] });
  } catch (error) { next(error); }
};

