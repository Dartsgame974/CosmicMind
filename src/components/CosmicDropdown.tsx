import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

    const updatePosition = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // Calculate available space to decide if we drop down or up roughly? 
            // For now, simpler: just drop down unless near bottom.
            // Actually, let's keep it simple: always align bottom-left or bottom-right.
            // Original code was absolute right-0. So align right edge.

            setPosition({
                top: rect.bottom + window.scrollY + 8, // 8px margin
                left: rect.right + window.scrollX,
                width: rect.width
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            // Optional: Add listeners for scroll/resize to update or close
            window.addEventListener('scroll', () => setIsOpen(false), { capture: true });
            window.addEventListener('resize', () => setIsOpen(false));
        }
        return () => {
            window.removeEventListener('scroll', () => setIsOpen(false), { capture: true });
            window.removeEventListener('resize', () => setIsOpen(false));
        };
    }, [isOpen]);

    // Close on click outside logic handles the portal too if we check target?
    // standard click outside hooks often fail with portals unless careful.
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // We need to check if click is in container OR in the portal menu
            // Since portal is separate, we can't easily check 'contains' on the container.
            // But we can check if the target has a specific class or ID, or use a ref for the portal content.
            const target = event.target as HTMLElement;
            if (containerRef.current?.contains(target)) return;
            if (target.closest('.cosmic-dropdown-portal')) return;
            setIsOpen(false);
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const selectedItem = items.find(i => i.value === value);

    const menu = (
        <div
            className="fixed z-[9999] min-w-[180px] animate-fade-in cosmic-dropdown-portal"
            style={{
                top: position.top,
                left: position.left,
                transform: 'translateX(-100%)' // Align right edge to button right edge
            }}
        >
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
    );

    return (
        <div className="relative inline-block" ref={containerRef}>
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

            {isOpen && createPortal(menu, document.body)}
        </div>
    );
}
