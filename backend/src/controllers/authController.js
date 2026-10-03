const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const env = require('../config/env');

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

function publicUser(user) {
  return { id: user.id, username: user.username, email: user.email, selectedPath: user.selected_path, role: user.role };
}

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password || password.length < 8) {
      return res.status(400).json({ message: 'Username, email and a password of at least 8 characters are required.' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await db.query('SELECT id FROM users WHERE email = $1 OR username = $2', [normalizedEmail, username.trim()]);
    if (existing.rows.length) return res.status(409).json({ message: 'An account with that email or username already exists.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1,$2,$3) RETURNING id,username,email,selected_path,role',
      [username.trim(), normalizedEmail, passwordHash]
    );
    const user = rows[0];
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email?.trim().toLowerCase()]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password || '', user.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
};

exports.getMe = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id,username,email,selected_path,role FROM users WHERE id = $1', [req.user.id]);
    if (!rows[0]) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: publicUser(rows[0]) });
  } catch (error) { next(error); }
};