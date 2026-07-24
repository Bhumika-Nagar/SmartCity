import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form);
      navigate(user.role === ROLES.ADMIN ? '/admin/dashboard' : '/dashboard');
    } catch {
      // error already surfaced via context
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-widest text-signal">Citizen login</span>
      <h1 className="font-display font-bold text-3xl text-ink mt-2">Welcome back</h1>
      <p className="text-inkmuted mt-2 mb-8">Log in to track your complaints.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-ink">Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2.5 rounded-ticket border border-line bg-panel focus:border-signal outline-none transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2.5 rounded-ticket border border-line bg-panel focus:border-signal outline-none transition-colors"
          />
        </label>

        {error && <p className="text-sm text-urgent font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-signal text-white font-semibold hover:bg-signal-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="text-sm text-inkmuted mt-6 text-center">
        New here?{' '}
        <Link to="/register" className="text-signal font-medium">Create an account</Link>
      </p>
      <p className="text-sm text-inkmuted mt-2 text-center">
        Department admin?{' '}
        <Link to="/admin/login" className="text-signal font-medium">Admin login</Link>
      </p>

      {import.meta.env.VITE_USE_MOCK !== 'false' && (
        <p className="text-xs text-inkmuted mt-8 font-mono bg-panel border border-line rounded-ticket px-4 py-3">
          Demo mode — try asha@example.com / password123
        </p>
      )}
    </div>
  );
}
