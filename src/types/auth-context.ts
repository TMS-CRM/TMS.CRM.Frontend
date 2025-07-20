import type { User } from './user';

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

export interface AuthContextType {
  user: User | null;
  tenantUuid: string | null;
  signIn: (credentials: Credentials) => Promise<{ success: boolean; session?: string }>;
  definePassword: (data: DefinePasswordData) => Promise<boolean>;
  signOut: () => Promise<void>;
  switchTenant: (tenantUuid: SwitchTenant) => Promise<void>;
}

export interface JwtPayload {
  userUuid: string;
  tenantUuid: string;
  firstName: string;
  lastName: string;
  email: string;
  exp: number;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface DefinePasswordData extends Credentials {
  session: string;
}

export interface SwitchTenant {
  tenantUuid: string;
}
