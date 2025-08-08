import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type TabType = 'chat' | 'lorebook' | 'prompts' | 'settings';

interface AppStateContextType {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  isMobileDrawerOpen: boolean;
  toggleMobileDrawer: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('chat');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(!isMobileDrawerOpen);
  };

  return (
    <AppStateContext.Provider value={{ 
      currentTab, 
      setCurrentTab, 
      isSidebarExpanded, 
      toggleSidebar,
      isMobileDrawerOpen,
      toggleMobileDrawer
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}; 