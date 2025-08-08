import { Blocks, BookText, Bot, Settings } from "lucide-react";
import { clsx } from 'clsx';

const NavBtn = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div role="button" tabIndex={0} className={clsx("w-full aspect-square flex items-center justify-center rounded-lg hover:text-primary hover:bg-sidebar-accent transition-colors cursor-pointer")}>
           {children}
        </div>
    )
} 

const createNavBtn = (icon: React.ReactNode) => {
    return (
        <NavBtn>
            {icon}
        </NavBtn>
    )
}

const Sidebar = () => {
    return (
        <nav className="hidden md:flex h-dvh p-2 flex-col w-[72px] bg-sidebar border-r">
            {createNavBtn(<Bot />)}
            {createNavBtn(<BookText />)}
            {createNavBtn(<Blocks />)}

            <div className="mt-auto">
                {createNavBtn(<Settings />)}
            </div>
        </nav>
    )
}

export default Sidebar;