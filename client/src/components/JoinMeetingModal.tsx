import React, { useState, useEffect } from 'react';
import { X, LogIn, ArrowRight, AlertCircle } from 'lucide-react';
import { getMeetingByCodeApi } from '../services/api';

interface JoinMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingJoined: (details: { meetingCode: string; title: string; userName: string; isHost: boolean }) => void;
  initialCode?: string;
  initialUserName: string;
}

export const JoinMeetingModal: React.FC<JoinMeetingModalProps> = ({
  isOpen,
  onClose,
  onMeetingJoined,
  initialCode = '',
  initialUserName
}) => {
  const [meetingCode, setMeetingCode] = useState(initialCode);
  const [userName, setUserName] = useState(initialUserName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialCode) {
      setMeetingCode(initialCode);
    }
  }, [initialCode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!meetingCode.trim()) {
      setError('Please enter the meeting ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanCode = meetingCode.trim().toUpperCase();
      const meeting = await getMeetingByCodeApi(cleanCode);

      onMeetingJoined({
        meetingCode: meeting.meetingCode,
        title: meeting.title,
        userName: userName.trim(),
        isHost: false
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Meeting ID not found. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '36px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            color: 'var(--text-muted)',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <LogIn size={22} />
          </div>
          <h2 style={{ fontSize: '24px', color: '#ffffff' }}>Join Meeting</h2>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
          Enter the meeting ID provided by the host to join.
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Your Name *
            </label>
            <input
              id="input-join-name"
              type="text"
              required
              placeholder="e.g. Khushboo Sharma"
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

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Meeting ID *
            </label>
            <input
              id="input-join-meeting-code"
              type="text"
              required
              placeholder="MTR-XXX-XXX"
              value={meetingCode}
              onChange={(e) => {
                setMeetingCode(e.target.value.toUpperCase());
                setError('');
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-subtle)',
                fontSize: '16px',
                fontWeight: '700',
                letterSpacing: '0.05em',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <button
            type="submit"
            id="btn-join-modal-submit"
            disabled={loading}
            style={{
              marginTop: '12px',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
              opacity: loading ? 0.7 : 1
            }}
          >
            <span>{loading ? 'Verifying Meeting...' : 'Join Meeting'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
