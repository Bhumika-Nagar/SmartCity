import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getComplaintById } from '../api/complaints';
import { useSocket } from '../context/SocketContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import StatusTimeline from '../components/StatusTimeline';
import Loader from '../components/Loader';
import { ticketId, formatDate } from '../utils/helpers';

export default function ComplaintDetail() {
  const { id } = useParams();
  const { subscribe, events, connected } = useSocket();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getComplaintById(id);
      setComplaint(data);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    const unsubscribe = subscribe(events.STATUS_UPDATED, (updated) => {
      if (updated._id !== id) return;
      setComplaint(updated);
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 3000);
    });
    return unsubscribe;
  }, [id, subscribe, events]);

  if (loading) return <Loader label="Loading complaint" />;
  if (!complaint) return <p className="text-center py-16 text-inkmuted">Complaint not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/complaints" className="text-sm text-signal font-medium">← Back to complaints</Link>

      <div className="ticket px-8 py-8 mt-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <span className="ticket-stamp text-inkmuted">{ticketId(complaint._id)}</span>
            <h1 className="font-display font-bold text-2xl text-ink mt-1">{complaint.department}</h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
        </div>

        {justUpdated && (
          <div className="mt-4 text-xs font-mono px-3 py-2 rounded-ticket bg-signal-light text-signal-dark inline-block">
            ● live update received via socket
          </div>
        )}

        <p className="text-ink mt-6 leading-relaxed">{complaint.description}</p>

        {complaint.image && (
          <img src={complaint.image} alt="Complaint evidence" className="mt-4 rounded-ticket border border-line max-h-72 w-full object-cover" />
        )}

        <div className="grid sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-dashed border-line">
          <div>
            <p className="text-xs font-mono uppercase tracking-wide text-inkmuted">Location</p>
            <p className="text-sm text-ink mt-1">
              {complaint.location?.address || `${complaint.location?.lat?.toFixed(4)}, ${complaint.location?.lng?.toFixed(4)}`}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wide text-inkmuted">Filed</p>
            <p className="text-sm text-ink mt-1">{formatDate(complaint.createdAt)}</p>
          </div>
        </div>

        {complaint.resolutionNotes && (
          <div className="mt-6 pt-6 border-t border-dashed border-line">
            <p className="text-xs font-mono uppercase tracking-wide text-inkmuted">Resolution notes</p>
            <p className="text-sm text-ink mt-1">{complaint.resolutionNotes}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-dashed border-line">
          <p className="text-xs font-mono uppercase tracking-wide text-inkmuted mb-2">Status timeline</p>
          <StatusTimeline status={complaint.status} timeline={complaint.timeline} />
        </div>
      </div>

      <p className="text-xs font-mono text-inkmuted mt-4 text-center">
        {connected ? 'Connected — status changes appear here instantly.' : 'Reconnecting…'}
      </p>
    </div>
  );
}
