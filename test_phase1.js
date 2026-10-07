const http = require('http');
const { io } = require('socket.io-client');

async function runTests() {
  console.log('=== MEETRA Phase 1 Integration Tests ===\n');

  // Test 1: Backend Health Check
  console.log('Test 1: Backend Health Check...');
  const health = await fetch('http://localhost:5000/api/health').then(r => r.json());
  console.log('✓ Health status:', health);

  // Test 2: Frontend Dev Server
  console.log('\nTest 2: Frontend HTML Delivery...');
  const frontendHtml = await fetch('http://localhost:3002/').then(r => r.text());
  if (frontendHtml.includes('MEETRA') && frontendHtml.includes('root')) {
    console.log('✓ Frontend server delivered valid HTML containing MEETRA root!');
  } else {
    throw new Error('Frontend did not deliver expected HTML');
  }

  // Test 3: Create Meeting API
  console.log('\nTest 3: POST /api/meetings (Create Meeting)...');
  const createRes = await fetch('http://localhost:5000/api/meetings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Phase 1 Sprint Architecture Sync',
      hostName: 'Nitin Kumar'
    })
  }).then(r => r.json());

  console.log('✓ Meeting created:', createRes);
  const meetingCode = createRes.meeting.meetingCode;
  if (!meetingCode.startsWith('MTR-')) {
    throw new Error('Invalid meeting code format: ' + meetingCode);
  }

  // Test 4: Validate Meeting by Code
  console.log(`\nTest 4: GET /api/meetings/${meetingCode} (Validate Meeting)...`);
  const validateRes = await fetch(`http://localhost:5000/api/meetings/${meetingCode}`).then(r => r.json());
  console.log('✓ Meeting validated:', validateRes);

  // Test 5: Real-time Multi-User Signaling & Chat via Socket.IO
  console.log('\nTest 5: Socket.IO Multi-User Signaling & Chat...');
  await new Promise((resolve, reject) => {
    const socketA = io('http://localhost:5000', { transports: ['websocket'] });
    const socketB = io('http://localhost:5000', { transports: ['websocket'] });

    let socketAReceivedPeer = false;
    let socketBReceivedPeer = false;
    let socketBReceivedChat = false;
    let socketAReceivedAnswer = false;

    socketA.on('connect', () => {
      console.log('  - User A (Nitin - Host) connected to socket');
      socketA.emit('join-room', {
        meetingCode,
        userId: 'user-nitin-1',
        userName: 'Nitin Kumar',
        micOn: true,
        cameraOn: true,
        isHost: true
      });
    });

    socketB.on('connect', () => {
      console.log('  - User B (Khushboo - Participant) connected to socket');
      socketB.emit('join-room', {
        meetingCode,
        userId: 'user-khushboo-2',
        userName: 'Khushboo Sharma',
        micOn: true,
        cameraOn: true,
        isHost: false
      });
    });

    // When User B joins, User A should receive 'user-joined'
    socketA.on('user-joined', (peer) => {
      console.log('  ✓ User A received user-joined event for:', peer.userName);
      socketAReceivedPeer = true;

      // Simulate sending WebRTC Offer from A to B
      socketA.emit('signal-offer', {
        targetSocketId: peer.socketId,
        offer: { type: 'offer', sdp: 'dummy-sdp-test' }
      });
    });

    // User B receives room-joined with existing participants
    socketB.on('room-joined', ({ participants }) => {
      console.log('  ✓ User B received room-joined with', participants.length, 'existing participant(s)');
      socketBReceivedPeer = participants.length > 0;
    });

    // User B receives WebRTC Offer and sends Answer
    socketB.on('signal-offer', ({ senderSocketId, offer }) => {
      console.log('  ✓ User B received WebRTC offer from User A');
      socketB.emit('signal-answer', {
        targetSocketId: senderSocketId,
        answer: { type: 'answer', sdp: 'dummy-sdp-answer' }
      });
    });

    // User A receives WebRTC Answer
    socketA.on('signal-answer', ({ answer }) => {
      console.log('  ✓ User A received WebRTC answer successfully!');
      socketAReceivedAnswer = true;

      // Send Chat message from User A
      console.log('  - User A sending chat message...');
      socketA.emit('send-message', {
        meetingCode,
        messageText: 'Frontend Friday tak complete ho jayega.'
      });
    });

    // User B receives chat message
    socketB.on('receive-message', (msg) => {
      console.log('  ✓ User B received message:', `${msg.userName}: "${msg.message}" at ${msg.timestamp}`);
      socketBReceivedChat = true;

      // Simulate Host ending meeting for everyone
      console.log('  - User A (Host) ending meeting for everyone...');
      socketA.emit('end-meeting', { meetingCode });
    });

    // User B receives meeting-ended event
    socketB.on('meeting-ended', ({ reason }) => {
      console.log('  ✓ User B received meeting-ended notification:', reason);
      socketA.disconnect();
      socketB.disconnect();

      if (socketAReceivedPeer && socketBReceivedPeer && socketBReceivedChat && socketAReceivedAnswer) {
        resolve();
      } else {
        reject(new Error('Signaling or chat checks did not all pass'));
      }
    });

    setTimeout(() => {
      reject(new Error('Test timed out waiting for socket events'));
    }, 8000);
  });

  // Test 6: Meeting Summary API (For End Screen)
  console.log(`\nTest 6: GET /api/meetings/${meetingCode}/summary (End Screen Summary)...`);
  const summaryRes = await fetch(`http://localhost:5000/api/meetings/${meetingCode}/summary`).then(r => r.json());
  console.log('✓ Summary retrieved successfully:', summaryRes);

  console.log('\n=== ALL PHASE 1 CORE FLOW INTEGRATION TESTS PASSED! ===');
}

runTests().catch(err => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
