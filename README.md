# MEETRA — An AI-Powered Intelligent Meeting & Action Tracking Platform

> **Meet. Decide. Act. Track.**  
> *Phase 1: WebRTC Video & Audio Meeting Foundation*

---

## 🌟 Overview

MEETRA is an enterprise-grade meeting and collaboration platform. Phase 1 provides the high-performance foundation for multi-user real-time meetings—featuring peer-to-peer audio and video via WebRTC, native screen sharing, low-latency group chat, active speaking detection, participant presence, and post-session summaries.

---

## 🚀 Key Features Built in Phase 1

1. **Futuristic Dark Modern UI**: Built with a sleek dark aesthetic, glassmorphism (`backdrop-filter`), glowing status accents, and typography using Google Fonts (Outfit & Inter).
2. **Home Dashboard**:
   - Quick **[ + Create Meeting ]** and **[ Join Meeting ]** actions.
   - Live list of recent and upcoming meetings with participants & message counts.
   - Direct code entry with validation.
3. **Meeting Creation & Auto-Code**:
   - Form for title, display name, and optional password.
   - Generates unique meeting codes (e.g., `MTR-482-719`).
   - Copy-to-clipboard and instant entry to the lobby.
4. **Meeting Lobby**:
   - Live camera & microphone preview before entering the room.
   - Interactive toggles for 🎤 Mic (ON/MUTED) and 📹 Camera (ON/OFF).
   - Display name confirmation.
5. **Meeting Room**:
   - **Responsive Video Grid**: Dynamic grid layouts adjusting for 1, 2, 4, or 6+ attendees.
   - **Participant Cards**: Live video streams, avatar fallbacks with initials, mic status badges, and speaking detection pulses.
   - **Spotlight Screen Sharing**: Spotlight view mode when a user shares their screen.
   - **Bottom Control Bar**: Mute, Camera, Screen Share, Chat, Participants, Settings, and Leave/End meeting actions.
   - **Real-Time Group Chat**: Messages with timestamps and sender identifiers.
   - **Participant Sidebar**: Live online status, host indicators, and mic/camera state tracking.
   - **Host Controls**: Ability to leave individually or "End Meeting for Everyone".
6. **Meeting End Screen**:
   - Session duration, participant count, and chat messages count.
   - Preview of Phase 2 AI Intelligence (Automatic MOM, Action Items, and Task Tracking).
7. **SQLite Database**:
   - `users`, `meetings`, `participants`, and `messages` tables with persistent history.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Vanilla CSS Design System, Lucide Icons, Socket.IO Client.
- **Backend**: Node.js, Express, Socket.IO, Better-SQLite3, UUID.
- **Real-Time**: WebRTC mesh P2P (Google STUN), Socket.IO signaling, Web Audio API Analyser for speech detection.

---

## 💻 Running the Application

### 1. Install Dependencies
```bash
# In the root directory:
npm install

# In the client directory:
cd client && npm install && cd ..
```

### 2. Start MEETRA (Both Server & Client)
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3002`
- **Backend API & WebSockets**: `http://localhost:5000`

### 3. Multi-Tab / Multi-Device Testing
1. Open `http://localhost:3002` in **Tab 1** (or Device 1) and click **+ Create Meeting**.
2. Copy the generated Meeting ID (e.g. `MTR-482-719`) and enter the lobby.
3. Open `http://localhost:3002` in **Tab 2** (or Device 2 / Incognito window), enter your name and the Meeting ID.
4. Both participants can see each other's camera feed, speak, chat in real-time, and share screen!

---

## 🌍 Deployment (Render)

MEETRA is configured for simple deployment on [Render](https://render.com) using a Web Service.

1. Connect your GitHub repository to Render and create a new **Web Service**.
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - Add your Supabase keys from `.env`:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
5. **Persistent Database**:
   - Because MEETRA uses SQLite, you need a Persistent Disk to save data across server restarts.
   - Go to the Render Web Service settings, add a **Disk**.
   - Mount path: `/data`
   - Size: `1 GB` (or as needed)
   - Add an Environment Variable: `DB_DIR=/data`

Render will automatically build the React frontend and serve it using the Express backend, running entirely on a single domain.
