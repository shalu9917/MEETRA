import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Video, AlertCircle, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

export const SignupPage: React.FC = () => {
  const { signUp, signInWithGoogle } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const passwordStrength = (pw: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
      { label: '', color: 'transparent' },
      { label: 'Very Weak', color: '#ef4444' },
      { label: 'Weak', color: '#f59e0b' },
      { label: 'Fair', color: '#eab308' },
      { label: 'Strong', color: '#22c55e' },
      { label: 'Very Strong', color: '#06b6d4' },
    ];
    return { score, ...levels[Math.min(score, 5)] };
  };
  const strength = passwordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!fullName.trim()) { setError('Full name is required.'); return; }
    if (fullName.trim().length < 2) { setError('Name must be at least 2 characters.'); return; }
    if (!email.trim()) { setError('Email address is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const { error: authError } = (await signUp(email.trim(), password, fullName.trim())) as any;
    setLoading(false);

    if (authError) {
      if (authError.message?.toLowerCase().includes('already registered') || authError.message?.toLowerCase().includes('user already exists')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else {
        setError(authError.message || 'Account creation failed. Please try again.');
      }
      return;
    }

    setSuccessMessage(`Account created! We've sent a verification email to ${email}. Please check your inbox to activate your account.`);
  };

  const handleGoogleSignup = async () => {
    setError('');
    setGoogleLoading(true);
    const { error: authError } = await signInWithGoogle();
    setGoogleLoading(false);
    if (authError) {
      setError(authError.message || 'Google sign-up failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)' }} />
      </div>

      {/* Form container */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', position: 'relative', zIndex: 1
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '18px', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 36px rgba(99,102,241,0.55)'
            }}>
              <Video size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', marginBottom: '6px', letterSpacing: '-0.03em' }}>
              Create your account
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Join MEETRA and start meeting smarter
            </p>
          </div>

          {/* Success message */}
          {successMessage && (
            <div style={{
              display: 'flex', gap: '12px', padding: '14px 16px', marginBottom: '20px',
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <CheckCircle2 size={18} color="#34d399" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#34d399', marginBottom: '4px' }}>Account created!</p>
                <p style={{ fontSize: '13px', color: '#86efac', lineHeight: 1.5 }}>{successMessage}</p>
                <Link to="/auth/login" style={{ display: 'inline-block', marginTop: '8px', fontSize: '13px', fontWeight: '700', color: '#34d399', textDecoration: 'none' }}>
                  Back to Sign In →
                </Link>
              </div>
            </div>
          )}

          {!successMessage && (
            <>
              {/* Google button */}
              <button
                id="btn-google-signup"
                onClick={handleGoogleSignup}
                disabled={googleLoading || loading}
                style={{
                  width: '100%', padding: '13px 20px', borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#ffffff', fontSize: '15px', fontWeight: '600',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  cursor: googleLoading || loading ? 'not-allowed' : 'pointer',
                  opacity: googleLoading || loading ? 0.7 : 1,
                  marginBottom: '20px', transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { if (!googleLoading && !loading) e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              >
                {googleLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>{googleLoading ? 'Connecting…' : 'Continue with Google'}</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.06em' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px',
                  background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)',
                  borderRadius: 'var(--radius-sm)', marginBottom: '16px'
                }}>
                  <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '13px', color: '#fca5a5', lineHeight: 1.5 }}>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '7px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      id="input-signup-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); setError(''); }}
                      style={{
                        width: '100%', padding: '12px 14px 12px 42px',
                        borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.12)', fontSize: '14px', color: '#ffffff'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '7px' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      id="input-signup-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      style={{
                        width: '100%', padding: '12px 14px 12px 42px',
                        borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.12)', fontSize: '14px', color: '#ffffff'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '7px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      id="input-signup-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      style={{
                        width: '100%', padding: '12px 42px 12px 42px',
                        borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.12)', fontSize: '14px', color: '#ffffff'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
                      onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {password && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} style={{
                            flex: 1, height: '3px', borderRadius: '2px',
                            background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)',
                            transition: 'background 0.3s ease'
                          }} />
                        ))}
                      </div>
                      {strength.label && (
                        <p style={{ fontSize: '11px', color: strength.color, fontWeight: '600' }}>{strength.label}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '7px' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      id="input-signup-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      style={{
                        width: '100%', padding: '12px 42px 12px 42px',
                        borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.4)',
                        border: `1px solid ${confirmPassword && confirmPassword !== password ? 'rgba(239,68,68,0.5)' : confirmPassword && confirmPassword === password ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.12)'}`,
                        fontSize: '14px', color: '#ffffff'
                      }}
                      onFocus={(e) => { if (!confirmPassword) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; }}
                      onBlur={(e) => { if (!confirmPassword) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword === password && (
                    <p style={{ fontSize: '11px', color: '#34d399', fontWeight: '600', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Passwords match
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  id="btn-signup-submit"
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
                    boxShadow: '0 8px 28px rgba(99,102,241,0.45)'
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(99,102,241,0.6)'; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.45)'; }}
                >
                  {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={18} />}
                  <span>{loading ? 'Creating account…' : 'Create Account'}</span>
                </button>
              </form>
            </>
          )}

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link
              to="/auth/login"
              style={{ color: 'var(--accent-primary)', fontWeight: '700', textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
