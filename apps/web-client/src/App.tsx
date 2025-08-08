import Header from "./layouts/header";
import Sidebar from "./layouts/sidebar";
import { HeaderProvider } from "./contexts/HeaderContext";
import { AppStateProvider, useAppState } from "./contexts/AppStateContext";
import ChatPage from "./pages/ChatPage";
import LorebookPage from "./pages/LorebookPage";
import PromptsPage from "./pages/PromptsPage";
import SettingsPage from "./pages/SettingsPage";

const AppContent = () => {
  const { currentTab } = useAppState();

  const renderContent = () => {
    switch (currentTab) {
      case 'chat':
        return <ChatPage />;
      case 'lorebook':
        return <LorebookPage />;
      case 'prompts':
        return <PromptsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ChatPage />;
    }
  };

  return (
    <div className="w-full h-100dvh flex">
      <Sidebar />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-out">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppStateProvider>
      <HeaderProvider>
        <AppContent />
      </HeaderProvider>
    </AppStateProvider>
  );
}

export default App;
