import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { ticketId, timeAgo } from '../utils/helpers';

export default function ComplaintTicket({ complaint, to }) {
  return (
    <Link
      to={to}
      className="ticket group block px-6 py-5 hover:border-signal transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="ticket-stamp text-inkmuted">{ticketId(complaint._id)}</span>
            <span className="text-inkmuted text-xs">·</span>
            <span className="font-mono text-xs text-inkmuted">{complaint.department}</span>
          </div>
          <p className="text-ink font-medium leading-snug line-clamp-2 pr-4">
            {complaint.description}
          </p>
          <p className="text-xs text-inkmuted mt-2 font-mono">
            {complaint.location?.address || 'Location pinned'} · filed {timeAgo(complaint.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>
    </Link>
  );
}
