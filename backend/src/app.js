const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.cors.origin, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting (Basic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// API routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
// app.use('/api/resources', require('./routes/resourceRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: env.nodeEnv === 'development' ? err : {}
  });
});

module.exports = app;
