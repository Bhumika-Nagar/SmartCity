import { PRIORITY_STYLES } from '../utils/constants';
import { classNames } from '../utils/helpers';

export default function PriorityBadge({ priority }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-mono uppercase tracking-wide',
        PRIORITY_STYLES[priority]
      )}
    >
      {priority} priority
    </span>
  );
}
