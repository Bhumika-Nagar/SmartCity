import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-signal">404</span>
      <h1 className="font-display font-bold text-3xl text-ink mt-2">Page not found</h1>
      <p className="text-inkmuted mt-2 mb-8">This ticket doesn't exist, or it's been moved.</p>
      <Link to="/" className="px-5 py-2.5 rounded-full bg-signal text-white font-semibold">Back home</Link>
    </div>
  );
}
