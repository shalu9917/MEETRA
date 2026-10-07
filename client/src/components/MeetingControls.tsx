import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MessageSquare,
  Users,
  Settings,
  PhoneOff,
  ChevronUp
} from 'lucide-react';

interface MeetingControlsProps {
  micOn: boolean;
  cameraOn: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  unreadCount: number;
  participantCount: number;
  isHost: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onOpenSettings: () => void;
  onLeaveMeeting: () => void;
  onEndMeetingForEveryone: () => void;
}

export const MeetingControls: React.FC<MeetingControlsProps> = ({
  micOn,
  cameraOn,
  isScreenSharing,
  isChatOpen,
  isParticipantsOpen,
  unreadCount,
  participantCount,
  isHost,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleChat,
  onToggleParticipants,
  onOpenSettings,
  onLeaveMeeting,
  onEndMeetingForEveryone
}) => {
  const [showLeaveOptions, setShowLeaveOptions] = useState(false);

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '12px 24px',
      background: 'rgba(14, 17, 30, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 'var(--radius-full)',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
      margin: '0 auto',
      zIndex: 30
    }}>
      {/* 1. Microphone Toggle */}
      <button
        id="btn-control-mic"
        onClick={onToggleMic}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: micOn ? 'rgba(255, 255, 255, 0.1)' : 'var(--accent-danger)',
          color: '#ffffff',
          boxShadow: micOn ? 'none' : '0 0 16px rgba(239, 68, 68, 0.4)'
        }}
        title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
      >
        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      {/* 2. Camera Toggle */}
      <button
        id="btn-control-camera"
        onClick={onToggleCamera}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: cameraOn ? 'rgba(255, 255, 255, 0.1)' : 'var(--accent-danger)',
          color: '#ffffff',
          boxShadow: cameraOn ? 'none' : '0 0 16px rgba(239, 68, 68, 0.4)'
        }}
        title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
      >
        {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      {/* 3. Screen Share Toggle */}
      <button
        id="btn-control-screen"
        onClick={onToggleScreenShare}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isScreenSharing ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          boxShadow: isScreenSharing ? '0 0 16px rgba(6, 182, 212, 0.5)' : 'none'
        }}
        title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
      >
        <Monitor size={20} />
      </button>

      {/* Divider */}
      <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.15)', margin: '0 4px' }} />

      {/* 4. Chat Toggle */}
      <button
        id="btn-control-chat"
        onClick={onToggleChat}
        style={{
          position: 'relative',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isChatOpen ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff'
        }}
        title="Toggle Chat"
      >
        <MessageSquare size={20} />
        {unreadCount > 0 && !isChatOpen && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: 'var(--accent-danger)',
            color: '#ffffff',
            borderRadius: '50%',
            fontSize: '11px',
            fontWeight: '700',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* 5. Participants Toggle */}
      <button
        id="btn-control-participants"
        onClick={onToggleParticipants}
        style={{
          position: 'relative',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isParticipantsOpen ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff'
        }}
        title="Toggle Participants"
      >
        <Users size={20} />
        <span style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          background: 'rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          borderRadius: '10px',
          fontSize: '10px',
          fontWeight: '700',
          padding: '2px 5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {participantCount}
        </span>
      </button>

      {/* 6. Settings */}
      <button
        id="btn-control-settings"
        onClick={onOpenSettings}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff'
        }}
        title="Settings"
      >
        <Settings size={20} />
      </button>

      {/* Divider */}
      <div style={{ width: '1px', height: '28px', background: 'rgba(255, 255, 255, 0.15)', margin: '0 4px' }} />

      {/* 7. Leave / End Meeting Button */}
      <div style={{ position: 'relative' }}>
        {showLeaveOptions && isHost && (
          <div style={{
            position: 'absolute',
            bottom: '60px',
            right: 0,
            background: 'rgba(18, 22, 38, 0.95)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            width: '210px',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(16px)'
          }}>
            <button
              id="btn-leave-self"
              onClick={() => {
                setShowLeaveOptions(false);
                onLeaveMeeting();
              }}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Leave Meeting
            </button>

            <button
              id="btn-end-for-everyone"
              onClick={() => {
                setShowLeaveOptions(false);
                onEndMeetingForEveryone();
              }}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                fontSize: '13px',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
            >
              End Meeting for Everyone
            </button>
          </div>
        )}

        <button
          id="btn-control-leave"
          onClick={() => {
            if (isHost) {
              setShowLeaveOptions((prev) => !prev);
            } else {
              onLeaveMeeting();
            }
          }}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--accent-danger)',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
          }}
          title="Leave Meeting"
        >
          <PhoneOff size={18} />
          <span>Leave</span>
          {isHost && <ChevronUp size={14} />}
        </button>
      </div>
    </div>
  );
};
