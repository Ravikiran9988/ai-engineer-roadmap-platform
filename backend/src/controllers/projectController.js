const Joi = require('joi');
const db = require('../config/database');

const schema = Joi.object({
  githubUrl: Joi.string().uri({ scheme: ['https'] }).max(500).required(),
  liveUrl: Joi.string().uri({ scheme: ['https'] }).max(500).allow('', null)
});

function isGithubUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.toLowerCase() === 'github.com' && url.pathname.length > 1;
  } catch {
    return false;
  }
}

exports.list = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT project_id, github_url, live_url, status, submitted_at, updated_at FROM project_submissions WHERE user_id=$1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json({ submissions: rows });
  } catch (error) { next(error); }
};

exports.submit = async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body || {}, { abortEarly: false });
    if (error || !isGithubUrl(value?.githubUrl)) {
      return res.status(400).json({ message: 'Invalid HTTPS GitHub repository URL.' });
    }
    const projectId = String(req.params.id || '').trim();
    if (!projectId || projectId.length > 100) return res.status(400).json({ message: 'Invalid project id.' });

    const { githubUrl, liveUrl } = value;
    const { rows } = await db.query(
      `INSERT INTO project_submissions (user_id, project_id, github_url, live_url, status)
       VALUES ($1,$2,$3,$4,'submitted')
       ON CONFLICT (user_id, project_id) DO UPDATE SET
         github_url=EXCLUDED.github_url, live_url=EXCLUDED.live_url,
         status='submitted', updated_at=CURRENT_TIMESTAMP
       RETURNING project_id, github_url, live_url, status, submitted_at, updated_at`,
      [req.user.id, projectId, githubUrl, liveUrl || null]
    );

    const submission = rows[0];
    await db.query(
      `INSERT INTO user_progress (user_id, projects)
       VALUES ($1, jsonb_build_object($2::text, jsonb_build_object('status','Submitted','githubUrl',$3::text,'liveUrl',$4::text,'updatedAt',CURRENT_TIMESTAMP::text)))
       ON CONFLICT (user_id) DO UPDATE SET
         projects = user_progress.projects || EXCLUDED.projects, updated_at = CURRENT_TIMESTAMP`,
      [req.user.id, projectId, githubUrl, liveUrl || '']
    );
    res.json({ submission });
  } catch (error) { next(error); }
};