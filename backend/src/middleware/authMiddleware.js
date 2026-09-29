const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.protect = (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required.' });
  try {
    const decoded = jwt.verify(header.slice(7), env.jwt.secret);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};