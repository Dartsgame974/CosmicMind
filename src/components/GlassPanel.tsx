import { cn } from "../lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    intensity?: "low" | "medium" | "high";
}

export function GlassPanel({ children, className, intensity = "medium", ...props }: GlassPanelProps) {
    const intensityMap = {
        low: "bg-black/20 backdrop-blur-sm border-white/5",
        medium: "bg-black/40 backdrop-blur-md border-white/10",
        high: "bg-black/60 backdrop-blur-xl border-white/20",
    };

    return (
        <div
            className={cn(
                "rounded-xl border shadow-2xl transition-all duration-300",
                intensityMap[intensity],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
