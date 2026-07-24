import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getComplaints } from '../api/complaints';
import ComplaintTicket from '../components/ComplaintTicket';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { STATUS } from '../utils/constants';

const FILTERS = ['All', STATUS.PENDING, STATUS.IN_PROGRESS, STATUS.RESOLVED];

export default function ComplaintList() {
  const { user } = useAuth();
  const { subscribe, events } = useSocket();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getComplaints({ userId: user._id });
      setComplaints(data);
      setLoading(false);
    })();
  }, [user._id]);

  useEffect(() => {
    const unsubscribe = subscribe(events.STATUS_UPDATED, (updated) => {
      setComplaints((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    });
    return unsubscribe;
  }, [subscribe, events]);

  const visible = useMemo(() => {
    let list = [...complaints];
    if (filter !== 'All') list = list.filter((c) => c.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.description.toLowerCase().includes(q) || c.department.toLowerCase().includes(q));
    }
    list.sort((a, b) =>
      sort === 'newest' ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)
    );
    return list;
  }, [complaints, filter, search, sort]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <span className="font-mono text-xs uppercase tracking-widest text-signal">Your complaints</span>
      <h1 className="font-display font-bold text-3xl text-ink mt-1 mb-8">All complaints</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by description or department…"
          className="flex-1 px-4 py-2.5 rounded-ticket border border-line bg-panel focus:border-signal outline-none transition-colors"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-ticket border border-line bg-panel focus:border-signal outline-none transition-colors"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === f ? 'bg-ink text-white border-ink' : 'border-line text-inkmuted hover:border-signal'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading complaints" />
      ) : visible.length === 0 ? (
        <EmptyState title="No matching complaints" description="Try a different search term or filter." />
      ) : (
        <div className="space-y-3">
          {visible.map((c) => (
            <ComplaintTicket key={c._id} complaint={c} to={`/complaints/${c._id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
