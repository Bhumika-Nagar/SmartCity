import axiosClient from './axiosClient';
import { USE_MOCK } from '../utils/constants';
import { mockCreateComplaint, mockGetComplaints, mockGetComplaintById, mockGetNotifications } from '../mock/mockServer';

export async function createComplaint({ userId, description, image, location, category }) {
  if (USE_MOCK) return mockCreateComplaint({ userId, description, image, location, category });

  // Real backend: multipart/form-data because an image file may be attached.
  const form = new FormData();
  form.append('description', description);
  form.append('location', JSON.stringify(location));
  if (category) form.append('category', category);
  if (image) form.append('image', image);

  const { data } = await axiosClient.post('/api/complaints', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getComplaints({ userId }) {
  if (USE_MOCK) return mockGetComplaints({ userId });
  const { data } = await axiosClient.get('/api/complaints');
  return data;
}

export async function getComplaintById(id) {
  if (USE_MOCK) return mockGetComplaintById(id);
  const { data } = await axiosClient.get(`/api/complaints/${id}`);
  return data;
}

export async function getNotifications({ userId }) {
  if (USE_MOCK) return mockGetNotifications({ userId });
  const { data } = await axiosClient.get('/api/notifications');
  return data;
}
