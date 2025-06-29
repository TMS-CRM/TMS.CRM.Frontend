import { createContext } from 'react';
import type { HeaderContextType } from '../types/header-context';

export const HeaderContext = createContext<HeaderContextType | undefined>(undefined);
