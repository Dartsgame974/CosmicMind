import { X, ChevronLeft, ChevronRight, Calendar, Tag, Globe } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { CosmicButton } from "./CosmicButton";
import { useState, useEffect } from "react";

interface ContentOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        title: string;
        description: string;
        thumbnail: string;
        tags: string[];
        source: string;
        images?: string[];
    } | null;
}

export function ContentOverlay({ isOpen, onClose, data }: ContentOverlayProps) {
    const [currentImage, setCurrentImage] = useState(0);

    // Reset image when opening new data
    useEffect(() => {
        if (isOpen) setCurrentImage(0);
    }, [isOpen, data]);

    if (!isOpen || !data) return null;

    // Use data images or fallback to thumbnail
    const carouselImages = (data.images && data.images.length > 0) ? data.images : [data.thumbnail];

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

    // French Date Formatter
    // "Lundi 23 Décembre 2024 • 14:30"
    const now = new Date();
    const dateStr = new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(now);

    const timeStr = new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(now);

    const formattedDate = `${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} • ${timeStr}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Main Container */}
            <div className="relative w-full max-w-6xl h-full max-h-[85vh] flex flex-col gap-4 pointer-events-none">

                {/* Close Button */}
                <div className="absolute top-0 right-0 -mt-12 md:-mt-0 md:-right-16 pointer-events-auto z-50">
                    <CosmicButton
                        variant="icon"
                        icon={X}
                        onClick={onClose}
                        className="bg-black/50 hover:bg-red-500/20 hover:text-red-400 border-white/10"
                    />
                </div>

                <GlassPanel
                    intensity="high"
                    className="flex-1 w-full overflow-hidden flex flex-col pointer-events-auto shadow-[0_0_100px_rgba(59,130,246,0.1)] border-white/10"
                >
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">

                        {/* Carousel Section */}
                        <div className="relative w-full aspect-[21/9] bg-black/50 group">
                            <img
                                src={carouselImages[currentImage]}
                                alt="Carousel"
                                className="w-full h-full object-contain"
                            />

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {carouselImages.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImage ? "bg-blue-500 w-4" : "bg-white/30"}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Info Panel Section */}
                        <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Left Metadata Column */}
                            <div className="lg:col-span-4 flex flex-col gap-6 border-r border-white/5 pr-8">

                                {/* Date */}
                                <div className="flex items-center gap-3 text-white/60">
                                    <div className="p-2 rounded-lg bg-blue-500/10">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">Discovery Date</div>
                                        <div className="text-sm font-medium">{formattedDate}</div>
                                    </div>
                                </div>

                                {/* Source */}
                                <div className="flex items-center gap-3 text-white/60">
                                    <div className="p-2 rounded-lg bg-purple-500/10">
                                        <Globe className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">Origin Source</div>
                                        <div className="text-sm font-medium capitalize">{data.source}</div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3 text-white/50">
                                        <Tag className="w-4 h-4" />
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Semantic Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {data.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/30 text-white/70 hover:text-blue-400 transition-colors"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Main Content Info */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                <h2 className="text-3xl font-light tracking-tight leading-tight">
                                    {data.title}
                                </h2>

                                <p className="text-white/70 leading-relaxed text-lg font-light">
                                    {data.description}
                                    {" "}{data.description}{" "}{data.description} {/* Mocking longer text */}
                                </p>

                                <div className="mt-auto pt-6 flex gap-4">
                                    <CosmicButton variant="glow" label="Access Content" />
                                    <CosmicButton variant="ghost" label="Share Frequency" />
                                </div>
                            </div>

                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}
