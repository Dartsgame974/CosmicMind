import { Home, LayoutGrid, Settings } from "lucide-react";
import { CosmicButton } from "./CosmicButton";
import { GlassPanel } from "./GlassPanel";

interface SidebarProps {
    currentView: "dashboard" | "cards" | "settings";
    onNavigate: (view: "dashboard" | "cards" | "settings") => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
    const navItems = [
        { icon: Home, label: "Dashboard", id: "dashboard" },
        { icon: LayoutGrid, label: "Cards", id: "cards" },
        { icon: Settings, label: "Settings", id: "settings" },
    ];

    return (
        <GlassPanel
            intensity="low"
            className="fixed left-4 top-4 bottom-24 w-16 flex flex-col items-center py-6 gap-6 z-[100] border-white/5"
        >
            <div className="w-8 h-8 rounded-full bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400/30 mb-4" />

            <div className="flex flex-col gap-4 w-full px-2">
                {navItems.map((item, index) => (
                    <CosmicButton
                        key={index}
                        variant="icon"
                        icon={item.icon}
                        className={(item.id === currentView) ? "bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]" : "opacity-60 hover:opacity-100"}
                        onClick={() => onNavigate(item.id as any)}
                    />
                ))}
            </div>
        </GlassPanel>
    );
}
