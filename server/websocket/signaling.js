const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Active rooms in memory for low-latency signaling
const activeRooms = new Map();

function setupSignaling(io) {
  io.on('connection', (socket) => {
    let currentMeetingCode = null;
    let currentUser = null;

    // User joins a meeting room
    socket.on('join-room', ({ meetingCode, userId, userName, micOn, cameraOn, isHost }) => {
      currentMeetingCode = meetingCode;
      currentUser = {
        userId: userId || uuidv4(),
        userName: userName || 'Guest',
        socketId: socket.id,
        micOn: !!micOn,
        cameraOn: !!cameraOn,
        isScreenSharing: false,
        isHost: !!isHost,
        joinedAt: new Date().toISOString()
      };

      socket.join(meetingCode);

      if (!activeRooms.has(meetingCode)) {
        activeRooms.set(meetingCode, new Map());
      }
      const roomParticipants = activeRooms.get(meetingCode);

      // Record in database
      try {
        const meetingRow = db.prepare('SELECT id FROM meetings WHERE meeting_code = ?').get(meetingCode);
        if (meetingRow) {
          db.prepare(`
            INSERT INTO participants (id, meeting_id, user_id, user_name, joined_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
          `).run(uuidv4(), meetingRow.id, currentUser.userId, currentUser.userName);
        }
      } catch (err) {
        console.error('Error logging participant join to DB:', err.message);
      }

      // Collect existing participants in the room
      const existing = [];
      for (const [sId, p] of roomParticipants.entries()) {
        existing.push(p);
      }

      // Add new participant
      roomParticipants.set(socket.id, currentUser);

      // Notify the newcomer of existing participants
      socket.emit('room-joined', {
        participants: existing,
        self: currentUser
      });

      // Notify everyone else in the room
      socket.to(meetingCode).emit('user-joined', currentUser);

      // Load previous chat history for this meeting
      try {
        const meetingRow = db.prepare('SELECT id FROM meetings WHERE meeting_code = ?').get(meetingCode);
        if (meetingRow) {
          const messages = db.prepare(`
            SELECT id, user_id as userId, user_name as userName, message, created_at as timestamp
            FROM messages
            WHERE meeting_id = ?
            ORDER BY created_at ASC
          `).all(meetingRow.id);
          socket.emit('chat-history', messages);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err.message);
      }
    });

    // WebRTC: Signaling Offer
    socket.on('signal-offer', ({ targetSocketId, offer }) => {
      io.to(targetSocketId).emit('signal-offer', {
        senderSocketId: socket.id,
        senderUser: currentUser,
        offer
      });
    });

    // WebRTC: Signaling Answer
    socket.on('signal-answer', ({ targetSocketId, answer }) => {
      io.to(targetSocketId).emit('signal-answer', {
        senderSocketId: socket.id,
        answer
      });
    });

    // WebRTC: ICE Candidate
    socket.on('signal-ice-candidate', ({ targetSocketId, candidate }) => {
      io.to(targetSocketId).emit('signal-ice-candidate', {
        senderSocketId: socket.id,
        candidate
      });
    });

    // Media state toggles (Mic, Camera, Screen share)
    socket.on('media-state-change', ({ meetingCode, micOn, cameraOn, isScreenSharing }) => {
      if (currentUser) {
        if (typeof micOn === 'boolean') currentUser.micOn = micOn;
        if (typeof cameraOn === 'boolean') currentUser.cameraOn = cameraOn;
        if (typeof isScreenSharing === 'boolean') currentUser.isScreenSharing = isScreenSharing;

        if (activeRooms.has(meetingCode)) {
          activeRooms.get(meetingCode).set(socket.id, currentUser);
        }

        io.to(meetingCode).emit('media-state-updated', {
          socketId: socket.id,
          userId: currentUser.userId,
          micOn: currentUser.micOn,
          cameraOn: currentUser.cameraOn,
          isScreenSharing: currentUser.isScreenSharing
        });
      }
    });

    // Chat Message
    socket.on('send-message', ({ meetingCode, messageText }) => {
      if (!currentUser || !messageText || !messageText.trim()) return;

      const msgObj = {
        id: uuidv4(),
        userId: currentUser.userId,
        userName: currentUser.userName,
        message: messageText.trim(),
        timestamp: new Date().toISOString()
      };

      try {
        const meetingRow = db.prepare('SELECT id FROM meetings WHERE meeting_code = ?').get(meetingCode);
        if (meetingRow) {
          db.prepare(`
            INSERT INTO messages (id, meeting_id, user_id, user_name, message, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(msgObj.id, meetingRow.id, msgObj.userId, msgObj.userName, msgObj.message, msgObj.timestamp);
        }
      } catch (err) {
        console.error('Error persisting chat message:', err.message);
      }

      io.to(meetingCode).emit('receive-message', msgObj);
    });

    // Host Ends Meeting for everyone
    socket.on('end-meeting', ({ meetingCode }) => {
      try {
        db.prepare(`
          UPDATE meetings
          SET status = 'ended', ended_at = CURRENT_TIMESTAMP
          WHERE meeting_code = ?
        `).run(meetingCode);
      } catch (err) {
        console.error('Error updating meeting status on end:', err.message);
      }

      io.to(meetingCode).emit('meeting-ended', {
        reason: 'The host has ended the meeting for everyone.'
      });

      if (activeRooms.has(meetingCode)) {
        activeRooms.delete(meetingCode);
      }
    });

    // Participant leaves voluntarily
    socket.on('leave-meeting', ({ meetingCode }) => {
      handleUserLeave(socket, meetingCode, currentUser);
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      if (currentMeetingCode && currentUser) {
        handleUserLeave(socket, currentMeetingCode, currentUser);
      }
    });
  });

  function handleUserLeave(socket, meetingCode, user) {
    if (!meetingCode || !user) return;

    if (activeRooms.has(meetingCode)) {
      const room = activeRooms.get(meetingCode);
      room.delete(socket.id);
      if (room.size === 0) {
        activeRooms.delete(meetingCode);
      }
    }

    // Update left_at in db
    try {
      const meetingRow = db.prepare('SELECT id FROM meetings WHERE meeting_code = ?').get(meetingCode);
      if (meetingRow) {
        db.prepare(`
          UPDATE participants
          SET left_at = CURRENT_TIMESTAMP
          WHERE meeting_id = ? AND user_id = ? AND left_at IS NULL
        `).run(meetingRow.id, user.userId);
      }
    } catch (err) {
      console.error('Error recording participant leave:', err.message);
    }

    socket.to(meetingCode).emit('user-left', {
      socketId: socket.id,
      userId: user.userId,
      userName: user.userName
    });
    socket.leave(meetingCode);
  }
}

module.exports = { setupSignaling, activeRooms };
