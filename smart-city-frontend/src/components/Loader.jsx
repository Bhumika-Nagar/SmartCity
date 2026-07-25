export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-inkmuted">
      <span className="w-4 h-4 rounded-full border-2 border-line border-t-signal animate-spin" />
      <span className="font-mono text-sm">{label}…</span>
    </div>
  );
}
