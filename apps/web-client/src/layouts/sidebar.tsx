import {
  Blocks,
  BookText,
  Bot,
  Drama,
  Settings,
  MessagesSquare,
  CupSoda,
} from "lucide-react";
import { clsx } from "clsx";
import { useAppState } from "../contexts/AppStateContext";
import { useHeader } from "../contexts/HeaderContext";
import type { TabType } from "../contexts/AppStateContext";
import { motion, AnimatePresence } from "framer-motion";

const NavBtn = ({
  children,
  isActive,
  onClick,
  label,
  showLabel = false,
  variant = "icon",
}: {
  children?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  label?: string;
  showLabel?: boolean;
  variant?: "icon" | "block";
}) => {
  const isBlock = variant === "block";
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={clsx(
        "rounded-lg cursor-pointer select-none",
        isBlock
          ? "h-24 w-full p-3 flex flex-col items-center justify-center gap-2 bg-sidebar text-sidebar-foreground"
          : "h-12 w-full px-2 flex items-center",
        !isBlock &&
          (showLabel ? "justify-start gap-3" : "justify-center gap-0"),
        // 활성 상태 스타일
        isActive && !isBlock && "bg-primary text-primary-foreground",
        isActive &&
          isBlock &&
          "bg-sidebar-accent/60 text-primary ring-1 ring-primary/40",
        // 비활성 hover
        !isActive && "hover:text-primary hover:bg-sidebar-accent/70"
      )}
    >
      <div className="shrink-0 h-6 w-6 flex items-center justify-center">
        {children}
      </div>
      {(label ?? null) && (
        <span
          className={clsx(
            "text-sm font-medium overflow-hidden whitespace-nowrap transition-all",
            isBlock
              ? "opacity-100 max-w-none"
              : showLabel
              ? "opacity-100 max-w-[160px]"
              : "opacity-0 max-w-0"
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
};

const tabConfigs = [
  { id: "chat" as TabType, icon: <MessagesSquare size={24} />, label: "채팅" },
  { id: "bots" as TabType, icon: <Bot size={24} />, label: "봇" },
  { id: "lorebook" as TabType, icon: <BookText size={24} />, label: "로어북" },
  { id: "prompts" as TabType, icon: <Blocks size={24} />, label: "프롬프트" },
  { id: "persona" as TabType, icon: <Drama />, label: "페르소나" },
];

const useHandleTabChange = () => {
  const { setCurrentTab } = useAppState();
  const { updateHeaderConfig } = useHeader();
  return (tab: TabType) => {
    setCurrentTab(tab);
    const headerConfigs = {
      chat: { title: "채팅", rightContent: null },
      bots: { title: "봇", rightContent: null },
      lorebook: { title: "로어북", rightContent: null },
      prompts: { title: "프롬프트", rightContent: null },
      settings: { title: "설정", rightContent: null },
    } as const;
    updateHeaderConfig(headerConfigs[tab]);
  };
};

const Sidebar = () => {
  const {
    currentTab,
    isSidebarExpanded,
    isMobileDrawerOpen,
    toggleMobileDrawer,
  } = useAppState();
  const handleTabChange = useHandleTabChange();

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        className="hidden md:block sticky left-0 top-0 h-dvh"
        initial={false}
        animate={{ width: isSidebarExpanded ? 256 : 72 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        <nav className="h-full bg-sidebar border-r p-2 flex flex-col gap-2 w-full">
          {/* Brand */}
          <div
            className={clsx(
              "h-12 w-full px-2 flex items-center rounded-lg select-none text-sidebar-foreground",
              isSidebarExpanded ? "justify-start gap-3" : "justify-center gap-0"
            )}
          >
            <div className="shrink-0 h-6 w-6 flex items-center justify-center">
              <CupSoda size={24} />
            </div>
            <span
              className={clsx(
                "text-sm font-medium overflow-hidden whitespace-nowrap transition-all",
                isSidebarExpanded ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0"
              )}
            >
              limlim-ai
            </span>
          </div>

          {tabConfigs.map((tab) => (
            <NavBtn
              key={tab.id}
              isActive={currentTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
              label={tab.label}
              showLabel={isSidebarExpanded}
            >
              {tab.icon}
            </NavBtn>
          ))}
          <div className="mt-auto">
            <NavBtn
              isActive={currentTab === "settings"}
              onClick={() => handleTabChange("settings")}
              label="설정"
              showLabel={isSidebarExpanded}
            >
              <Settings size={24} />
            </NavBtn>
          </div>
        </nav>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggleMobileDrawer}
            />
            <motion.aside
              className="absolute left-0 top-0 h-full bg-sidebar border-r shadow-xl w-[272px]"
              initial={{ x: -272 }}
              animate={{ x: 0 }}
              exit={{ x: -272 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <nav className="h-full w-full p-3 flex flex-col gap-2">
                {/* Brand (mobile) */}
                <div className="h-12 w-full px-2 flex items-center rounded-lg gap-3 select-none">
                  <div className="shrink-0 h-6 w-6 flex items-center justify-center">
                    <CupSoda size={18} />
                  </div>
                  <span className="text-sm font-medium">limlim-ai</span>
                </div>

                {tabConfigs.map((tab) => (
                  <NavBtn
                    key={tab.id}
                    isActive={currentTab === tab.id}
                    onClick={() => {
                      handleTabChange(tab.id);
                      toggleMobileDrawer();
                    }}
                    label={tab.label}
                    showLabel={true}
                  >
                    {tab.icon}
                  </NavBtn>
                ))}
                <div className="mt-auto">
                  <NavBtn
                    isActive={currentTab === "settings"}
                    onClick={() => {
                      handleTabChange("settings");
                      toggleMobileDrawer();
                    }}
                    label="설정"
                    showLabel={true}
                  >
                    <Settings size={24} />
                  </NavBtn>
                </div>
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
