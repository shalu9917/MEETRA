import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, VideoOff, Crown, Monitor } from 'lucide-react';
import type { Participant } from '../types';

interface ParticipantCardProps {
  participant: Participant;
  isLocal?: boolean;
  isSpeaking?: boolean;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  isLocal = false,
  isSpeaking = false
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream, participant.cameraOn]);

  const initials = (participant.name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`glass-panel ${isSpeaking ? 'speaking-pulse' : ''}`}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        background: '#0d101d',
        border: isSpeaking ? '2px solid var(--accent-success)' : '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '220px',
        height: '100%',
        width: '100%',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Video Element */}
      {participant.cameraOn && participant.stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Avoid local feedback echo
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isLocal && !participant.isScreenSharing ? 'scaleX(-1)' : 'none'
          }}
        />
      ) : (
        /* Camera Off Fallback Avatar */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, #1b2038 0%, #0c0f1a 100%)'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: isLocal
              ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
              : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: '700',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }}>
            {initials}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <VideoOff size={14} />
            <span>Camera Off</span>
          </div>
        </div>
      )}

      {/* Screen Sharing Watermark Badge */}
      {participant.isScreenSharing && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(6, 182, 212, 0.85)',
          backdropFilter: 'blur(6px)',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '11px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <Monitor size={12} />
          <span>Screen Sharing</span>
        </div>
      )}

      {/* Bottom Participant Info Bar */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        {/* Name Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          padding: '5px 12px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '80%'
        }}>
          {participant.isHost && (
            <Crown size={13} color="#f59e0b" style={{ flexShrink: 0 }} />
          )}
          <span style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#ffffff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {participant.name} {isLocal ? '(You)' : ''}
          </span>
        </div>

        {/* Mic Status Badge */}
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: participant.micOn ? 'rgba(16, 185, 129, 0.85)' : 'rgba(239, 68, 68, 0.85)',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          {participant.micOn ? <Mic size={14} /> : <MicOff size={14} />}
        </div>
      </div>
    </div>
  );
};
