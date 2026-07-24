import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone });
  const [prefs, setPrefs] = useState({ email: true, sms: false, statusChanges: true });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, ...form };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <span className="font-mono text-xs uppercase tracking-widest text-signal">Profile</span>
      <h1 className="font-display font-bold text-3xl text-ink mt-1 mb-8">Your account</h1>

      <form onSubmit={handleSave} className="space-y-4 bg-panel border border-line rounded-ticket p-6">
        <label className="block">
          <span className="text-sm font-medium text-ink">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2.5 rounded-ticket border border-line bg-concrete focus:border-signal outline-none transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Phone</span>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2.5 rounded-ticket border border-line bg-concrete focus:border-signal outline-none transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Email</span>
          <input
            value={user.email}
            disabled
            className="mt-1 w-full px-4 py-2.5 rounded-ticket border border-line bg-line/30 text-inkmuted"
          />
        </label>

        <button type="submit" className="px-5 py-2.5 rounded-full bg-signal text-white font-semibold hover:bg-signal-dark transition-colors">
          Save changes
        </button>
        {saved && <span className="text-sm text-resolved font-medium ml-3">Saved</span>}
      </form>

      <h2 className="font-display font-semibold text-xl text-ink mt-10 mb-4">Notification preferences</h2>
      <div className="bg-panel border border-line rounded-ticket divide-y divide-line">
        <PrefRow label="Email me about complaint updates" checked={prefs.email} onChange={() => togglePref('email')} />
        <PrefRow label="Text me about complaint updates" checked={prefs.sms} onChange={() => togglePref('sms')} />
        <PrefRow label="Notify me on every status change" checked={prefs.statusChanges} onChange={() => togglePref('statusChanges')} />
      </div>
    </div>
  );
}

function PrefRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between px-5 py-4 cursor-pointer">
      <span className="text-sm text-ink">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 accent-signal" />
    </label>
  );
}
