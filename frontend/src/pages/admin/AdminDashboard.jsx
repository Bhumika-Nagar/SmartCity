import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getAdminComplaints } from '../../api/admin';
import ComplaintTicket from '../../components/ComplaintTicket';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { STATUS, PRIORITY } from '../../utils/constants';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { subscribe, events } = useSocket();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await getAdminComplaints({ department: user.department });
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubNew = subscribe(events.NEW_COMPLAINT, (complaint) => {
      if (complaint.department !== user.department) return;
      setComplaints((prev) => [complaint, ...prev]);
      setToast(`New complaint filed: ${complaint.description.slice(0, 60)}…`);
      setTimeout(() => setToast(null), 4000);
    });
    const unsubUpdate = subscribe(events.STATUS_UPDATED, (updated) => {
      setComplaints((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    });
    return () => {
      unsubNew();
      unsubUpdate();
    };
  }, [subscribe, events, user.department]);

  const pending = complaints.filter((c) => c.status === STATUS.PENDING).length;
  const inProgress = complaints.filter((c) => c.status === STATUS.IN_PROGRESS).length;
  const resolved = complaints.filter((c) => c.status === STATUS.RESOLVED).length;

  const priorityQueue = useMemo(
    () =>
      complaints
        .filter((c) => c.status !== STATUS.RESOLVED)
        .sort((a, b) => {
          const rank = { [PRIORITY.HIGH]: 0, [PRIORITY.MEDIUM]: 1, [PRIORITY.LOW]: 2 };
          return rank[a.priority] - rank[b.priority];
        }),
    [complaints]
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-signal">{user.department} department</span>
        <h1 className="font-display font-bold text-3xl text-ink mt-1">Complaint queue</h1>
      </div>

      {toast && (
        <div className="mb-6 px-4 py-3 rounded-ticket bg-signal-light text-signal-dark text-sm font-medium">
          ● {toast}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Pending" value={pending} accent="text-pending" />
        <StatCard label="In progress" value={inProgress} accent="text-progress" />
        <StatCard label="Resolved" value={resolved} accent="text-resolved" />
      </div>

      <h2 className="font-display font-semibold text-xl text-ink mb-4">Priority queue</h2>
      {loading ? (
        <Loader label="Loading department complaints" />
      ) : priorityQueue.length === 0 ? (
        <EmptyState title="Queue is clear" description="No open complaints for your department right now." />
      ) : (
        <div className="space-y-3">
          {priorityQueue.map((c) => (
            <ComplaintTicket key={c._id} complaint={c} to={`/admin/complaints/${c._id}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-panel border border-line rounded-ticket px-5 py-4">
      <p className="text-xs font-mono uppercase tracking-wide text-inkmuted">{label}</p>
      <p className={`font-display font-bold text-3xl mt-1 ${accent}`}>{value}</p>
    </div>
  );
}
