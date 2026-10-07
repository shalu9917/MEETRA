const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Helper to generate Zoom/Meet style meeting code: MTR-XXX-XXX
function generateMeetingCode() {
  const part1 = Math.floor(100 + Math.random() * 900);
  const part2 = Math.floor(100 + Math.random() * 900);
  return `MTR-${part1}-${part2}`;
}

// 1. Create a new meeting
router.post('/', (req, res) => {
  try {
    const { title, hostName, password } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Meeting title is required.' });
    }

    const hostId = uuidv4();
    const meetingId = uuidv4();
    const meetingCode = generateMeetingCode();
    const effectiveHostName = hostName && hostName.trim() ? hostName.trim() : 'Meeting Host';

    // Insert user
    db.prepare('INSERT INTO users (id, name) VALUES (?, ?)').run(hostId, effectiveHostName);

    // Insert meeting
    db.prepare(`
      INSERT INTO meetings (id, meeting_code, title, host_id, password, started_at, status)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'active')
    `).run(meetingId, meetingCode, title.trim(), hostId, password || null);

    return res.status(201).json({
      success: true,
      meeting: {
        id: meetingId,
        meetingCode,
        title: title.trim(),
        hostId,
        hostName: effectiveHostName
      }
    });
  } catch (err) {
    console.error('Error creating meeting:', err);
    return res.status(500).json({ error: 'Failed to create meeting: ' + err.message });
  }
});

// 2. Validate / get meeting by code
router.get('/:code', (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();
    const meeting = db.prepare(`
      SELECT m.*, u.name as host_name
      FROM meetings m
      LEFT JOIN users u ON m.host_id = u.id
      WHERE m.meeting_code = ?
    `).get(code);

    if (!meeting) {
      return res.status(404).json({
        error: `Meeting with ID "${code}" was not found. Please verify the code and try again.`
      });
    }

    return res.json({
      success: true,
      meeting: {
        id: meeting.id,
        meetingCode: meeting.meeting_code,
        title: meeting.title,
        hostId: meeting.host_id,
        hostName: meeting.host_name,
        status: meeting.status,
        hasPassword: !!meeting.password,
        createdAt: meeting.created_at,
        startedAt: meeting.started_at
      }
    });
  } catch (err) {
    console.error('Error fetching meeting:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// 3. Get recent meetings for dashboard
router.get('/', (req, res) => {
  try {
    const recentMeetings = db.prepare(`
      SELECT m.id, m.meeting_code as meetingCode, m.title, m.status, m.created_at as createdAt,
             m.started_at as startedAt, m.ended_at as endedAt,
             (SELECT COUNT(DISTINCT user_id) FROM participants WHERE meeting_id = m.id) as participantCount,
             (SELECT COUNT(*) FROM messages WHERE meeting_id = m.id) as messageCount
      FROM meetings m
      ORDER BY m.created_at DESC
      LIMIT 10
    `).all();

    return res.json({
      success: true,
      meetings: recentMeetings
    });
  } catch (err) {
    console.error('Error fetching recent meetings:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// 4. Meeting Summary (for Meeting End screen)
router.get('/:code/summary', (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();
    const meeting = db.prepare(`
      SELECT m.*, u.name as host_name
      FROM meetings m
      LEFT JOIN users u ON m.host_id = u.id
      WHERE m.meeting_code = ?
    `).get(code);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Participants count
    const participantStats = db.prepare(`
      SELECT COUNT(DISTINCT user_id) as count
      FROM participants
      WHERE meeting_id = ?
    `).get(meeting.id);

    // Messages count
    const messageStats = db.prepare(`
      SELECT COUNT(*) as count
      FROM messages
      WHERE meeting_id = ?
    `).get(meeting.id);

    // Duration calculation
    const startTime = new Date(meeting.started_at || meeting.created_at);
    const endTime = meeting.ended_at ? new Date(meeting.ended_at) : new Date();
    const durationSeconds = Math.max(0, Math.floor((endTime - startTime) / 1000));
    const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

    return res.json({
      success: true,
      summary: {
        meetingCode: meeting.meeting_code,
        title: meeting.title,
        hostName: meeting.host_name,
        startedAt: meeting.started_at,
        endedAt: meeting.ended_at || new Date().toISOString(),
        durationMinutes,
        durationSeconds,
        participantCount: Math.max(1, participantStats.count),
        messageCount: messageStats.count
      }
    });
  } catch (err) {
    console.error('Error fetching meeting summary:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;
