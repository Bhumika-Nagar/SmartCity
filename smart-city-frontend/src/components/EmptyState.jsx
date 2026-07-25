export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-line rounded-ticket">
      <p className="font-display font-semibold text-lg text-ink">{title}</p>
      {description && <p className="text-sm text-inkmuted mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
