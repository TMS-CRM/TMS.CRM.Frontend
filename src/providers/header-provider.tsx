import React, { useState } from 'react';
import { HeaderContext } from '../context/header-context';
import { HeaderModalType } from '../types/header-context';

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState('Dashboard');
  const [buttonTitle, setButtonTitle] = useState<string | undefined>(undefined);
  const [modalType, setModalType] = useState(HeaderModalType.generalAddNew);
  const [isModalOpen, setModalOpen] = useState(false);

  const onOpenModalClick = (): void => {
    setModalOpen(!isModalOpen);
  };

  return (
    <HeaderContext.Provider
      value={{
        title,
        setTitle,
        modalType,
        setModalType,
        onOpenModalClick,
        isModalOpen,
        buttonTitle,
        setButtonTitle,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};
