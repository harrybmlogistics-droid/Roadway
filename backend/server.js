/**
 * Roadway Logistics Group LLC — Backend API Server
 * Express + SQLite + Nodemailer
 * ============================================================
 */

'use strict';

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const path       = require('path');
const fs         = require('fs');

const db         = require('./db');
const mailer     = require('./mailer');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Middleware ───────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "*"]
    }
  },
  crossOriginEmbedderPolicy: false
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS — allow the React dev server and any same-origin request
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Global rate limiter — 200 req / 15 min per IP
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { error: 'Too many requests. Please slow down.' } }));

// Stricter limiter for form submissions
const formLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: { error: 'Slow down — too many submissions.' } });

// ─── Helper: Return validation errors ────────────────────────────────────────
function validate(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return false;
  }
  return true;
}

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// ─── 1. CONTACT FORM ─────────────────────────────────────────────────────────
app.post('/api/contact',
  formLimiter,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').trim().notEmpty().withMessage('Phone number is required').isLength({ max: 30 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
    body('equipmentType').optional().trim().isLength({ max: 50 }),
    body('reason').optional().trim().isLength({ max: 100 }),
    body('mcNumber').optional().trim().isLength({ max: 20 }),
    body('companyName').optional().trim().isLength({ max: 100 })
  ],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { fullName, email, phone, companyName, equipmentType, mcNumber, reason, message } = req.body;
      const id = db.insertSubmission('contact', { fullName, email, phone, companyName, equipmentType, mcNumber, reason, message });

      // Send emails (non-blocking on failure)
      mailer.sendContactNotification({ fullName, email, phone, companyName, equipmentType, mcNumber, reason, message }).catch(console.error);
      mailer.sendContactAutoReply({ fullName, email }).catch(console.error);

      res.json({ success: true, id, message: `Thank you ${fullName}! We will respond within 1–2 hours.` });
    } catch (err) {
      console.error('Contact error:', err);
      res.status(500).json({ success: false, error: 'Server error. Please call us directly.' });
    }
  }
);

// ─── 2. GET STARTED / FREE TRIAL FORM ────────────────────────────────────────
app.post('/api/get-started',
  formLimiter,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ max: 100 }),
    body('phone').trim().notEmpty().withMessage('Phone is required').isLength({ max: 30 }),
    body('serviceType').trim().notEmpty().withMessage('Service type is required').isLength({ max: 100 }),
    body('mcNumber').optional().trim().isLength({ max: 20 })
  ],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { fullName, phone, mcNumber, serviceType } = req.body;
      const id = db.insertSubmission('get-started', { fullName, phone, mcNumber, serviceType });

      mailer.sendGetStartedNotification({ fullName, phone, mcNumber, serviceType }).catch(console.error);
      mailer.sendGetStartedAutoReply({ fullName, phone }).catch(console.error);

      res.json({ success: true, id, message: `3-Day Free Trial activated for ${fullName}! Our dispatch team will call you shortly.` });
    } catch (err) {
      console.error('Get-started error:', err);
      res.status(500).json({ success: false, error: 'Server error. Please call us directly.' });
    }
  }
);

// ─── 3. DRIVER JOB APPLICATION ────────────────────────────────────────────────
app.post('/api/apply-job',
  formLimiter,
  [
    body('driverName').trim().notEmpty().withMessage('Driver name is required').isLength({ max: 100 }),
    body('phone').trim().notEmpty().withMessage('Phone is required').isLength({ max: 30 }),
    body('cityState').trim().notEmpty().withMessage('City & State is required').isLength({ max: 100 }),
    body('jobTitle').optional().trim().isLength({ max: 100 }),
    body('equipment').optional().trim().isLength({ max: 50 }),
    body('pay').optional().trim().isLength({ max: 50 })
  ],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { driverName, phone, cityState, jobTitle, equipment, pay } = req.body;
      const id = db.insertSubmission('job-application', { driverName, phone, cityState, jobTitle, equipment, pay });

      mailer.sendJobApplicationNotification({ driverName, phone, cityState, jobTitle, equipment, pay }).catch(console.error);

      res.json({ success: true, id, message: `Application received for ${driverName}! Our recruiting team will contact you within 24–48 hours.` });
    } catch (err) {
      console.error('Apply job error:', err);
      res.status(500).json({ success: false, error: 'Server error. Please call us directly.' });
    }
  }
);

// ─── 4. WEBSITE DESIGN INQUIRY ───────────────────────────────────────────────
app.post('/api/website-inquiry',
  formLimiter,
  [
    body('businessName').trim().notEmpty().withMessage('Business name is required').isLength({ max: 100 }),
    body('phone').trim().notEmpty().withMessage('Phone is required').isLength({ max: 30 }),
    body('email').optional().trim().isEmail().normalizeEmail()
  ],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { businessName, phone, email } = req.body;
      const id = db.insertSubmission('website-inquiry', { businessName, phone, email });

      mailer.sendWebsiteInquiryNotification({ businessName, phone, email }).catch(console.error);

      res.json({ success: true, id, message: `Website request received for ${businessName}! Our web team will contact you within 24 hours.` });
    } catch (err) {
      console.error('Website inquiry error:', err);
      res.status(500).json({ success: false, error: 'Server error. Please call us directly.' });
    }
  }
);

// ─── 5. HIRE DRIVERS (FLEET OWNER) ───────────────────────────────────────────
app.post('/api/hire-drivers',
  formLimiter,
  [
    body('companyName').trim().notEmpty().withMessage('Company name is required').isLength({ max: 100 }),
    body('phone').trim().notEmpty().withMessage('Phone is required').isLength({ max: 30 }),
    body('equipment').trim().notEmpty().withMessage('Equipment type is required').isLength({ max: 100 }),
    body('email').optional().trim().isEmail().normalizeEmail(),
    body('fleetSize').optional().trim().isLength({ max: 30 }),
    body('state').optional().trim().isLength({ max: 50 })
  ],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { companyName, phone, email, equipment, fleetSize, state } = req.body;
      const id = db.insertSubmission('hire-drivers', { companyName, phone, email, equipment, fleetSize, state });

      mailer.sendHireDriversNotification({ companyName, phone, email, equipment, fleetSize, state }).catch(console.error);

      res.json({ success: true, id, message: `Driver requirement logged for ${companyName}! We will send matched MVR-verified profiles within 2–3 business days.` });
    } catch (err) {
      console.error('Hire drivers error:', err);
      res.status(500).json({ success: false, error: 'Server error. Please call us directly.' });
    }
  }
);

// ─── 6. DOT / MC LOOKUP (Mock — real FMCSA API requires registration) ────────
const MOCK_CARRIERS = {
  'MC-1492810': { dotNumber: '1492810', mcNumber: 'MC-1492810', legalName: 'ROADWAY EXPRESS INC', status: 'ACTIVE', authority: 'AUTHORIZED FOR PROPERTY', bipdRequired: '$1,000,000', bocOnFile: true, entityType: 'CARRIER', phone: '(800) 555-0199', address: 'Fort Wayne, IN 46801' },
  'MC-123456': { dotNumber: '3456789', mcNumber: 'MC-123456', legalName: 'SAMPLE CARRIER LLC', status: 'ACTIVE', authority: 'AUTHORIZED FOR PROPERTY', bipdRequired: '$1,000,000', bocOnFile: true, entityType: 'CARRIER', phone: '(555) 000-0001', address: 'Dallas, TX 75201' },
  'DOT-3456789': { dotNumber: '3456789', mcNumber: 'MC-123456', legalName: 'SAMPLE CARRIER LLC', status: 'ACTIVE', authority: 'AUTHORIZED FOR PROPERTY', bipdRequired: '$1,000,000', bocOnFile: true, entityType: 'CARRIER', phone: '(555) 000-0001', address: 'Dallas, TX 75201' }
};

app.get('/api/dot-lookup/:query',
  [ param('query').trim().notEmpty().withMessage('DOT or MC number required') ],
  (req, res) => {
    if (!validate(req, res)) return;
    const q = req.params.query.trim().toUpperCase();
    const result = MOCK_CARRIERS[q] || {
      dotNumber: q.replace(/[^0-9]/g, '') || 'N/A',
      mcNumber: q.startsWith('MC') ? q : `MC-${q}`,
      legalName: `CARRIER #${q}`,
      status: 'ACTIVE',
      authority: 'AUTHORIZED FOR PROPERTY',
      bipdRequired: '$1,000,000',
      bocOnFile: true,
      entityType: 'CARRIER',
      phone: 'N/A',
      address: 'On file with FMCSA',
      note: 'Live FMCSA data requires API key. This is a simulated record.'
    };
    res.json({ success: true, data: result });
  }
);

// ─── 7. ADMIN — List All Submissions ─────────────────────────────────────────
app.get('/api/submissions', (req, res) => {
  try {
    const type   = req.query.type   || null;
    const limit  = Math.min(parseInt(req.query.limit  || '50'), 200);
    const offset = parseInt(req.query.offset || '0');
    const rows   = db.listSubmissions({ type, limit, offset });
    const total  = db.countSubmissions(type);
    res.json({ success: true, total, limit, offset, data: rows });
  } catch (err) {
    console.error('Submissions error:', err);
    res.status(500).json({ success: false, error: 'Could not retrieve submissions.' });
  }
});

// ─── 8. ADMIN — Single Submission ─────────────────────────────────────────────
app.get('/api/submissions/:id', (req, res) => {
  try {
    const row = db.getSubmission(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Not found.' });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not retrieve submission.' });
  }
});

// ─── 9. ADMIN — Dashboard Stats ───────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not retrieve stats.' });
  }
});

// ─── Static Frontend Serving (Production / Hostinger) ──────────────────────
const candidates = [
  process.env.STATIC_DIR,
  path.join(__dirname, 'public'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, '../ak2-freight-site/dist'),
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, '../client/dist')
].filter(Boolean);

const staticDir = candidates.find(p => fs.existsSync(p));
if (staticDir) {
  console.log(`📦 Serving static frontend from: ${staticDir}`);
  app.use(express.static(staticDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(staticDir, 'index.html'));
  });
}

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.path}` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚛  Roadway Logistics Group LLC — Backend API`);
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Submissions: http://localhost:${PORT}/api/submissions`);
  console.log(`   Stats: http://localhost:${PORT}/api/stats\n`);
});
