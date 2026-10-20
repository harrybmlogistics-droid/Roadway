/**
 * Database module — JSON file store (no native build required)
 * Data is persisted to data/rlg-db.json
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH  = path.join(DATA_DIR, 'rlg-db.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ─── Load / Save ──────────────────────────────────────────────────────────────
function load() {
  try {
    if (!fs.existsSync(DB_PATH)) return { submissions: [] };
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { submissions: [] };
  }
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

console.log(`📦  JSON database ready: ${DB_PATH}`);

// ─── Exports ──────────────────────────────────────────────────────────────────

/**
 * Insert a new submission; returns the generated UUID.
 */
function insertSubmission(type, data) {
  const db = load();
  const id = uuidv4();
  const entry = {
    id,
    type,
    data,
    created_at: new Date().toISOString(),
    read_at: null,
    notes: null
  };
  db.submissions.unshift(entry); // newest first
  save(db);
  console.log(`  ✅  New submission [${type}] → ${id}`);
  return id;
}

/**
 * List submissions, with optional type filter.
 */
function listSubmissions({ type = null, limit = 50, offset = 0 } = {}) {
  const { submissions } = load();
  const filtered = type ? submissions.filter(s => s.type === type) : submissions;
  return filtered.slice(offset, offset + limit);
}

/**
 * Count submissions, with optional type filter.
 */
function countSubmissions(type = null) {
  const { submissions } = load();
  return type ? submissions.filter(s => s.type === type).length : submissions.length;
}

/**
 * Get a single submission by ID.
 */
function getSubmission(id) {
  const { submissions } = load();
  return submissions.find(s => s.id === id) || null;
}

/**
 * Quick stats for the admin dashboard.
 */
function getStats() {
  const { submissions } = load();
  const total = submissions.length;

  const byTypeMap = {};
  submissions.forEach(s => { byTypeMap[s.type] = (byTypeMap[s.type] || 0) + 1; });
  const byType = Object.entries(byTypeMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const now   = new Date();
  const today = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

  const todayCount    = submissions.filter(s => s.created_at.startsWith(today)).length;
  const thisWeekCount = submissions.filter(s => s.created_at >= weekAgo).length;

  return { total, today: todayCount, thisWeek: thisWeekCount, byType };
}

module.exports = { insertSubmission, listSubmissions, countSubmissions, getSubmission, getStats };
