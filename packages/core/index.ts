import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

export type { AxiosInstance, AxiosResponse };

export const createApiClient = (baseURL: string): AxiosInstance => {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}; 