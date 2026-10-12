import axios from 'axios';

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_AUTH_BASE_URL}/api/v1`,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});