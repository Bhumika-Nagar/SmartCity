import axiosClient from './axiosClient';
import { USE_MOCK } from '../utils/constants';
import { mockRegister, mockLogin } from '../mock/mockServer';

export async function registerUser(payload) {
  if (USE_MOCK) return mockRegister(payload);
  const { data } = await axiosClient.post('/api/auth/register', payload);
  return data; // { token, user }
}

export async function loginUser(payload) {
  if (USE_MOCK) return mockLogin(payload);
  const { data } = await axiosClient.post('/api/auth/login', payload);
  return data; // { token, user }
}
