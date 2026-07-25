# CivicSignal — Smart City Complaint Management (Frontend)

React + Vite + Tailwind frontend for the AI-powered Smart City Complaint
Management System, covering both the **Citizen** and **Department Admin**
sides described in the project spec.

## Design direction

"Municipal Signal" — the visual language of street signage, transit maps,
and physical work-order tickets. Complaints render as perforated-edge
tickets; status history renders as a transit-line diagram (Pending → In
Progress → Resolved) rather than a generic progress bar.

## Quick start (runs standalone, no backend needed yet)

```bash
npm install
npm run dev
```

The app ships in **mock mode** by default (`VITE_USE_MOCK=true`), backed by
an in-browser store (`src/mock/mockServer.js`) that persists to
`localStorage` and simulates Socket.io events with a tiny event bus. This
means you can click through the entire citizen + admin flow — including
live status-update pushes — before the real Node/Express/Socket.io/AI
backend exists.

Demo accounts (see `src/mock/mockData.js`):
- Citizen: `asha@example.com` / `password123`
- Electricity dept admin: `admin.electricity@city.gov` / `password123`
- Sanitation dept admin: `admin.sanitation@city.gov` / `password123`

Try it end to end: log in as the citizen and open a complaint detail page,
then in another browser tab log in as the matching department admin and
change its status — the citizen tab updates instantly without a refresh.

## Switching to the real backend

1. Copy `.env.example` to `.env`.
2. Set `VITE_USE_MOCK=false`.
3. Set `VITE_API_BASE_URL` and `VITE_SOCKET_URL` to your Express server.

Every API call already targets the exact contract from the spec
(`src/api/*.js`), and `SocketContext` switches from the mock event bus to a
real `socket.io-client` connection automatically:

```
POST /api/auth/register
POST /api/auth/login
POST /api/complaints
GET  /api/complaints
GET  /api/complaints/:id
GET  /api/admin/complaints
PATCH /api/admin/complaints/:id/status
```

Socket events expected from the server:
- `complaint:new` → pushed to the relevant department admin
- `complaint:statusUpdated` → pushed to the citizen who filed it

## Structure

```
src/
  api/            axios calls (auth, complaints, admin) — mock/real switch
  mock/           in-browser mock backend + AI classifier stub + seed data
  context/        AuthContext, SocketContext, NotificationContext
  components/     Navbar, route guards, badges, ticket card, timeline, map picker
  pages/          Landing, Register, Login, Dashboard, NewComplaint,
                  ComplaintList, ComplaintDetail, Profile, NotFound
  pages/admin/    AdminLogin, AdminDashboard, AdminComplaintManager
```

## Notes

- `src/mock/aiClassifier.js` is a keyword-based stand-in for the real
  Python (FastAPI/Flask) NLP classification service — swap the function
  body for an HTTP call to that service once it's live.
- Image uploads submit as `multipart/form-data` when talking to a real
  backend; in mock mode the file is kept as an object URL only.
- Map picking uses Leaflet + OpenStreetMap tiles (no API key required).
