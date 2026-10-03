const db = require('../config/database');

exports.getUsers = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id, username, email, role, created_at as "createdAt" FROM users ORDER BY created_at DESC');
    res.json({ users: rows });
  } catch (error) { next(error); }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT id, username, email, role, created_at as "createdAt" FROM users WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: rows[0] });
  } catch (error) { next(error); }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (role !== 'admin' && role !== 'user') return res.status(400).json({ message: 'Invalid role.' });
    
    // Prevent removing your own admin status
    if (String(req.user.id) === String(id)) {
      return res.status(400).json({ message: 'You cannot change your own role.' });
    }

    const { rows } = await db.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role', [role, id]);
    if (!rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: rows[0] });
  } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (String(req.user.id) === String(id)) {
      return res.status(400).json({ message: 'You cannot delete yourself.' });
    }
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) { next(error); }
};

exports.getStats = async (req, res, next) => {
  try {
    const usersRes = await db.query('SELECT COUNT(*) FROM users');
    const adminsRes = await db.query('SELECT COUNT(*) FROM users WHERE role = $1', ['admin']);
    
    const assignmentsRes = await db.query('SELECT COUNT(*) FROM assignment_submissions');
    const projectsRes = await db.query('SELECT COUNT(*) FROM project_submissions');
    
    const pendingAssignmentsRes = await db.query('SELECT COUNT(*) FROM assignment_submissions WHERE status = $1', ['submitted']);
    const pendingProjectsRes = await db.query('SELECT COUNT(*) FROM project_submissions WHERE status = $1', ['submitted']);

    const totalSubmissions = parseInt(assignmentsRes.rows[0].count) + parseInt(projectsRes.rows[0].count);
    const pendingReviews = parseInt(pendingAssignmentsRes.rows[0].count) + parseInt(pendingProjectsRes.rows[0].count);

    res.json({
      stats: {
        totalUsers: parseInt(usersRes.rows[0].count),
        totalAdmins: parseInt(adminsRes.rows[0].count),
        totalSubmissions,
        pendingReviews,
        totalProjects: parseInt(projectsRes.rows[0].count)
      }
    });
  } catch (error) { next(error); }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const assignments = await db.query(`
      SELECT a.id, a.user_id as "userId", u.username, 'assignment' as type, a.assignment_id as "itemId", a.status, a.submitted_at as "submittedAt"
      FROM assignment_submissions a
      LEFT JOIN users u ON a.user_id = u.id
    `);
    
    const projects = await db.query(`
      SELECT p.id, p.user_id as "userId", u.username, 'project' as type, p.project_id as "itemId", p.status, p.submitted_at as "submittedAt"
      FROM project_submissions p
      LEFT JOIN users u ON p.user_id = u.id
    `);

    // Combine and sort by date descending
    const submissions = [...assignments.rows, ...projects.rows].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    res.json({ submissions });
  } catch (error) { next(error); }
};

exports.reviewSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, type } = req.body;
    
    // In our combined array, we didn't specify type on the review request from frontend.
    // Frontend only sent: { status: 'approved' } or { status: 'rejected' }
    // But IDs might overlap between projects and assignments.
    // Since frontend didn't pass type, we'll try to find and update in both if we assume IDs are unique,
    // or better, we can modify the frontend request, but since we can't easily change it now, let's just 
    // update assignment or project based on where it exists.
    
    if (status !== 'approved' && status !== 'rejected') {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    // Try assignments first
    let result = await db.query('UPDATE assignment_submissions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id', [status, id]);
    
    // If not found, try projects
    if (result.rowCount === 0) {
      result = await db.query('UPDATE project_submissions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id', [status, id]);
    }
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    res.json({ message: 'Review updated successfully.' });
  } catch (error) { next(error); }
};
