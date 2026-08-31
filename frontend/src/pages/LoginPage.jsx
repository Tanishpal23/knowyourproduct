import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Captcha from '../components/Captcha';

export default function LoginPage() {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const captchaRef = useRef(null);

  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const captchaOk = captchaRef.current?.validate(captchaValue);
    if (!captchaOk) {
      captchaRef.current?.refresh();
      return;
    }

    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      captchaRef.current?.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[var(--background)] flex items-center justify-center page-pad">
      <div className="w-full page-shell page-shell--sm">
        <div className="text-center mb-8 fade-in-up">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center">
              <span className="text-white font-black">K</span>
            </div>
          </Link>
          <h1 className="page-title">Welcome back</h1>
          <p className="page-subtitle mx-auto">Sign in to access your scan history and saved products</p>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
          {error && <div className="mb-5 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input id="login-email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="you@example.com"
                className="input-ring"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input id="login-password" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••"
                className="input-ring"
              />
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            <Captcha ref={captchaRef} onValueChange={setCaptchaValue} />

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-200">Create one free →</Link>
          </p>
        </div>
        <p className="text-center text-xs text-slate-400 mt-5">You can also scan and search products without an account.</p>
      </div>
    </div>
  );
}
