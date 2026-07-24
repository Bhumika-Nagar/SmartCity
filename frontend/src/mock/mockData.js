import { STATUS, PRIORITY, DEPARTMENTS, ROLES } from '../utils/constants';

export const seedUsers = [
  {
    _id: 'u-citizen-1',
    name: 'Asha Verma',
    email: 'asha@example.com',
    phone: '9876543210',
    password: 'password123',
    role: ROLES.CITIZEN,
  },
  {
    _id: 'u-admin-electricity',
    name: 'Electricity Dept Admin',
    email: 'admin.electricity@city.gov',
    phone: '9998887771',
    password: 'password123',
    role: ROLES.ADMIN,
    department: 'Electricity',
  },
  {
    _id: 'u-admin-sanitation',
    name: 'Sanitation Dept Admin',
    email: 'admin.sanitation@city.gov',
    phone: '9998887772',
    password: 'password123',
    role: ROLES.ADMIN,
    department: 'Sanitation',
  },
];

const now = Date.now();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();

export const seedComplaints = [
  {
    _id: 'c-1001',
    userId: 'u-citizen-1',
    description: 'There is garbage piling up near Sector 15 market, hasn\'t been collected in days.',
    image: null,
    location: { lat: 28.6139, lng: 77.209, address: 'Sector 15 Market' },
    department: 'Sanitation',
    priority: PRIORITY.MEDIUM,
    status: STATUS.IN_PROGRESS,
    resolutionNotes: 'Collection crew rerouted, pickup scheduled for tomorrow morning.',
    category: '',
    timeline: [
      { status: STATUS.PENDING, at: hoursAgo(30) },
      { status: STATUS.IN_PROGRESS, at: hoursAgo(6) },
    ],
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(6),
  },
  {
    _id: 'c-1002',
    userId: 'u-citizen-1',
    description: 'A live electric wire is hanging broken near the bus stop on MG Road, very dangerous.',
    image: null,
    location: { lat: 28.6304, lng: 77.2177, address: 'MG Road Bus Stop' },
    department: 'Electricity',
    priority: PRIORITY.HIGH,
    status: STATUS.PENDING,
    resolutionNotes: '',
    category: '',
    timeline: [{ status: STATUS.PENDING, at: hoursAgo(2) }],
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
  },
  {
    _id: 'c-1003',
    userId: 'u-citizen-1',
    description: 'Streetlight outside house number 42, Green Park has been off for a week.',
    image: null,
    location: { lat: 28.5588, lng: 77.2064, address: 'Green Park, House 42' },
    department: 'Electricity',
    priority: PRIORITY.LOW,
    status: STATUS.RESOLVED,
    resolutionNotes: 'Bulb and ballast replaced by field team.',
    category: '',
    timeline: [
      { status: STATUS.PENDING, at: hoursAgo(96) },
      { status: STATUS.IN_PROGRESS, at: hoursAgo(50) },
      { status: STATUS.RESOLVED, at: hoursAgo(20) },
    ],
    createdAt: hoursAgo(96),
    updatedAt: hoursAgo(20),
  },
];

export const seedNotifications = [
  {
    _id: 'n-1',
    userId: 'u-citizen-1',
    message: 'Your complaint CMP-001001 moved to In Progress.',
    isRead: false,
    createdAt: hoursAgo(6),
  },
  {
    _id: 'n-2',
    userId: 'u-citizen-1',
    message: 'Your complaint CMP-001003 was marked Resolved.',
    isRead: true,
    createdAt: hoursAgo(20),
  },
];

export const ALL_DEPARTMENTS = DEPARTMENTS;
