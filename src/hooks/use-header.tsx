import { useContext } from 'react';
import { HeaderContext } from '../context/header-context';
import type { HeaderContextType } from '../types/header-context';

export const useHeader = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }

  return context;
};
