/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { AxiosError } from 'axios';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../types/auth-context';

type ExtendedRequestConfig = AxiosRequestConfig & { _retry?: boolean };

export const api: AxiosInstance = axios.create({
  baseURL: 'https://dev.api.tms-crm.com',
});

let isRefreshingToken = false;
let failedQueue: { resolve: (refreshedAccessToken: string) => void; reject: (reason: Error) => void }[] = [];

// Interceptor for REQUESTS
api.interceptors.request.use((config) => {
  const token = Cookies.get(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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

    if (isRefreshingToken) {
      return queueFailedRequest(originalRequest);
    }

    isRefreshingToken = true;

    // In the original request, set a flag to indicate that the request is being retried
    // This prevents infinite loops in case the refresh token also fails
    originalRequest._retry = true;

    try {
      // Make a request to refresh tokens
      const res = await api.post('/auth/refresh-token', null, {
        headers: {
          authorization: Cookies.get(ACCESS_TOKEN_KEY),
          'refresh-token': refreshToken,
        },
      });

      // Read the response of the refresh token request
      const refreshedAccessToken = res.data?.data?.accessToken as string | undefined | null;
      if (!refreshedAccessToken) {
        throw new Error('Missing access token from refresh response');
      }

      // Set the new access token (from the response) in cookies
      Cookies.set(ACCESS_TOKEN_KEY, refreshedAccessToken, {
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
      });

      // Update the original request with the new access token
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`;

      processQueue(null, refreshedAccessToken);

      // Retry the original request
      return api(originalRequest);
    } catch {
      // Clear the cookies
      Cookies.remove(ACCESS_TOKEN_KEY);
      Cookies.remove(REFRESH_TOKEN_KEY);

      // Complete all pending promises
      failedQueue.forEach((promiseLike) => promiseLike.reject(error));

      // Redirect to sign-in page
      window.location.href = '/sign-in';

      return Promise.reject(error as Error);
    } finally {
      isRefreshingToken = false;
    }
  },
);

function queueFailedRequest(originalRequest: ExtendedRequestConfig): Promise<AxiosResponse> {
  return new Promise<string>((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  }).then((token) => {
    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${token}`;
    return api(originalRequest);
  });
}

function processQueue(error: any, refreshedAccessToken: string): void {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error as Error);
    } else {
      request.resolve(refreshedAccessToken);
    }
  });

  failedQueue = [];
}
