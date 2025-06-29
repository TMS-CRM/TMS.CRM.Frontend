/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { AxiosError } from 'axios';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../types/auth-context';

export const api: AxiosInstance = axios.create({
  baseURL: 'https://dev.api.tms-crm.com',
});

// Interceptor for REQUESTS
api.interceptors.request.use((config) => {
  const token = Cookies.get(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type ExtendedRequestConfig = AxiosRequestConfig & { _retry?: boolean };

// Interceptor for RESPONSES
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as unknown as ExtendedRequestConfig;
    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

    const shouldTryRefreshingToken = error.response?.status === 401 && !originalRequest._retry && refreshToken;

    if (!shouldTryRefreshingToken) {
      return Promise.reject(error as Error);
    }

    // In the original request, set a flag to indicate that the request is being retried
    // This prevents infinite loops in case the refresh token also fails
    originalRequest._retry = true;

    try {
      // Make a request to refresh tokens
      const res = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, null, {
        headers: {
          'refresh-token': refreshToken,
        },
      });

      // Read the response of the refresh token request
      const { accessToken } = res.data.data;

      // Set the new access token (from the response) in cookies
      Cookies.set(ACCESS_TOKEN_KEY, accessToken as string, {
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
      });

      // Update the original request with the new access token
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // Retry the original request
      return api(originalRequest);
    } catch {
      // If any error occurs during the refresh token process, we can log out the user
      console.error('Refresh token failed, logging out user.');

      // Clear the cookies
      Cookies.remove(ACCESS_TOKEN_KEY);
      Cookies.remove(REFRESH_TOKEN_KEY);

      // Redirect to sign-in page
      window.location.href = '/sign-in';

      return Promise.reject(error as Error);
    }
  },
);
