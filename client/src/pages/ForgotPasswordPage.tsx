import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Video, AlertCircle, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    const { error: authError } = await resetPassword(email.trim());
    setLoading(false);

    if (authError) {
      setError(authError.message || 'Failed to send reset email. Please try again.');
      return;
    }
    setSent(true);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '40px 24px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-120px', left: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '18px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 36px rgba(99,102,241,0.5)'
          }}>
            <Video size={28} color="#ffffff" strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', marginBottom: '6px', letterSpacing: '-0.03em' }}>
            Reset your password
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        {sent ? (
          /* Success state */
          <div style={{
            padding: '28px', borderRadius: 'var(--radius-md)',
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 16px',
              background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckCircle2 size={28} color="#34d399" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '10px' }}>Check your inbox</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              We've sent a password reset link to <strong style={{ color: '#ffffff' }}>{email}</strong>.
              The link expires in 1 hour.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Didn't receive it? Check your spam folder, or{' '}
              <button
                onClick={() => setSent(false)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: '600', cursor: 'pointer', fontSize: '13px', padding: 0 }}
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          <>
            {/* Error */}
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="input-forgot-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    style={{
                      width: '100%', padding: '13px 14px 13px 42px', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.12)',
                      fontSize: '14px', color: '#ffffff', transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                </div>
              </div>

              <button
                id="btn-forgot-submit"
                type="submit"
                disabled={loading}
                className="shimmer-btn"
                style={{
                  width: '100%', padding: '14px', borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #4f46e5 100%)',
                  color: '#ffffff', fontSize: '15px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1,
                  boxShadow: '0 8px 28px rgba(99,102,241,0.45)', transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(99,102,241,0.6)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.45)'; }}
              >
                {loading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
                <span>{loading ? 'Sending reset link…' : 'Send Reset Link'}</span>
              </button>
            </form>
          </>
        )}

        {/* Back to login */}
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <Link
            to="/auth/login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600', textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ArrowLeft size={15} />
            Back to Sign In
          </Link>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
