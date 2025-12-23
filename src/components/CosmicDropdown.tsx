import { useState, useRef, useEffect } from "react";
import { GlassPanel } from "./GlassPanel";
import { CosmicButton } from "./CosmicButton";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../lib/utils";

interface DropdownItem {
    label: string;
    value: string;
    onClick?: () => void;
}

interface CosmicDropdownProps {
    label?: string;
    icon?: React.ElementType;
    items: DropdownItem[];
    value?: string;
    onSelect: (value: string) => void;
    className?: string;
}

export function CosmicDropdown({ label, icon: Icon, items, value, onSelect, className }: CosmicDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedItem = items.find(i => i.value === value);

    return (
        <div className="relative" ref={containerRef}>
            <CosmicButton
                variant="ghost"
                className={cn("text-xs gap-1.5 min-w-[140px] justify-between", className)}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{selectedItem ? selectedItem.label : label || "Select..."}</span>
                </div>
                <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
            </CosmicButton>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 z-50 min-w-[180px] animate-fade-in origin-top-right">
                    <GlassPanel intensity="high" className="p-1 flex flex-col gap-0.5 border-white/10 shadow-2xl">
                        {items.map((item) => (
                            <button
                                key={item.value}
                                onClick={() => {
                                    onSelect(item.value);
                                    item.onClick?.();
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-lg transition-colors",
                                    value === item.value
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "hover:bg-white/5 text-white/70 hover:text-white"
                                )}
                            >
                                {item.label}
                                {value === item.value && <Check className="w-3 h-3" />}
                            </button>
                        ))}
                    </GlassPanel>
                </div>
            )}
        </div>
    );
}
