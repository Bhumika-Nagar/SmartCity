import axiosClient from './axiosClient';
import { USE_MOCK } from '../utils/constants';
import { mockGetAdminComplaints, mockUpdateComplaintStatus } from '../mock/mockServer';

export async function getAdminComplaints({ department }) {
  if (USE_MOCK) return mockGetAdminComplaints({ department });
  const { data } = await axiosClient.get('/api/admin/complaints');
  return data;
}

export async function updateComplaintStatus(id, { status, resolutionNotes }) {
  if (USE_MOCK) return mockUpdateComplaintStatus(id, { status, resolutionNotes });
  const { data } = await axiosClient.patch(`/api/admin/complaints/${id}/status`, { status, resolutionNotes });
  return data;
}
