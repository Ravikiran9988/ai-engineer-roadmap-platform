const Joi = require('joi');
const db = require('../config/database');

const schema = Joi.object({
  githubUrl: Joi.string().uri({ scheme: ['https'] }).max(500).required()
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
      'SELECT assignment_id, github_url, status, submitted_at, updated_at FROM assignment_submissions WHERE user_id=$1 ORDER BY updated_at DESC',
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
    const assignmentId = String(req.params.id || '').trim();
    if (!assignmentId || assignmentId.length > 100) return res.status(400).json({ message: 'Invalid assignment id.' });

    const { githubUrl } = value;
    const { rows } = await db.query(
      `INSERT INTO assignment_submissions (user_id, assignment_id, github_url, status)
       VALUES ($1,$2,$3,'submitted')
       ON CONFLICT (user_id, assignment_id) DO UPDATE SET
         github_url=EXCLUDED.github_url, status='submitted', updated_at=CURRENT_TIMESTAMP
       RETURNING assignment_id, github_url, status, submitted_at, updated_at`,
      [req.user.id, assignmentId, githubUrl]
    );

    const submission = rows[0];
    await db.query(
      `INSERT INTO user_progress (user_id, assignments)
       VALUES ($1, jsonb_build_object($2::text, jsonb_build_object('status','Submitted','url',$3::text,'updatedAt',CURRENT_TIMESTAMP::text)))
       ON CONFLICT (user_id) DO UPDATE SET
         assignments = user_progress.assignments || EXCLUDED.assignments, updated_at = CURRENT_TIMESTAMP`,
      [req.user.id, assignmentId, githubUrl]
    );
    res.json({ submission });
  } catch (error) { next(error); }
};