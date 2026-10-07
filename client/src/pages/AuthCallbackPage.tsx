import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../auth/supabaseClient';
import { Video, Loader2, AlertCircle } from 'lucide-react';

/**
 * Handles OAuth callback and email confirmation redirects from Supabase.
 * Supabase appends tokens in the URL fragment (#access_token=...&type=...)
 * after Google OAuth. This page picks them up, lets the SDK exchange them,
 * then redirects to the dashboard.
 */
export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    // Supabase auth listener picks up the fragment automatically when the page loads.
    // We listen for the session to be established then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Redirect to dashboard (or wherever the user was heading)
        const redirectTo = sessionStorage.getItem('meetra_auth_redirect') || '/';
        sessionStorage.removeItem('meetra_auth_redirect');
        navigate(redirectTo, { replace: true });
      } else if (event === 'PASSWORD_RECOVERY') {
        // User clicked reset password link
        navigate('/auth/reset-password', { replace: true });
      }
    });

    // Fallback: if session already exists from URL hash exchange, redirect quickly
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError.message);
        return;
      }
      if (data.session) {
        const redirectTo = sessionStorage.getItem('meetra_auth_redirect') || '/';
        sessionStorage.removeItem('meetra_auth_redirect');
        navigate(redirectTo, { replace: true });
      }
    });

    // Timeout fallback — if no auth event fires in 8 seconds, show error
    const timeout = setTimeout(() => {
      setError('Authentication timed out. Please try signing in again.');
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', gap: '16px'
      }}>
        <div style={{
          padding: '20px 24px', borderRadius: 'var(--radius-md)', maxWidth: '380px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center'
        }}>
          <AlertCircle size={32} color="#f87171" />
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#fca5a5' }}>Authentication Failed</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{error}</p>
          <button
            onClick={() => navigate('/auth/login', { replace: true })}
            style={{
              padding: '10px 24px', borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary)', color: '#fff',
              fontSize: '14px', fontWeight: '700', cursor: 'pointer'
            }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', gap: '20px'
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '18px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 12px 40px rgba(99,102,241,0.5)',
        animation: 'authPulse 1.8s ease-in-out infinite'
      }}>
        <Video size={30} color="#ffffff" strokeWidth={2.5} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '8px' }}>
          <Loader2 size={18} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>Completing sign in…</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Please wait while we set up your MEETRA workspace
        </p>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes authPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
};
