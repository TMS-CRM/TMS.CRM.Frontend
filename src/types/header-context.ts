import type { ReactNode } from 'react';

export interface HeaderContextType {
  // title: string;
  // setTitle: (title: string) => void;
  // modalType: HeaderModalType;
  // buttonTitle: string;
  // setButtonTitle: (buttonTitle: string) => void;
  // setModalType: (type: HeaderModalType) => void;
  // onOpenModalClick: () => void;
  // isModalOpen: boolean;
  // onModalClose: (refresh: boolean) => void;
  // setOnModalClose: (onClose: (refresh: boolean) => void) => void;

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
