import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Video, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

export const LoginPage: React.FC = () => {
  const { signIn, signInWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }
    if (!password) { setError('Please enter your password.'); return; }

    setLoading(true);
    const { error: authError } = await signIn(email.trim(), password);
    setLoading(false);

    if (authError) {
      if (authError.message?.toLowerCase().includes('invalid login credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else if (authError.message?.toLowerCase().includes('email not confirmed')) {
        setError('Please verify your email address before signing in. Check your inbox.');
      } else {
        setError(authError.message || 'Sign in failed. Please try again.');
      }
      return;
    }

    navigate(from, { replace: true });
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    const { error: authError } = await signInWithGoogle();
    setGoogleLoading(false);
    if (authError) {
      setError(authError.message || 'Google sign-in failed. Please try again.');
    }
    // On success, Supabase redirects to /auth/callback — no manual navigate needed
  };

  if (authLoading) return null;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ── Ambient background orbs ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-120px', left: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-60px', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 60%)' }} />
      </div>

      {/* ── Left decorative panel (hidden on small) ── */}
      <div style={{
        flex: '0 0 45%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 48px',
        background: 'linear-gradient(145deg, rgba(16,20,40,0.9) 0%, rgba(10,13,28,0.95) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        zIndex: 1,
      }}
        className="auth-left-panel"
      >
        {/* Logo */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 40px rgba(99,102,241,0.55), inset 0 1px 0 rgba(255,255,255,0.3)'
          }}>
            <Video size={34} color="#ffffff" strokeWidth={2.5} />
          </div>
          <h1 style={{
            fontSize: '38px', fontWeight: '800', letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #ffffff 30%, #cbd5e1 70%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontFamily: 'var(--font-heading)'
          }}>MEETRA</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.06em', marginTop: '6px' }}>
            MEET. DECIDE. ACT. TRACK.
          </p>
        </div>

        {/* Feature highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '320px' }}>
          {[
            { icon: '🎥', title: 'HD Video Meetings', desc: 'Crystal-clear P2P video with ultra-low latency' },
            { icon: '⚡', title: 'Real-Time Collaboration', desc: 'Screen sharing, chat, and live participant controls' },
            { icon: '🔒', title: 'End-to-End Encrypted', desc: 'WebRTC P2P ensures your meetings stay private' },
            { icon: '🤖', title: 'AI-Ready Platform', desc: 'Built for intelligent meeting analytics in Phase 2' },
          ].map((f) => (
            <div key={f.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
              }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9', marginBottom: '2px' }}>{f.title}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom quote */}
        <p style={{
          marginTop: '52px', fontSize: '13px', color: 'var(--text-muted)',
          fontStyle: 'italic', textAlign: 'center', maxWidth: '280px', lineHeight: 1.6
        }}>
          "Meetings should be where decisions are made, not where work goes to die."
        </p>
      </div>

      {/* ── Right: Login form ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', position: 'relative', zIndex: 1
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Mobile logo (shown only when left panel hidden) */}
          <div style={{ display: 'none', textAlign: 'center', marginBottom: '32px' }} className="auth-mobile-logo">
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', margin: '0 auto 12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.5)'
            }}>
              <Video size={26} color="#ffffff" strokeWidth={2.5} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff' }}>MEETRA</h2>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', letterSpacing: '-0.03em' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
              Sign in to your MEETRA workspace
            </p>
          </div>

          {/* ── Google Button ── */}
          <button
            id="btn-google-login"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            style={{
              width: '100%', padding: '13px 20px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff', fontSize: '15px', fontWeight: '600',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              cursor: googleLoading || loading ? 'not-allowed' : 'pointer',
              opacity: googleLoading || loading ? 0.7 : 1,
              transition: 'all 0.2s ease', marginBottom: '24px'
            }}
            onMouseEnter={(e) => { if (!googleLoading && !loading) e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
          >
            {googleLoading ? (
              <Loader2 size={18} className="spin-icon" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>{googleLoading ? 'Connecting to Google…' : 'Continue with Google'}</span>
          </button>

          {/* ── Divider ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.06em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* ── Error Message ── */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: 'var(--radius-sm)', marginBottom: '20px'
            }}>
              <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '13px', color: '#fca5a5', lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          {/* ── Login Form ── */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="input-login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  style={{
                    width: '100%', padding: '13px 14px 13px 42px', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: '14px', color: '#ffffff', transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <Link
                  to="/auth/forgot-password"
                  style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  style={{
                    width: '100%', padding: '13px 42px 13px 42px', borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: '14px', color: '#ffffff', transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={loading || googleLoading}
              className="shimmer-btn"
              style={{
                width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)', marginTop: '4px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #4f46e5 100%)',
                color: '#ffffff', fontSize: '15px', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
                opacity: loading || googleLoading ? 0.75 : 1,
                boxShadow: '0 8px 28px rgba(99,102,241,0.45)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => { if (!loading && !googleLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(99,102,241,0.6)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.45)'; }}
            >
              {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={18} />}
              <span>{loading ? 'Signing in…' : 'Sign In to MEETRA'}</span>
            </button>
          </form>

          {/* ── Sign up link ── */}
          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link
              to="/auth/signup"
              style={{ color: 'var(--accent-primary)', fontWeight: '700', textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
            >
              Create one for free
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          .auth-mobile-logo { display: block !important; }
        }
      `}</style>
    </div>
  );
};
