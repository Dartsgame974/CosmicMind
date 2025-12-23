import { GlassPanel } from "./GlassPanel";
import { CosmicButton } from "./CosmicButton";
import { Play, ExternalLink, Heart, CheckCircle2, Circle } from "lucide-react";
import { cn } from "../lib/utils";

interface ContentCardProps {
    title: string;
    description: string;
    thumbnail: string;
    tags: string[];
    source?: "youtube" | "web" | "twitter";
    onClick?: () => void;
    selectable?: boolean;
    isSelected?: boolean;
    onToggleSelect?: () => void;
}

export function ContentCard({
    title,
    description,
    thumbnail,
    tags,
    source = "web",
    onClick,
    selectable,
    isSelected,
    onToggleSelect
}: ContentCardProps) {
    return (
        <GlassPanel
            intensity="low"
            className={cn(
                "group relative overflow-hidden transition-all duration-300",
                selectable ? "cursor-default" : "cursor-pointer hover:-translate-y-1",
                isSelected ? "border-blue-500/50 ring-1 ring-blue-500/50" : "hover:border-blue-500/30"
            )}
            onClick={!selectable ? onClick : undefined}
        >
            {/* Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Selection Overlay or Play Button */}
                {selectable ? (
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleSelect?.();
                        }}
                    >
                        {isSelected ? (
                            <CheckCircle2 className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        ) : (
                            <Circle className="w-12 h-12 text-white/30 group-hover:text-white/70" />
                        )}
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                        <CosmicButton
                            variant="icon"
                            icon={Play}
                            className="w-12 h-12 bg-white/10 hover:bg-blue-500 hover:text-white border-white/20 hover:scale-110 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                        />
                    </div>
                )}

                {/* Top Right Badges */}
                <div className="absolute top-2 right-2 flex gap-1">
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white/70 border border-white/10">
                        {source}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-medium leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                    {title}
                </h3>

                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                    {description}
                </p>

                {/* Footer */}
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                        {tags.map((tag, i) => (
                            <span key={i} className="text-[10px] text-white/30 px-1.5 py-0.5 rounded-full border border-white/5 group-hover:border-blue-500/20 group-hover:text-blue-400/60 transition-colors">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {!selectable && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                            <CosmicButton variant="icon" icon={Heart} className="w-6 h-6 hover:text-red-400" />
                            <CosmicButton variant="icon" icon={ExternalLink} className="w-6 h-6 hover:text-blue-400" />
                        </div>
                    )}
                </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/20 rounded-2xl pointer-events-none transition-colors duration-500" />
        </GlassPanel>
    );
}
