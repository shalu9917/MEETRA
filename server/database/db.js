const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = process.env.DB_DIR || path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'meetra.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize schema according to Phase 1 specs
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS meetings (
    id TEXT PRIMARY KEY,
    meeting_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    host_id TEXT NOT NULL,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    ended_at DATETIME,
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    left_at DATETIME,
    FOREIGN KEY(meeting_id) REFERENCES meetings(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(meeting_id) REFERENCES meetings(id)
  );
`);

// Seed some initial demo recent meetings if table is empty
const meetingCount = db.prepare('SELECT COUNT(*) as count FROM meetings').get().count;
if (meetingCount === 0) {
  const seedMeetings = [
    {
      id: 'seed-1',
      code: 'MTR-842-194',
      title: 'Project Architecture & Roadmap Discussion',
      host_id: 'user-nitin',
      status: 'ended',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      started_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      ended_at: new Date(Date.now() - 3600000 * 23.2).toISOString(),
    },
    {
      id: 'seed-2',
      code: 'MTR-529-610',
      title: 'Frontend & UI System Sprint Sync',
      host_id: 'user-khushboo',
      status: 'ended',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      started_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      ended_at: new Date(Date.now() - 3600000 * 47.4).toISOString(),
    }
  ];

  const insertMeeting = db.prepare(`
    INSERT INTO meetings (id, meeting_code, title, host_id, created_at, started_at, ended_at, status)
    VALUES (@id, @code, @title, @host_id, @created_at, @started_at, @ended_at, @status)
  `);

  for (const m of seedMeetings) {
    insertMeeting.run(m);
  }
}

module.exports = db;
