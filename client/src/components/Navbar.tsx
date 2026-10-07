import React, { useState, useEffect, useRef } from 'react';
import { Video, ShieldCheck, Clock, Calendar, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onGoHome?: () => void;
  activeMeetingCode?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome, activeMeetingCode }) => {
  const { user, displayName, avatarUrl, signOut } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = (displayName || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    navigate('/auth/login', { replace: true });
  };

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 32px', borderBottom: '1px solid rgba(255,255,255,0.09)',
      background: 'rgba(8,10,18,0.88)', backdropFilter: 'blur(20px)',
      position: 'sticky', top: 0, zIndex: 40,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
    }}>
      {/* Brand */}
      <div
        onClick={onGoHome}
        style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: onGoHome ? 'pointer' : 'default', userSelect: 'none' }}
      >
        <div style={{
          width: '44px', height: '44px', borderRadius: '14px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.4)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Video size={24} color="#ffffff" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '24px', fontWeight: '800', letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #ffffff 40%, #cbd5e1 80%, #818cf8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontFamily: 'var(--font-heading)'
            }}>MEETRA</span>
            <span style={{
              fontSize: '10px', padding: '2px 8px', borderRadius: '6px',
              background: 'rgba(99,102,241,0.18)', color: '#a5b4fc',
              fontWeight: '700', border: '1px solid rgba(99,102,241,0.35)', letterSpacing: '0.04em'
            }}>PHASE 1</span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.04em' }}>
            Meet. Decide. Act. Track.
          </p>
        </div>
      </div>

      {/* Active Meeting Badge */}
      {activeMeetingCode && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px',
          borderRadius: 'var(--radius-full)', background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.3)', color: '#34d399',
          fontSize: '13px', fontWeight: '700', boxShadow: '0 0 15px rgba(16,185,129,0.2)'
        }}>
          <span className="live-indicator" />
          <span>IN SESSION: {activeMeetingCode}</span>
        </div>
      )}

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* Date & Time */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
          padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '13px'
        }}>
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={14} /><span>{dateStr}</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ color: '#ffffff', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={14} color="var(--accent-cyan)" /><span>{time}</span>
          </span>
        </div>

        {/* P2P Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '500' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span style={{ color: 'var(--text-secondary)' }}>Encrypted P2P</span>
        </div>

        {/* User Profile Chip with Dropdown */}
        {user && (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              id="btn-user-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '4px 10px 4px 5px', borderRadius: 'var(--radius-full)',
                background: menuOpen ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              {/* Avatar */}
              <div style={{ position: 'relative', width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden' }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '700', color: '#ffffff'
                  }}>
                    {initials}
                  </div>
                )}
                {/* Online dot */}
                <span style={{
                  position: 'absolute', bottom: '-1px', right: '-1px',
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#10b981', border: '1.5px solid #080a11'
                }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </span>
              <ChevronDown size={14} color="var(--text-muted)" style={{ transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                minWidth: '220px', borderRadius: 'var(--radius-md)',
                background: 'rgba(14,18,36,0.96)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                overflow: 'hidden', animation: 'menuFadeIn 0.15s ease'
              }}>
                {/* User info header */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayName}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </p>
                </div>

                {/* Menu items */}
                <div style={{ padding: '6px' }}>
                  <button
                    onClick={() => { setMenuOpen(false); }}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px',
                      background: 'none', color: 'var(--text-secondary)',
                      fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px',
                      cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#ffffff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <User size={15} />
                    <span>Profile</span>
                  </button>

                  <div style={{ margin: '4px 0', height: '1px', background: 'rgba(255,255,255,0.07)' }} />

                  <button
                    id="btn-sign-out"
                    onClick={handleSignOut}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px',
                      background: 'none', color: 'var(--text-secondary)',
                      fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px',
                      cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes menuFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};
