import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch {
      // error already surfaced via context
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-widest text-signal">Citizen account</span>
      <h1 className="font-display font-bold text-3xl text-ink mt-2">Create your account</h1>
      <p className="text-inkmuted mt-2 mb-8">File complaints and track them in real time.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full name" name="name" value={form.name} onChange={handleChange} required />
        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
        <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />

        {error && <p className="text-sm text-urgent font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-signal text-white font-semibold hover:bg-signal-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-inkmuted mt-6 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-signal font-medium">Log in</Link>
      </p>
    </div>
  );
}

function Field({ label, name, type = 'text', ...rest }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        name={name}
        type={type}
        className="mt-1 w-full px-4 py-2.5 rounded-ticket border border-line bg-panel focus:border-signal outline-none transition-colors"
        {...rest}
      />
    </label>
  );
}
