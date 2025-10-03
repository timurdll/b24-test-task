import { ReactNode } from 'react';

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  // Здесь будет инициализация глобальных stores если понадобится
  return <>{children}</>;
};

