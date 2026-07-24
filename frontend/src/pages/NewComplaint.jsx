import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createComplaint } from '../api/complaints';
import LocationPicker from '../components/LocationPicker';
import { DEPARTMENTS } from '../utils/constants';

export default function NewComplaint() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please describe the issue.');
      return;
    }
    if (!location) {
      setError('Please drop a pin on the map for the location.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const complaint = await createComplaint({
        userId: user._id,
        description,
        image,
        location,
        category,
      });
      navigate(`/complaints/${complaint._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <span className="font-mono text-xs uppercase tracking-widest text-signal">New complaint</span>
      <h1 className="font-display font-bold text-3xl text-ink mt-1">What's the problem?</h1>
      <p className="text-inkmuted mt-2 mb-8">
        Describe it in your own words — the AI classifier assigns the department and priority automatically.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="text-sm font-medium text-ink">Description</span>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. There is garbage piling up near Sector 15 market."
            className="mt-1 w-full px-4 py-3 rounded-ticket border border-line bg-panel focus:border-signal outline-none transition-colors resize-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink">Photo (optional)</span>
          <input type="file" accept="image/*" onChange={handleImage} className="mt-1 block text-sm text-inkmuted" />
          {imagePreview && (
            <img src={imagePreview} alt="Complaint preview" className="mt-3 rounded-ticket border border-line max-h-48 object-cover" />
          )}
        </label>

        <div>
          <span className="text-sm font-medium text-ink block mb-1">Location</span>
          <LocationPicker value={location} onChange={setLocation} />
        </div>

        <label className="block">
          <span className="text-sm font-medium text-ink">Category (optional — overrides AI department)</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full px-4 py-2.5 rounded-ticket border border-line bg-panel focus:border-signal outline-none transition-colors"
          >
            <option value="">Let AI decide</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        {error && <p className="text-sm text-urgent font-medium">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-full bg-signal text-white font-semibold hover:bg-signal-dark transition-colors disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit complaint'}
        </button>
      </form>
    </div>
  );
}
