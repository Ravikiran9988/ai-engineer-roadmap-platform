const db = require('../config/database');

const emptyProgress = {
  activePath: 'job_ready', streak: 0, lastActive: null,
  completedSubtopics: [], completedTasks: [], completedVideos: [],
  readResources: [], assignments: {}, projects: {}
};

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
    const b = req.body || {};
    const values = [
      req.user.id, b.activePath || 'job_ready', Number.isFinite(b.streak) ? b.streak : 0,
      b.lastActive || null, JSON.stringify(b.completedSubtopics || []),
      JSON.stringify(b.completedTasks || []), JSON.stringify(b.completedVideos || []),
      JSON.stringify(b.readResources || []), JSON.stringify(b.assignments || {}),
      JSON.stringify(b.projects || {})
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

exports.getVideoProgress = async (req,res,next) => {
  try {
    const { rows } = await db.query(
      'SELECT video_id,progress_seconds,duration_seconds,progress_percent,completed,last_watched_at FROM video_progress WHERE user_id=$1 AND video_id=$2',
      [req.user.id,req.params.videoId]
    );
    res.json(rows[0] || {videoId:req.params.videoId,progressSeconds:0,durationSeconds:0,progressPercent:0,completed:false});
  } catch(error){next(error);}
};

exports.updateVideoProgress = async (req,res,next) => {
  try {
    const b=req.body||{};
    const percent=Math.min(100,Math.max(0,Number(b.progressPercent)||0));
    const completed=Boolean(b.completed)||percent>=90;
    const {rows}=await db.query(`
      INSERT INTO video_progress
      (user_id,video_id,progress_seconds,duration_seconds,progress_percent,completed)
      VALUES($1,$2,$3,$4,$5,$6)
      ON CONFLICT(user_id,video_id) DO UPDATE SET
      progress_seconds=EXCLUDED.progress_seconds,duration_seconds=EXCLUDED.duration_seconds,
      progress_percent=EXCLUDED.progress_percent,completed=EXCLUDED.completed,last_watched_at=CURRENT_TIMESTAMP
      RETURNING *;`,
      [req.user.id,req.params.videoId,Number(b.progressSeconds)||0,Number(b.durationSeconds)||0,percent,completed]);
    res.json({progress:rows[0]});
  }catch(error){next(error);}
};