// ─────────────────────────────────────────────
//  MediChain AI — Server Entry Point
// ─────────────────────────────────────────────
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const path    = require('path');
const rateLimit = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// ── Serve Static Client ─────────────────────
app.use(express.static(path.join(__dirname, '../client')));

// ── API Routes ──────────────────────────────
app.use('/api/health',     require('./routes/health'));
app.use('/api/patients',   require('./routes/patients'));
app.use('/api/blockchain', require('./routes/blockchain'));
app.use('/api/ai',         require('./routes/ai'));
app.use('/api/records',    require('./routes/records'));

// ── SPA Fallback ────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// ── Error Handler ───────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🏥 MediChain AI running at http://localhost:${PORT}`);
  console.log(`⛓  Blockchain initialized with genesis block`);
  console.log(`🤖 AI endpoint ready\n`);
});

module.exports = app;
