import { Menu, PanelLeft } from "lucide-react";
import { useHeader } from "../contexts/HeaderContext";
import { useAppState } from "../contexts/AppStateContext";
import { useIsMobile } from "../hooks/useIsMobile";

const Header = () => {
    const { headerConfig } = useHeader();
    const { toggleSidebar, toggleMobileDrawer } = useAppState();
    const isMobile = useIsMobile();
    
    return (
        <header className="h-12 w-full bg-background border-b flex items-center px-4">
            <div className="flex items-center gap-3 flex-1">
                {headerConfig.showDrawerButton && (
                    <button 
                        className="p-1 hover:bg-muted rounded-md"
                        onClick={isMobile ? toggleMobileDrawer : toggleSidebar}
                        aria-label="toggle navigation"
                    >
                        {isMobile ? <Menu size={20} /> : <PanelLeft size={20} />}
                    </button>
                )}
                {headerConfig.leftContent}
                {headerConfig.title && (
                    <h1 className="font-medium">{headerConfig.title}</h1>
                )}
            </div>
            {headerConfig.rightContent && (
                <div className="flex items-center gap-2">
                    {headerConfig.rightContent}
                </div>
            )}
        </header>
    )
}

export default Header;