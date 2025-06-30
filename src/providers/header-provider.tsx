import React, { type ReactNode, useState } from 'react';
import { HeaderContext } from '../context/header-context';

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState('Dashboard');
  const [button, setButton] = useState<ReactNode>(<></>);

  return (
    <HeaderContext.Provider
      value={{
        title,
        setTitle,
        button,
        setButton,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};
