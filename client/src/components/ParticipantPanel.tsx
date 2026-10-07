import React from 'react';
import { X, Mic, MicOff, Video, VideoOff, Crown, Users } from 'lucide-react';
import type { Participant } from '../types';

interface ParticipantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  localParticipant: Participant;
  remoteParticipants: Participant[];
}

export const ParticipantPanel: React.FC<ParticipantPanelProps> = ({
  isOpen,
  onClose,
  localParticipant,
  remoteParticipants
}) => {
  if (!isOpen) return null;

  const allParticipants = [localParticipant, ...remoteParticipants];

  return (
    <aside
      className="glass-panel side-panel"
      style={{
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(14, 17, 29, 0.95)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        zIndex: 20
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '16px', color: '#ffffff' }}>
            Participants ({allParticipants.length})
          </h3>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            padding: '4px',
            borderRadius: '6px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <X size={18} />
        </button>
      </div>

      {/* Participant List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {allParticipants.map((p, idx) => {
          const isMe = idx === 0;
          return (
            <div
              key={p.socketId || p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: isMe ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: isMe ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                {/* Active Presence Dot */}
                <span className="live-indicator" style={{ width: '7px', height: '7px', flexShrink: 0 }} />

                <div style={{ minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </span>
                    {isMe && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>
                        (You)
                      </span>
                    )}
                  </div>
                  {p.isHost && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#f59e0b' }}>
                      <Crown size={11} />
                      <span>Host</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                {p.cameraOn ? (
                  <Video size={15} color="var(--accent-success)" />
                ) : (
                  <VideoOff size={15} color="var(--accent-danger)" />
                )}

                {p.micOn ? (
                  <Mic size={15} color="var(--accent-success)" />
                ) : (
                  <MicOff size={15} color="var(--accent-danger)" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
