import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { createMeetingApi } from '../services/api';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingCreated: (meeting: { meetingCode: string; title: string; hostName: string; isHost: boolean }) => void;
  initialUserName: string;
}

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  onMeetingCreated,
  initialUserName
}) => {
  const [title, setTitle] = useState('');
  const [userName, setUserName] = useState(initialUserName || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Post-creation state
  const [createdMeeting, setCreatedMeeting] = useState<{
    meetingCode: string;
    title: string;
    hostName: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a meeting title');
      return;
    }
    if (!userName.trim()) {
      setError('Please provide your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await createMeetingApi(title.trim(), userName.trim(), password.trim() || undefined);
      setCreatedMeeting({
        meetingCode: res.meeting.meetingCode,
        title: res.meeting.title,
        hostName: userName.trim()
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (createdMeeting) {
      navigator.clipboard.writeText(createdMeeting.meetingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleEnterMeeting = () => {
    if (createdMeeting) {
      onMeetingCreated({
        meetingCode: createdMeeting.meetingCode,
        title: createdMeeting.title,
        hostName: createdMeeting.hostName,
        isHost: true
      });
      onClose();
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
        maxWidth: '520px',
        width: '100%',
        padding: '36px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Close Button */}
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

        {!createdMeeting ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)'
              }}>
                <Sparkles size={22} />
              </div>
              <h2 style={{ fontSize: '24px', color: '#ffffff' }}>Create New Meeting</h2>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
              Set up your meeting room and generate an instant secure link.
            </p>

            {error && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '13px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Meeting Title */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Meeting Title *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="input-create-title"
                    type="text"
                    required
                    placeholder="e.g. Design Sync & Sprint Review"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
              </div>

              {/* Your Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Your Display Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="input-create-name"
                    type="text"
                    required
                    placeholder="e.g. Nitin Kumar"
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
              </div>

              {/* Optional Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Optional Meeting Passcode
                </label>
                <input
                  id="input-create-passcode"
                  type="password"
                  placeholder="Leave empty for open room"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              <button
                type="submit"
                id="btn-create-submit"
                disabled={loading}
                style={{
                  marginTop: '12px',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '600',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Creating Room...' : 'Create Meeting'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <Check size={32} />
            </div>

            <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '8px' }}>Meeting Created Successfully</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Share this Meeting ID with your team to invite them.
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--border-active)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              marginBottom: '28px'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Meeting ID
              </span>
              <div id="display-created-meeting-code" style={{
                fontSize: '32px',
                fontWeight: '800',
                letterSpacing: '0.08em',
                color: 'var(--accent-cyan)',
                fontFamily: 'monospace',
                margin: '8px 0'
              }}>
                {createdMeeting.meetingCode}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {createdMeeting.title}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                id="btn-copy-meeting-id"
                onClick={handleCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-sm)',
                  background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  border: copied ? '1px solid var(--accent-success)' : '1px solid var(--border-subtle)',
                  color: copied ? '#34d399' : '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Meeting ID'}</span>
              </button>

              <button
                id="btn-enter-meeting"
                onClick={handleEnterMeeting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '600',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)'
                }}
              >
                <span>Enter Meeting Lobby</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
