export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const ROLES = {
  CITIZEN: 'citizen',
  ADMIN: 'admin',
};

export const STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
};

export const STATUS_ORDER = [STATUS.PENDING, STATUS.IN_PROGRESS, STATUS.RESOLVED];

export const PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const DEPARTMENTS = [
  'Sanitation',
  'Electricity',
  'Water',
  'Roads',
  'Public Safety',
  'Parks & Environment',
];

export const STATUS_STYLES = {
  [STATUS.PENDING]: 'text-pending bg-pending-bg',
  [STATUS.IN_PROGRESS]: 'text-progress bg-progress-bg',
  [STATUS.RESOLVED]: 'text-resolved bg-resolved-bg',
};

export const PRIORITY_STYLES = {
  [PRIORITY.LOW]: 'text-inkmuted bg-line/40',
  [PRIORITY.MEDIUM]: 'text-pending bg-pending-bg',
  [PRIORITY.HIGH]: 'text-urgent bg-urgent-bg',
};

export const SOCKET_EVENTS = {
  NEW_COMPLAINT: 'complaint:new',
  STATUS_UPDATED: 'complaint:statusUpdated',
};
