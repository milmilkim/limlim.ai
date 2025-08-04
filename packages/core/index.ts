import axios from 'axios';

const isServer = typeof window === 'undefined';

export const apiClient = axios.create({
  baseURL: isServer ? 'http://localhost:3000/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
}); 