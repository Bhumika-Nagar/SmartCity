import { seedUsers, seedComplaints, seedNotifications } from './mockData';
import { classifyComplaint } from './aiClassifier';
import { STATUS, ROLES } from '../utils/constants';

const STORAGE_KEY = 'civicsignal-mock-db-v1';
const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  const initial = { users: seedUsers, complaints: seedComplaints, notifications: seedNotifications };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function save(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// --- tiny pub/sub standing in for Socket.io, scoped to this browser tab ---
export const mockBus = new EventTarget();
function emit(event, payload) {
  mockBus.dispatchEvent(new CustomEvent(event, { detail: payload }));
}

function fakeToken(user) {
  return btoa(JSON.stringify({ id: user._id, role: user.role, department: user.department || null }));
}

function sanitize(user) {
  const { password, ...rest } = user;
  return rest;
}

// --- Auth ---
export async function mockRegister({ name, email, phone, password }) {
  await delay();
  const db = load();
  if (db.users.some((u) => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }
  const user = { _id: `u-${Date.now()}`, name, email, phone, password, role: ROLES.CITIZEN };
  db.users.push(user);
  save(db);
  return { token: fakeToken(user), user: sanitize(user) };
}

export async function mockLogin({ email, password }) {
  await delay();
  const db = load();
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password.');
  return { token: fakeToken(user), user: sanitize(user) };
}

// --- Complaints (citizen) ---
export async function mockCreateComplaint({ userId, description, image, location, category }) {
  await delay(500);
  const db = load();
  const { department, priority } = classifyComplaint(description);
  const complaint = {
    _id: `c-${Date.now()}`,
    userId,
    description,
    image: image || null,
    location: location || null,
    department: category || department,
    priority,
    status: STATUS.PENDING,
    resolutionNotes: '',
    category: category || '',
    timeline: [{ status: STATUS.PENDING, at: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.complaints.unshift(complaint);
  save(db);
  emit('complaint:new', complaint);
  return complaint;
}

export async function mockGetComplaints({ userId }) {
  await delay();
  const db = load();
  return db.complaints.filter((c) => c.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function mockGetComplaintById(id) {
  await delay(200);
  const db = load();
  const complaint = db.complaints.find((c) => c._id === id);
  if (!complaint) throw new Error('Complaint not found.');
  return complaint;
}

// --- Admin ---
export async function mockGetAdminComplaints({ department }) {
  await delay();
  const db = load();
  return db.complaints
    .filter((c) => c.department === department)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function mockUpdateComplaintStatus(id, { status, resolutionNotes }) {
  await delay(400);
  const db = load();
  const complaint = db.complaints.find((c) => c._id === id);
  if (!complaint) throw new Error('Complaint not found.');
  complaint.status = status;
  if (resolutionNotes !== undefined) complaint.resolutionNotes = resolutionNotes;
  complaint.updatedAt = new Date().toISOString();
  complaint.timeline.push({ status, at: complaint.updatedAt });
  save(db);

  const note = {
    _id: `n-${Date.now()}`,
    userId: complaint.userId,
    message: `Your complaint ${id} is now ${status}.`,
    isRead: false,
    createdAt: complaint.updatedAt,
  };
  db.notifications.unshift(note);
  save(db);

  emit('complaint:statusUpdated', complaint);
  return complaint;
}

// --- Notifications ---
export async function mockGetNotifications({ userId }) {
  await delay(150);
  const db = load();
  return db.notifications.filter((n) => n.userId === userId);
}
