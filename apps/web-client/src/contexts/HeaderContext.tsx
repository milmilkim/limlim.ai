import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface HeaderConfig {
  title?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  showDrawerButton?: boolean;
}

interface HeaderContextType {
  headerConfig: HeaderConfig;
  setHeaderConfig: (config: HeaderConfig) => void;
  updateHeaderConfig: (updates: Partial<HeaderConfig>) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
    title: '',
    leftContent: null,
    rightContent: null,
    showDrawerButton: true,
  });

  const updateHeaderConfig = (updates: Partial<HeaderConfig>) => {
    setHeaderConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <HeaderContext.Provider value={{ headerConfig, setHeaderConfig, updateHeaderConfig }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}; 