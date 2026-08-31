import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const STEPS = {
  EMAIL: 'email',
  OTP:   'otp',
  RESET: 'reset',
  DONE:  'done',
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep]           = useState(STEPS.EMAIL);
  const [email, setEmail]         = useState('');
  const [otp, setOtp]             = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const clearError = () => setError('');

  // ── Step 1: Send OTP ──────────────────────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    clearError();
    if (!email.trim()) return setError('Please enter your email.');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.toLowerCase().trim() });
      setStep(STEPS.OTP);
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    clearError();
    if (otp.length !== 6) return setError('OTP must be 6 digits.');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email: email.toLowerCase().trim(), otp });
      setResetToken(res.data.resetToken);
      setStep(STEPS.RESET);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearError();
    if (password.length < 6)    return setError('Password must be at least 6 characters.');
    if (password !== confirm)    return setError('Passwords do not match.');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { resetToken, password });
      setStep(STEPS.DONE);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step indicator ───────────────────────────────────────────────────────
  const stepIdx = { [STEPS.EMAIL]: 0, [STEPS.OTP]: 1, [STEPS.RESET]: 2, [STEPS.DONE]: 3 };
  const labels  = ['Enter Email', 'Enter OTP', 'New Password', 'Done'];

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[var(--background)] flex items-center justify-center page-pad">
      <div className="w-full page-shell page-shell--sm">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-teal-500 p-8 text-center">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-2xl font-black text-white">Forgot Password</h1>
            <p className="text-indigo-100 text-sm mt-1">
              {step === STEPS.EMAIL && 'We\'ll send a one-time password to your email'}
              {step === STEPS.OTP   && `OTP sent to ${email}`}
              {step === STEPS.RESET && 'Choose a strong new password'}
              {step === STEPS.DONE  && 'All done!'}
            </p>
          </div>

          {/* Step dots */}
          {step !== STEPS.DONE && (
            <div className="flex items-center justify-center gap-2 pt-6 px-8">
              {labels.slice(0,3).map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${i < stepIdx[step]  ? 'bg-indigo-600 text-white' : ''}
                    ${i === stepIdx[step] ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 scale-110' : ''}
                    ${i > stepIdx[step]  ? 'bg-slate-100 text-slate-400' : ''}
                  `}>
                    {i < stepIdx[step] ? '✓' : i + 1}
                  </div>
                  {i < 2 && <div className={`w-8 h-0.5 ${i < stepIdx[step] ? 'bg-indigo-500' : 'bg-slate-200'}`} />}
                </div>
              ))}
            </div>
          )}

          <div className="p-8">
            {/* Error */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* ── STEP 1: Email ── */}
            {step === STEPS.EMAIL && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); clearError(); }}
                    placeholder="you@example.com"
                    className="input-ring"
                    required
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Sending OTP…' : 'Send OTP'}
                </button>
              </form>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === STEPS.OTP && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">6-digit OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); clearError(); }}
                    placeholder="••••••"
                    className="input-ring text-center text-2xl font-bold tracking-[0.4em]"
                    autoFocus
                  />
                  <p className="text-xs text-slate-500 mt-2 text-center">Check your inbox (and spam folder)</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Verifying…' : 'Verify OTP'}
                </button>

                {/* Resend */}
                <div className="text-center text-sm text-slate-500">
                  Didn't receive it?{' '}
                  {resendTimer > 0
                    ? <span className="text-indigo-400">Resend in {resendTimer}s</span>
                    : <button type="button" className="text-indigo-600 font-semibold hover:underline"
                        onClick={async () => {
                          setError('');
                          setLoading(true);
                          try {
                            await api.post('/auth/forgot-password', { email });
                            startResendTimer();
                          } catch { setError('Failed to resend.'); }
                          finally { setLoading(false); }
                        }}>
                        Resend OTP
                      </button>
                  }
                </div>
              </form>
            )}

            {/* ── STEP 3: New Password ── */}
            {step === STEPS.RESET && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); clearError(); }}
                    placeholder="Min 6 characters"
                    className="input-ring"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); clearError(); }}
                    placeholder="Repeat new password"
                    className="input-ring"
                  />
                </div>
                {/* Password strength indicator */}
                {password && (
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${
                        password.length >= 10 ? 'w-full bg-green-500' :
                        password.length >= 6  ? 'w-2/3 bg-yellow-400' : 'w-1/3 bg-red-400'
                      }`} />
                    </div>
                    <p className="text-xs text-slate-400">
                      {password.length >= 10 ? '✅ Strong' : password.length >= 6 ? '⚠️ Good' : '❌ Too short'}
                    </p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Resetting…' : 'Reset Password'}
                </button>
              </form>
            )}

            {/* ── STEP 4: Done ── */}
            {step === STEPS.DONE && (
              <div className="text-center py-4">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-xl font-black text-slate-900 mb-2">Password Reset!</h2>
                <p className="text-slate-500 text-sm mb-6">You can now log in with your new password.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary w-full"
                >
                  Go to Login
                </button>
              </div>
            )}

            {/* Back to login */}
            {step !== STEPS.DONE && (
              <p className="text-center text-sm text-slate-500 mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
