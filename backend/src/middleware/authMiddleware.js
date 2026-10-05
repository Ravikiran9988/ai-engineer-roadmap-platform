const jwt = require('jsonwebtoken');
const env = require('../config/env');
const db = require('../config/database');

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required.' });
  try {
    const decoded = jwt.verify(header.slice(7), env.jwt.secret);
    const { rows } = await db.query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.id]
    );
    if (!rows[0]) return res.status(401).json({ message: 'User account is no longer available.' });
    req.user = rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    next(error);
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
};