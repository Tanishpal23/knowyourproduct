import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setError(''); setLoading(true);
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password });
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1 className="page-title">Create your account</h1>
          <p className="page-subtitle mx-auto">Free forever · No credit card needed</p>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
          {error && <div className="mb-5 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
              { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.key}>
                <label htmlFor={`signup-${f.key}`} className="block text-sm font-semibold text-slate-700 mb-2">{f.label}</label>
                <input id={`signup-${f.key}`} type={f.type} required value={form[f.key]} placeholder={f.placeholder}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                  className="input-ring"
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-200">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
