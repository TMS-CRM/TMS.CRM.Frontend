/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { AuthContext } from '../context/auth-context';
import { api } from '../services/api';
import type { ApiResponseBody } from '../types/api-responses/response-body';
import {
  ACCESS_TOKEN_KEY,
  type Credentials,
  type DefinePasswordData,
  type JwtPayload,
  REFRESH_TOKEN_KEY,
  type SwitchTenant,
  type User,
} from '../types/auth-context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (token) {
      decodeAndSetUser(token);
    } else {
      // router.push('/sign-in');
    }
  }, []);

  async function signIn(credentials: Credentials): Promise<{ success: boolean; session?: string }> {
    try {
      const res = await api.post<Credentials, AxiosResponse<ApiResponseBody<{ accessToken: string; refreshToken: string }>>>(
        '/auth/sign-in',
        credentials,
      );

      const { accessToken, refreshToken } = res.data.data;

      setTokens(accessToken, refreshToken);
      decodeAndSetUser(accessToken);

      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403 && error.response?.data?.message === 'New password required') {
        return { success: false, session: error.response.data.data.session };
      }

      return { success: false };
    }
  }

  async function definePassword(data: DefinePasswordData): Promise<boolean> {
    try {
      const res = await api.post('/auth/define-password', data);
      const { accessToken, refreshToken } = res.data.data;

      setTokens(accessToken, refreshToken);
      decodeAndSetUser(accessToken);
      return true;
    } catch {
      return false;
    }
  }

  async function signOut(): Promise<void> {
    try {
      await api.post('/auth/sign-out');
    } catch (error) {
      console.error('Error during sign out:', error);
    }

    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    setUser(null);
    // router.push('/sign-in');
  }

  async function switchTenant(tenantUuid: SwitchTenant): Promise<boolean> {
    try {
      const res = await api.post('/auth/switch-tenant', tenantUuid);

      const { accessToken } = res.data.data;

      Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/',
      });

      decodeAndSetUser(accessToken);

      return true;
    } catch (error) {
      console.error('Erro ao trocar de tenant:', error);
      return false;
    }
  }

  function setTokens(accessToken: string, refreshToken: string): void {
    const options = {
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict' as const,
      path: '/',
    };

    Cookies.set(ACCESS_TOKEN_KEY, accessToken, options);
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, options);
  }

  function decodeAndSetUser(token: string): void {
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);

      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      });
    } catch (error) {
      console.error('Invalid JWT token:', error);
      setUser(null);
    }
  }

  return <AuthContext.Provider value={{ user, signIn, definePassword, signOut, switchTenant }}>{children}</AuthContext.Provider>;
};
