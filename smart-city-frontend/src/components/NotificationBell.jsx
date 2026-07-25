import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { timeAgo, classNames } from '../utils/helpers';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) markAllRead();
        }}
        aria-label="Notifications"
        className="relative w-9 h-9 flex items-center justify-center rounded-full border border-line bg-panel hover:border-signal transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-urgent text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-panel border border-line rounded-ticket shadow-lg z-20">
          <div className="px-4 py-3 border-b border-line">
            <p className="font-display font-semibold text-sm">Notifications</p>
          </div>
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-inkmuted text-center">Nothing yet — updates on your complaints show up here.</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={classNames('px-4 py-3 border-b border-line last:border-0 text-sm', !n.isRead && 'bg-signal-light/40')}
                >
                  <p className="text-ink">{n.message}</p>
                  <p className="text-xs text-inkmuted font-mono mt-1">{timeAgo(n.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
