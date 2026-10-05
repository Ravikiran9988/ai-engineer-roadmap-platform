const db = require('../config/database');

exports.getUsers = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id, username, email, role, created_at as "createdAt" FROM users ORDER BY created_at DESC');
    res.json({ users: rows });
  } catch (error) { next(error); }
};

exports.getUser = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id, username, email, role, created_at as "createdAt" FROM users WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: rows[0] });
  } catch (error) { next(error); }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) return res.status(400).json({ message: 'Invalid role.' });
    if (String(req.user.id) === String(id)) return res.status(400).json({ message: 'You cannot change your own role.' });
    const { rows } = await db.query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, role',
      [role, id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: rows[0] });
  } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (String(req.user.id) === String(id)) return res.status(400).json({ message: 'You cannot delete yourself.' });
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) { next(error); }
};

exports.getStats = async (req, res, next) => {
  try {
    const [usersRes, adminsRes, assignmentsRes, projectsRes, pendingAssignmentsRes, pendingProjectsRes] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query('SELECT COUNT(*) FROM users WHERE role = $1', ['admin']),
      db.query('SELECT COUNT(*) FROM assignment_submissions'),
      db.query('SELECT COUNT(*) FROM project_submissions'),
      db.query("SELECT COUNT(*) FROM assignment_submissions WHERE status = 'submitted'"),
      db.query("SELECT COUNT(*) FROM project_submissions WHERE status = 'submitted'")
    ]);
    res.json({
      stats: {
        totalUsers: Number(usersRes.rows[0].count),
        totalAdmins: Number(adminsRes.rows[0].count),
        totalSubmissions: Number(assignmentsRes.rows[0].count) + Number(projectsRes.rows[0].count),
        pendingReviews: Number(pendingAssignmentsRes.rows[0].count) + Number(pendingProjectsRes.rows[0].count),
        totalProjectSubmissions: Number(projectsRes.rows[0].count)
      }
    });
  } catch (error) { next(error); }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const [assignments, projects] = await Promise.all([
      db.query(`
        SELECT a.id, a.user_id as "userId", u.username, 'assignment' as type,
               a.assignment_id as "itemId", a.status, a.submitted_at as "submittedAt"
        FROM assignment_submissions a LEFT JOIN users u ON a.user_id = u.id
      `),
      db.query(`
        SELECT p.id, p.user_id as "userId", u.username, 'project' as type,
               p.project_id as "itemId", p.status, p.submitted_at as "submittedAt"
        FROM project_submissions p LEFT JOIN users u ON p.user_id = u.id
      `)
    ]);
    const submissions = [...assignments.rows, ...projects.rows]
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    res.json({ submissions });
  } catch (error) { next(error); }
};

exports.reviewSubmission = async (req, res, next) => {
  const client = await db.connect();
  try {
    const { id } = req.params;
    const { status, type } = req.body || {};
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
    if (!['assignment', 'project'].includes(type)) return res.status(400).json({ message: 'Submission type is required.' });

    const table = type === 'assignment' ? 'assignment_submissions' : 'project_submissions';
    const progressKey = type === 'assignment' ? 'assignments' : 'projects';
    const idField = type === 'assignment' ? 'assignment_id' : 'project_id';

    await client.query('BEGIN');
    const { rows } = await client.query(
      `UPDATE ${table}
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING user_id, ${idField} as "itemId"`,
      [status, id]
    );
    if (!rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Submission not found.' });
    }

    const progressStatus = status === 'approved' ? 'Approved' : 'Rejected';
    await client.query(
      `UPDATE user_progress
       SET ${progressKey} = jsonb_set(COALESCE(${progressKey}, '{}'::jsonb), ARRAY[$1::text], COALESCE(${progressKey}, '{}'::jsonb)->$1 || jsonb_build_object('status', $2::text, 'reviewedAt', CURRENT_TIMESTAMP::text)),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3`,
      [rows[0].itemId, progressStatus, rows[0].user_id]
    );
    await client.query('COMMIT');
    res.json({ message: 'Review updated successfully.' });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    next(error);
  } finally {
    client.release();
  }
};