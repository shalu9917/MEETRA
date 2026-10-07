import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { ProtectedRoute } from './auth/ProtectedRoute';

import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { CreateMeetingModal } from './components/CreateMeetingModal';
import { JoinMeetingModal } from './components/JoinMeetingModal';
import { MeetingLobby } from './components/MeetingLobby';
import { MeetingRoom } from './components/MeetingRoom';
import { MeetingEndScreen } from './components/MeetingEndScreen';

import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

import type { AppScreen } from './types';
import { getMeetingByCodeApi } from './services/api';

// ─── Dashboard (the existing single-page meeting flow) ────────────────────────

function Dashboard() {
  const { user, displayName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [prefillJoinCode, setPrefillJoinCode] = useState('');

  // Use Supabase user id as stable userId; fallback to localStorage
  const userId = user?.id ?? (() => {
    let id = localStorage.getItem('meetra_user_id');
    if (!id) {
      id = 'usr-' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('meetra_user_id', id);
    }
    return id;
  })();

  const [activeMeeting, setActiveMeeting] = useState<{
    meetingCode: string;
    title: string;
    isHost: boolean;
  } | null>(null);

  const [mediaPrefs, setMediaPrefs] = useState<{ micOn: boolean; cameraOn: boolean }>({
    micOn: true,
    cameraOn: true,
  });

  // Handle ?meeting= query param (direct invite links)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const meetingParam = params.get('meeting');
    if (meetingParam) {
      getMeetingByCodeApi(meetingParam)
        .then((meeting) => {
          setActiveMeeting({ meetingCode: meeting.meetingCode, title: meeting.title, isHost: false });
          setCurrentScreen('lobby');
        })
        .catch(() => {
          setPrefillJoinCode(meetingParam);
          setIsJoinOpen(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMeetingCreated = (meeting: { meetingCode: string; title: string; hostName: string; isHost: boolean }) => {
    setActiveMeeting({ meetingCode: meeting.meetingCode, title: meeting.title, isHost: meeting.isHost });
    navigate(`/?meeting=${meeting.meetingCode}`, { replace: true });
    setCurrentScreen('lobby');
  };

  const handleMeetingJoined = (meeting: { meetingCode: string; title: string; userName: string; isHost: boolean }) => {
    setActiveMeeting({ meetingCode: meeting.meetingCode, title: meeting.title, isHost: meeting.isHost });
    navigate(`/?meeting=${meeting.meetingCode}`, { replace: true });
    setCurrentScreen('lobby');
  };

  const handleEnterMeetingFromLobby = (prefs: { micOn: boolean; cameraOn: boolean; userName: string }) => {
    setMediaPrefs({ micOn: prefs.micOn, cameraOn: prefs.cameraOn });
    setCurrentScreen('meeting');
  };

  const handleMeetingLeaveOrEnd = () => setCurrentScreen('end');

  const handleBackToDashboard = () => {
    navigate('/', { replace: true });
    setActiveMeeting(null);
    setCurrentScreen('home');
  };

  return (
    <div className="meetra-app">
      <Navbar
        onGoHome={currentScreen !== 'meeting' ? handleBackToDashboard : undefined}
        activeMeetingCode={currentScreen === 'meeting' ? activeMeeting?.meetingCode : undefined}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentScreen === 'home' && (
          <HomeDashboard
            userName={displayName}
            onCreateClick={() => setIsCreateOpen(true)}
            onJoinClick={(code) => {
              if (code) setPrefillJoinCode(code);
              setIsJoinOpen(true);
            }}
          />
        )}

        {currentScreen === 'lobby' && activeMeeting && (
          <MeetingLobby
            meetingCode={activeMeeting.meetingCode}
            meetingTitle={activeMeeting.title}
            userName={displayName}
            isHost={activeMeeting.isHost}
            onEnterMeeting={handleEnterMeetingFromLobby}
            onBackToDashboard={handleBackToDashboard}
          />
        )}

        {currentScreen === 'meeting' && activeMeeting && (
          <MeetingRoom
            meetingCode={activeMeeting.meetingCode}
            meetingTitle={activeMeeting.title}
            userId={userId}
            userName={displayName}
            isHost={activeMeeting.isHost}
            initialMicOn={mediaPrefs.micOn}
            initialCameraOn={mediaPrefs.cameraOn}
            onMeetingLeaveOrEnd={handleMeetingLeaveOrEnd}
          />
        )}

        {currentScreen === 'end' && activeMeeting && (
          <MeetingEndScreen
            meetingCode={activeMeeting.meetingCode}
            meetingTitle={activeMeeting.title}
            onBackToDashboard={handleBackToDashboard}
          />
        )}
      </main>

      <CreateMeetingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onMeetingCreated={handleMeetingCreated}
        initialUserName={displayName}
      />
      <JoinMeetingModal
        isOpen={isJoinOpen}
        onClose={() => { setIsJoinOpen(false); setPrefillJoinCode(''); }}
        onMeetingJoined={handleMeetingJoined}
        initialCode={prefillJoinCode}
        initialUserName={displayName}
      />
    </div>
  );
}

// ─── Auth Guard for already-logged-in users hitting /auth/* ──────────────────

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

// ─── Root App with Router + AuthProvider ─────────────────────────────────────

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Auth routes (unauthenticated only) ── */}
          <Route path="/auth/login" element={<AuthGuard><LoginPage /></AuthGuard>} />
          <Route path="/auth/signup" element={<AuthGuard><SignupPage /></AuthGuard>} />
          <Route path="/auth/forgot-password" element={<AuthGuard><ForgotPasswordPage /></AuthGuard>} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* ── Protected dashboard (main app) ── */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
