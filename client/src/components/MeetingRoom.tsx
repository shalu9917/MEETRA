import React, { useState, useEffect } from 'react';
import { Copy, Check, Clock, Users } from 'lucide-react';
import { useMeetingRoom } from '../hooks/useMeetingRoom';
import { ParticipantCard } from './ParticipantCard';
import { MeetingControls } from './MeetingControls';
import { ChatPanel } from './ChatPanel';
import { ParticipantPanel } from './ParticipantPanel';
import { SettingsModal } from './SettingsModal';
import type { Participant } from '../types';

interface MeetingRoomProps {
  meetingCode: string;
  meetingTitle: string;
  userId: string;
  userName: string;
  isHost: boolean;
  initialMicOn: boolean;
  initialCameraOn: boolean;
  onMeetingLeaveOrEnd: () => void;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  meetingCode,
  meetingTitle,
  userId,
  userName,
  isHost,
  initialMicOn,
  initialCameraOn,
  onMeetingLeaveOrEnd
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Hook for WebRTC and Socket state
  const {
    localStream,
    screenStream,
    isMicOn,
    isCameraOn,
    isScreenSharing,
    isLocalSpeaking,
    participants: remoteParticipants,
    messages,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    sendMessage,
    leaveMeeting,
    endMeetingForEveryone
  } = useMeetingRoom({
    meetingCode,
    userId,
    userName,
    isHost,
    initialMicOn,
    initialCameraOn,
    onMeetingEnded: (reason) => {
      alert(reason || 'The meeting has ended.');
      onMeetingLeaveOrEnd();
    }
  });

  // Track elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(meetingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLeave = () => {
    leaveMeeting();
    onMeetingLeaveOrEnd();
  };

  const handleEndEveryone = () => {
    endMeetingForEveryone();
    onMeetingLeaveOrEnd();
  };

  // Local participant object
  const localParticipant: Participant = {
    id: userId,
    name: userName,
    socketId: 'local',
    micOn: isMicOn,
    cameraOn: isCameraOn,
    isScreenSharing,
    isHost,
    isLocal: true,
    stream: isScreenSharing && screenStream ? screenStream : localStream,
    isSpeaking: isLocalSpeaking
  };

  const allParticipantsCount = 1 + remoteParticipants.length;

  // Determine grid template dynamically based on participant count, but with mobile responsiveness
  const getGridStyle = () => {
    if (allParticipantsCount === 1) {
      return {
        display: 'grid',
        gridTemplateColumns: '1fr',
        maxWidth: '880px',
        margin: '0 auto',
        height: '100%',
        width: '100%'
      };
    }
    
    // For mobile or multiple participants, use auto-fit to wrap gracefully
    return {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      height: '100%',
      width: '100%',
      alignContent: 'center',
      justifyContent: 'center'
    };
  };

  // Check if anyone is screen sharing
  const activeSharer = isScreenSharing
    ? localParticipant
    : remoteParticipants.find((p) => p.isScreenSharing);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 75px)',
      overflow: 'hidden',
      position: 'relative',
      background: '#090b13'
    }}>
      {/* Meeting Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'rgba(14, 17, 30, 0.75)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)',
        zIndex: 10
      }}>
        {/* Title and ID */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '17px', color: '#ffffff', fontWeight: '700' }}>
              {meetingTitle}
            </h2>
          </div>

          <div
            id="meeting-header-code-pill"
            onClick={handleCopyCode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-cyan)',
              fontSize: '12px',
              fontWeight: '700',
              fontFamily: 'monospace',
              cursor: 'pointer'
            }}
            title="Click to copy meeting ID"
          >
            <span>{meetingCode}</span>
            {copiedCode ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
          </div>
        </div>

        {/* Center: Duration Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          fontSize: '13px',
          fontWeight: '600',
          color: '#ffffff'
        }}>
          <Clock size={15} color="var(--accent-primary)" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>

        {/* Right: Participant Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-secondary)',
            fontSize: '13px'
          }}>
            <Users size={16} />
            <span>{allParticipantsCount} in call</span>
          </div>
        </div>
      </div>

      {/* Main Call Area: Videos + Optional Sidebars */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        padding: '16px',
        gap: '16px',
        position: 'relative'
      }}>
        {/* Video Area */}
        <div style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {activeSharer ? (
            /* Spotlight Screen Sharing View */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              gap: '12px'
            }}>
              {/* Large Spotlight for Screen Share */}
              <div style={{ flex: 1, minHeight: 0 }}>
                <ParticipantCard
                  participant={activeSharer}
                  isLocal={activeSharer.isLocal}
                  isSpeaking={activeSharer.isSpeaking}
                />
              </div>

              {/* Strip of participants along the bottom */}
              <div style={{
                display: 'flex',
                gap: '12px',
                height: '130px',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}>
                {!activeSharer.isLocal && (
                  <div style={{ width: '200px', flexShrink: 0 }}>
                    <ParticipantCard
                      participant={localParticipant}
                      isLocal={true}
                      isSpeaking={isLocalSpeaking}
                    />
                  </div>
                )}
                {remoteParticipants
                  .filter((p) => p.socketId !== activeSharer.socketId)
                  .map((peer) => (
                    <div key={peer.socketId} style={{ width: '200px', flexShrink: 0 }}>
                      <ParticipantCard participant={peer} />
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            /* Normal Grid View */
            <div style={getGridStyle()}>
              {/* Local Participant Card (You) */}
              <ParticipantCard
                participant={localParticipant}
                isLocal={true}
                isSpeaking={isLocalSpeaking}
              />

              {/* Remote Participant Cards */}
              {remoteParticipants.map((peer) => (
                <ParticipantCard key={peer.socketId} participant={peer} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebars (Chat / Participants) */}
        {isParticipantsOpen && (
          <ParticipantPanel
            isOpen={isParticipantsOpen}
            onClose={() => setIsParticipantsOpen(false)}
            localParticipant={localParticipant}
            remoteParticipants={remoteParticipants}
          />
        )}

        {isChatOpen && (
          <ChatPanel
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            messages={messages}
            currentUserId={userId}
            onSendMessage={sendMessage}
          />
        )}
      </div>

      {/* Floating Bottom Control Bar */}
      <div className="meeting-controls-container" style={{
        padding: '12px 16px 20px 16px',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 25
      }}>
        <MeetingControls
          micOn={isMicOn}
          cameraOn={isCameraOn}
          isScreenSharing={isScreenSharing}
          isChatOpen={isChatOpen}
          isParticipantsOpen={isParticipantsOpen}
          unreadCount={0}
          participantCount={allParticipantsCount}
          isHost={isHost}
          onToggleMic={toggleMicrophone}
          onToggleCamera={toggleCamera}
          onToggleScreenShare={toggleScreenShare}
          onToggleChat={() => {
            setIsChatOpen((prev) => !prev);
            if (!isChatOpen) setIsParticipantsOpen(false);
          }}
          onToggleParticipants={() => {
            setIsParticipantsOpen((prev) => !prev);
            if (!isParticipantsOpen) setIsChatOpen(false);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLeaveMeeting={handleLeave}
          onEndMeetingForEveryone={handleEndEveryone}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
