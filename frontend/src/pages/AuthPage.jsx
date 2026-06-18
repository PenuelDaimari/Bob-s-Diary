import React, { useState } from 'react';
import { apiFetch } from '../utils/api';

const QUOTE = {
  q: "Fill your paper with the breathings of your heart.",
  c: "William Wordsworth",
};

export default function AuthPage({ onAuth, showToast }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  function switchMode(m) {
    setMode(m);
    setErr('');
    setPassword('');
    setOtp(''); 
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      const d = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
      showToast('Welcome back!', 'success');
      onAuth(d); 
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      await apiFetch('/auth/register', { method: 'POST', body: { email, password, username } });
      showToast('Check your email for the OTP.', 'success');
      setMode('verify');
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      const d = await apiFetch('/auth/verify-registration', { method: 'POST', body: { email, otp } });
      showToast('Account verified! Welcome!', 'success');
      onAuth(d); 
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  }

  async function handleForgot(e) {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      await apiFetch('/auth/forgot-password', { method: 'POST', body: { email } });
      showToast('Reset link sent to your email.', 'success');
      setMode('reset');
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  }

  async function handleReset(e) {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      await apiFetch('/auth/reset-password', { 
        method: 'POST', 
        body: { email, otp, newPassword: password } 
      });
      showToast('Password reset! Please log in.', 'success');
      setMode('login');
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  }

  const taglines = {
    login: 'Sign in to your diary',
    register: 'Start your writing journey',
    verify: 'Almost there — verify your email',
    forgot: "We'll send you a reset code",
    reset: 'Set your new password',
  };

  function renderForm() {
    if (mode === 'verify') return (
      <form onSubmit={handleVerify}>
        <button type="button" className="back-link" onClick={() => switchMode('register')}>← Back</button>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">OTP Code</label>
          <input className="form-input" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code from email" />
        </div>
        {err && <div className="form-error">{err}</div>}
        <button className="btn-submit" disabled={loading}>{loading ? 'Verifying…' : 'Verify Email'}</button>
      </form>
    );

    if (mode === 'forgot') return (
      <form onSubmit={handleForgot}>
        <button type="button" className="back-link" onClick={() => switchMode('login')}>← Back to login</button>
        <div className="form-group">
          <label className="form-label">Your Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        {err && <div className="form-error">{err}</div>}
        <button className="btn-submit" disabled={loading}>{loading ? 'Sending…' : 'Send Reset Code'}</button>
      </form>
    );

    if (mode === 'reset') return (
      <form onSubmit={handleReset}>
        <button type="button" className="back-link" onClick={() => switchMode('login')}>← Back to login</button>
        <div className="form-group">
          <label className="form-label">Reset Code</label>
          {/* Changed state from token to otp to reuse the variable */}
          <input className="form-input" value={otp} onChange={e => setOtp(e.target.value)} placeholder="6-digit code from email" />
        </div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" />
        </div>
        {err && <div className="form-error">{err}</div>}
        <button className="btn-submit" disabled={loading}>{loading ? 'Resetting…' : 'Reset Password'}</button>
      </form>
    );

    if (mode === 'register') return (
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className="form-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Your username" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a password" />
        </div>
        {err && <div className="form-error">{err}</div>}
        <button className="btn-submit" disabled={loading}>{loading ? 'Creating account…' : 'Create Account'}</button>
        <div className="form-alt">
          Already have an account?{' '}
          <button type="button" onClick={() => switchMode('login')}>Sign in</button>
        </div>
      </form>
    );

    return (
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" />
        </div>
        <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '12px' }}>
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '0.8rem', cursor: 'pointer' }}
            onClick={() => switchMode('forgot')}
          >
            Forgot password?
          </button>
        </div>
        {err && <div className="form-error">{err}</div>}
        <button className="btn-submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
        <div className="form-alt">
          New here?{' '}
          <button type="button" onClick={() => switchMode('register')}>Create an account</button>
        </div>
      </form>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-split">
        <div className="auth-left">
          <div className="auth-quote">
            <blockquote>"{QUOTE.q}"</blockquote>
            <cite>— {QUOTE.c}</cite>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="auth-logo">Bob's <span>Diary</span></div>
            <div className="auth-tagline">{taglines[mode]}</div>
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  );
}