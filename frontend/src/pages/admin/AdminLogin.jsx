import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

export default function AdminLogin() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form, { requireRole: ROLES.ADMIN });
      navigate('/admin/dashboard');
    } catch {
      // error already surfaced via context
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-widest text-signal">Department admin</span>
      <h1 className="font-display font-bold text-3xl text-ink mt-2">Admin login</h1>
      <p className="text-inkmuted mt-2 mb-8">Access complaints assigned to your department.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-ink">Work email</span>
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
          className="w-full py-3 rounded-full bg-ink text-white font-semibold hover:bg-signal-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Log in to department'}
        </button>
      </form>

      <p className="text-sm text-inkmuted mt-6 text-center">
        Citizen instead?{' '}
        <Link to="/login" className="text-signal font-medium">Citizen login</Link>
      </p>

      {import.meta.env.VITE_USE_MOCK !== 'false' && (
        <p className="text-xs text-inkmuted mt-8 font-mono bg-panel border border-line rounded-ticket px-4 py-3">
          Demo mode — try admin.electricity@city.gov / password123
        </p>
      )}
    </div>
  );
}
