import type { ReactNode } from 'react';

export interface HeaderContextType {
  title: string;
  setTitle: (title: string) => void;
  button: ReactNode;
  setButton: (button: ReactNode) => void;
}

export enum HeaderModalType {
  generalAddNew,
  newDeal,
  newCustomer,
  newTask,
  newUser,
}
