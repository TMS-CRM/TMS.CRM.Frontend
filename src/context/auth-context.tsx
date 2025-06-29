import { createContext } from 'react';
import type { AuthContextType } from '../types/auth-context';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
