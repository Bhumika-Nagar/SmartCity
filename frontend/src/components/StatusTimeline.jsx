import { STATUS_ORDER } from '../utils/constants';
import { formatDate, classNames } from '../utils/helpers';

export default function StatusTimeline({ status, timeline = [] }) {
  const currentIndex = STATUS_ORDER.indexOf(status);
  const eventFor = (s) => timeline.find((t) => t.status === s);

  return (
    <div className="transit-line">
      {STATUS_ORDER.map((s, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        const event = eventFor(s);
        return (
          <div
            key={s}
            className={classNames('transit-stop', done && 'is-done', current && 'is-current')}
          >
            <p
              className={classNames(
                'font-display font-semibold uppercase tracking-wide text-sm',
                done || current ? 'text-ink' : 'text-inkmuted'
              )}
            >
              {s}
            </p>
            <p className="text-xs text-inkmuted font-mono mt-0.5">
              {event ? formatDate(event.at) : 'awaiting update'}
            </p>
          </div>
        );
      })}
    </div>
  );
}
