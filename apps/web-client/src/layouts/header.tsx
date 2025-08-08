import { Menu } from "lucide-react";
import { useHeader } from "../contexts/HeaderContext";
import { useAppState } from "../contexts/AppStateContext";

const Header = () => {
    const { headerConfig } = useHeader();
    const { toggleSidebar, toggleMobileDrawer } = useAppState();
    
    return (
        <header className="h-12 w-full bg-background border-b flex items-center px-4">
            <div className="flex items-center gap-3 flex-1">
                {headerConfig.showDrawerButton && (
                    <>
                        {/* 데스크탑 메뉴 버튼 */}
                        <button 
                            className="hidden md:block p-1 hover:bg-muted rounded-md"
                            onClick={toggleSidebar}
                        >
                            <Menu size={20} />
                        </button>
                        
                        {/* 모바일 메뉴 버튼 */}
                        <button 
                            className="md:hidden p-1 hover:bg-muted rounded-md"
                            onClick={toggleMobileDrawer}
                        >
                            <Menu size={20} />
                        </button>
                    </>
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