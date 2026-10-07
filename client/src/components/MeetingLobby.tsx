import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, ArrowRight, ArrowLeft } from 'lucide-react';

interface MeetingLobbyProps {
  meetingCode: string;
  meetingTitle: string;
  userName: string;
  isHost: boolean;
  onEnterMeeting: (preferences: { micOn: boolean; cameraOn: boolean; userName: string }) => void;
  onBackToDashboard: () => void;
}

export const MeetingLobby: React.FC<MeetingLobbyProps> = ({
  meetingCode,
  meetingTitle,
  userName: initialUserName,
  isHost,
  onEnterMeeting,
  onBackToDashboard
}) => {
  const [userName, setUserName] = useState(initialUserName);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize preview stream
  useEffect(() => {
    let isCancelled = false;

    async function startPreview() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera/Mic permission in lobby failed or not found:', err);
      }
    }

    startPreview();

    return () => {
      isCancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Update track enabled states
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => (t.enabled = micOn));
    }
  }, [micOn]);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => (t.enabled = cameraOn));
    }
  }, [cameraOn]);

  const handleJoin = () => {
    // Stop local preview stream so the meeting room hook can acquire the stream cleanly
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    onEnterMeeting({
      micOn,
      cameraOn,
      userName: userName.trim() || 'Participant'
    });
  };

  return (
    <div style={{
      maxWidth: '960px',
      margin: '20px auto',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Back button */}
      <div>
        <button
          onClick={onBackToDashboard}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontWeight: '500',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '32px',
        alignItems: 'center'
      }}>
        {/* Left Column: Video Preview Card */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: '#0e111c',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          aspectRatio: '16/10',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
        }}>
          {cameraOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)' // Mirror local view
              }}
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: '700',
                color: '#ffffff'
              }}>
                {(userName || 'U').charAt(0).toUpperCase()}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Camera is off</span>
            </div>
          )}

          {/* Quick Floating Toggles over Preview */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            display: 'flex',
            gap: '12px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(10px)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <button
              id="lobby-toggle-mic"
              onClick={() => setMicOn((prev) => !prev)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: micOn ? 'rgba(255, 255, 255, 0.15)' : 'var(--accent-danger)',
                color: '#ffffff'
              }}
              title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              id="lobby-toggle-camera"
              onClick={() => setCameraOn((prev) => !prev)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: cameraOn ? 'rgba(255, 255, 255, 0.15)' : 'var(--accent-danger)',
                color: '#ffffff'
              }}
              title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
          </div>
        </div>

        {/* Right Column: Meeting Info & Join Action */}
        <div className="glass-panel" style={{
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--accent-cyan)',
                background: 'rgba(6, 182, 212, 0.12)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'monospace'
              }}>
                {meetingCode}
              </span>
              {isHost && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.15)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  HOST
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '4px' }}>
              {meetingTitle || 'MEETRA Meeting'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Check your audio and video before entering the room.
            </p>
          </div>

          {/* User Name Confirmation */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Your Display Name
            </label>
            <input
              id="lobby-display-name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                fontSize: '15px'
              }}
            />
          </div>

          {/* Device Readiness Summary */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Mic size={16} /> Microphone
              </span>
              <span style={{
                color: micOn ? 'var(--accent-success)' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '13px'
              }}>
                {micOn ? 'ON' : 'MUTED'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                <Video size={16} /> Camera
              </span>
              <span style={{
                color: cameraOn ? 'var(--accent-success)' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '13px'
              }}>
                {cameraOn ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>

          {/* Inspirational Pre-Meeting Quote */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            fontSize: '12px',
            color: '#c7d2fe',
            lineHeight: 1.5,
            fontStyle: 'italic'
          }}>
            💬 "Prepare with intent. Speak with clarity. Leave with action."
          </div>

          <button
            id="btn-join-meeting-lobby"
            onClick={handleJoin}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              cursor: 'pointer'
            }}
          >
            <span>Join Meeting</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
