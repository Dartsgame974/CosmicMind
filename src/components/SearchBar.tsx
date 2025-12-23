import { Search, Mic } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { CosmicButton } from "./CosmicButton";

export function SearchBar() {
    return (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
            <GlassPanel
                intensity="high"
                className="w-full max-w-2xl h-14 flex items-center px-2 gap-2 rounded-full border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
                <div className="p-2 text-blue-400">
                    <Search className="w-5 h-5" />
                </div>

                <input
                    type="text"
                    placeholder="Ask to Cosmos..."
                    className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder:text-white/30 text-sm font-light tracking-wide h-full"
                />

                <CosmicButton variant="icon" icon={Mic} className="w-9 h-9 opacity-50 hover:opacity-100" />
            </GlassPanel>
        </div>
    );
}
