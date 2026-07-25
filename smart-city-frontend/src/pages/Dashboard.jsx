import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useSocket } from '../context/SocketContext';
import { getComplaints } from '../api/complaints';
import ComplaintTicket from '../components/ComplaintTicket';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { STATUS } from '../utils/constants';

export default function Dashboard() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { subscribe, events } = useSocket();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getComplaints({ userId: user._id });
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(events.STATUS_UPDATED, (updated) => {
      setComplaints((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    });
    return unsubscribe;
  }, [subscribe, events]);

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === STATUS.RESOLVED).length;
  const inProgress = complaints.filter((c) => c.status === STATUS.IN_PROGRESS).length;
  const pending = complaints.filter((c) => c.status === STATUS.PENDING).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-signal">Citizen dashboard</span>
          <h1 className="font-display font-bold text-3xl text-ink mt-1">Welcome back, {user.name.split(' ')[0]}</h1>
        </div>
        <Link to="/complaints/new" className="px-5 py-2.5 rounded-full bg-signal text-white font-semibold hover:bg-signal-dark transition-colors">
          + Create complaint
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total complaints" value={total} />
        <StatCard label="Pending" value={pending} accent="text-pending" />
        <StatCard label="In progress" value={inProgress} accent="text-progress" />
        <StatCard label="Resolved" value={resolved} accent="text-resolved" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-xl text-ink">Recent complaints</h2>
        <Link to="/complaints" className="text-sm font-medium text-signal">View all →</Link>
      </div>

      {loading ? (
        <Loader label="Loading your complaints" />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No complaints yet"
          description="Report your first issue and the AI classifier will route it to the right department automatically."
          action={
            <Link to="/complaints/new" className="px-5 py-2.5 rounded-full bg-signal text-white font-semibold">
              Create complaint
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {complaints.slice(0, 5).map((c) => (
            <ComplaintTicket key={c._id} complaint={c} to={`/complaints/${c._id}`} />
          ))}
        </div>
      )}

      <p className="text-xs text-inkmuted font-mono mt-8">
        {unreadCount} unread notification{unreadCount === 1 ? '' : 's'} — check the bell icon in the top bar.
      </p>
    </div>
  );
}

function StatCard({ label, value, accent = 'text-ink' }) {
  return (
    <div className="bg-panel border border-line rounded-ticket px-5 py-4">
      <p className="text-xs font-mono uppercase tracking-wide text-inkmuted">{label}</p>
      <p className={`font-display font-bold text-3xl mt-1 ${accent}`}>{value}</p>
    </div>
  );
}
