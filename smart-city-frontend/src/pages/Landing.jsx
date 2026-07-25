import { Link } from 'react-router-dom';

const STEPS = [
  {
    n: '01',
    title: 'Report it',
    body: 'Describe the problem, drop a pin on the map, attach a photo. Takes under a minute.',
  },
  {
    n: '02',
    title: 'AI routes it',
    body: 'The classifier reads the description, assigns the right department, and sets a priority.',
  },
  {
    n: '03',
    title: 'Watch it move',
    body: 'Pending → In Progress → Resolved, pushed to your screen the instant the department acts.',
  },
];

const DEPARTMENTS = ['Sanitation', 'Electricity', 'Water', 'Roads', 'Public Safety', 'Parks & Environment'];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-signal">Municipal complaint routing, automated</span>
            <h1 className="font-display font-extrabold text-5xl md:text-6xl leading-[1.05] text-ink mt-4">
              Every pothole,
              <br />
              wire, and pile of
              <br />
              garbage — <span className="text-signal">tracked.</span>
            </h1>
            <p className="text-inkmuted text-lg mt-6 max-w-md">
              File a complaint in plain language. An AI classifier assigns the department
              and priority instantly, and you watch the status change live — no refreshing,
              no phone calls.
            </p>
            <div className="flex items-center gap-3 mt-8">
              <Link to="/register" className="px-6 py-3 rounded-full bg-signal text-white font-semibold hover:bg-signal-dark transition-colors">
                Report a problem
              </Link>
              <Link to="/admin/login" className="px-6 py-3 rounded-full border border-line font-semibold hover:border-signal transition-colors">
                Department login
              </Link>
            </div>
          </div>

          {/* Signature element: a live-looking work-order ticket, matching the app's core artifact */}
          <div className="ticket px-6 py-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="ticket-stamp text-inkmuted">CMP-001002</span>
              <span className="font-mono text-xs px-2 py-1 rounded-full bg-urgent-bg text-urgent uppercase tracking-wide">High priority</span>
            </div>
            <p className="text-ink font-medium mt-4 leading-snug">
              "There is an electric wire hanging broken near the bus stop on MG Road."
            </p>
            <div className="mt-5 pt-5 border-t border-dashed border-line">
              <div className="transit-line">
                <div className="transit-stop is-done">
                  <p className="font-display font-semibold text-sm uppercase tracking-wide">Pending</p>
                  <p className="text-xs text-inkmuted font-mono">Filed · routed to Electricity</p>
                </div>
                <div className="transit-stop is-current">
                  <p className="font-display font-semibold text-sm uppercase tracking-wide">In Progress</p>
                  <p className="text-xs text-inkmuted font-mono">Field crew dispatched</p>
                </div>
                <div className="transit-stop">
                  <p className="font-display font-semibold text-sm uppercase tracking-wide text-inkmuted">Resolved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-panel border-y border-line">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-display font-bold text-3xl text-ink mb-2">How a report moves through the system</h2>
          <p className="text-inkmuted mb-10 max-w-lg">Three steps, and only the last one ever needs a human to check in.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="border-l-2 border-signal pl-5">
                <span className="font-mono text-xs text-signal">{s.n}</span>
                <h3 className="font-display font-semibold text-xl text-ink mt-1">{s.title}</h3>
                <p className="text-inkmuted text-sm mt-2">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display font-bold text-3xl text-ink mb-2">Every department, one intake line</h2>
        <p className="text-inkmuted mb-10 max-w-lg">Reports are classified and routed automatically — departments only see what's theirs.</p>
        <div className="flex flex-wrap gap-3">
          {DEPARTMENTS.map((d) => (
            <span key={d} className="font-mono text-sm px-4 py-2 rounded-full border border-line bg-panel text-ink">
              {d}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-signal">
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">Something needs fixing near you?</h2>
            <p className="text-signal-light mt-1">Create an account and file your first complaint in under a minute.</p>
          </div>
          <Link to="/register" className="px-6 py-3 rounded-full bg-white text-signal-dark font-semibold hover:bg-concrete transition-colors shrink-0">
            Get started
          </Link>
        </div>
      </section>
    </div>
  );
}
