export interface HeaderContextType {
  title: string;
  setTitle: (title: string) => void;
  modalType: HeaderModalType;
  buttonTitle?: string;
  setButtonTitle?: (buttonTitle?: string) => void;
  setModalType: (type: HeaderModalType) => void;
  onOpenModalClick: () => void;
  isModalOpen: boolean;
}

export enum HeaderModalType {
  generalAddNew,
  newDeal,
  newCustomer,
  newTask,
  newUser,
}
