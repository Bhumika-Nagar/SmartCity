import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getComplaintById } from '../../api/complaints';
import { updateComplaintStatus } from '../../api/admin';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import Loader from '../../components/Loader';
import { ticketId, formatDate } from '../../utils/helpers';
import { STATUS_ORDER } from '../../utils/constants';

export default function AdminComplaintManager() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getComplaintById(id);
      setComplaint(data);
      setStatus(data.status);
      setNotes(data.resolutionNotes || '');
      setLoading(false);
    })();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateComplaintStatus(id, { status, resolutionNotes: notes });
      setComplaint(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading complaint" />;
  if (!complaint) return <p className="text-center py-16 text-inkmuted">Complaint not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/admin/dashboard" className="text-sm text-signal font-medium">← Back to queue</Link>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="ticket px-6 py-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="ticket-stamp text-inkmuted">{ticketId(complaint._id)}</span>
              <h1 className="font-display font-bold text-xl text-ink mt-1">{complaint.department}</h1>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>

          <p className="text-ink mt-5 leading-relaxed">{complaint.description}</p>

          {complaint.image && (
            <img src={complaint.image} alt="Citizen submitted evidence" className="mt-4 rounded-ticket border border-line max-h-56 w-full object-cover" />
          )}

          <div className="mt-5 pt-5 border-t border-dashed border-line space-y-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-wide text-inkmuted">Location</p>
              <p className="text-sm text-ink mt-1">
                {complaint.location?.address || `${complaint.location?.lat?.toFixed(4)}, ${complaint.location?.lng?.toFixed(4)}`}
              </p>
              {complaint.location?.lat && (
                <a
                  className="text-xs text-signal font-medium"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://www.openstreetmap.org/?mlat=${complaint.location.lat}&mlon=${complaint.location.lng}#map=16/${complaint.location.lat}/${complaint.location.lng}`}
                >
                  Open in map ↗
                </a>
              )}
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wide text-inkmuted">Filed</p>
              <p className="text-sm text-ink mt-1">{formatDate(complaint.createdAt)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-panel border border-line rounded-ticket px-6 py-6 h-fit space-y-5">
          <h2 className="font-display font-semibold text-lg text-ink">Update status</h2>

          <label className="block">
            <span className="text-sm font-medium text-ink">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full px-4 py-2.5 rounded-ticket border border-line bg-concrete focus:border-signal outline-none transition-colors"
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Resolution notes</span>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did your team do about this?"
              className="mt-1 w-full px-4 py-2.5 rounded-ticket border border-line bg-concrete focus:border-signal outline-none transition-colors resize-none"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-full bg-signal text-white font-semibold hover:bg-signal-dark transition-colors disabled:opacity-60"
          >
            {saving ? 'Pushing update…' : 'Save & notify citizen'}
          </button>
          {saved && (
            <p className="text-xs text-resolved font-mono text-center">
              ● pushed to citizen via socket.io
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
