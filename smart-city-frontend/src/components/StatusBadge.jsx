import { STATUS_STYLES } from '../utils/constants';
import { classNames } from '../utils/helpers';

export default function StatusBadge({ status }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-display uppercase tracking-wide',
        STATUS_STYLES[status]
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
