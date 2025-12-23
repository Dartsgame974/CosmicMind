import { cn } from "../lib/utils";
import type { LucideIcon } from "lucide-react";

interface CosmicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "ghost" | "glow" | "icon";
    icon?: LucideIcon;
    label?: string;
}

export function CosmicButton({
    className,
    variant = "ghost",
    icon: Icon,
    label,
    children,
    ...props
}: CosmicButtonProps) {

    const variants = {
        ghost: "hover:bg-white/10 text-white/70 hover:text-white border border-white/20 hover:border-white/30",
        glow: "bg-blue-500/10 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-500/20",
        icon: "rounded-full p-2 hover:bg-white/10 text-white/70 hover:text-white border border-white/20 hover:border-white/30 aspect-square flex items-center justify-center",
    };

    return (
        <button
            className={cn(
                "relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2",
                "active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                variant !== "icon" && "px-4 py-2 rounded-lg text-sm font-medium tracking-wide",
                variants[variant],
                className
            )}
            {...props}
        >
            {Icon && <Icon className={cn("w-4 h-4", variant === "icon" && "w-5 h-5")} />}
            {label || children}
        </button>
    );
}
