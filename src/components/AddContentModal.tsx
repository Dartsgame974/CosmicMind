import { useState, useEffect } from "react";
import { GlassPanel } from "./GlassPanel";
import { CosmicButton } from "./CosmicButton";
import { X, Globe, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { fetchMetadata, type Metadata } from "../lib/metadata";
import { useToast } from "./ToastContext";
import { useSettings } from "../hooks/useSettings";

interface AddContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (card: any) => void;
}

export function AddContentModal({ isOpen, onClose, onAdd }: AddContentModalProps) {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [personalNote, setPersonalNote] = useState("");
    const toast = useToast();
    const { settings } = useSettings();

    // Debounce fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            if (url && (url.startsWith("http") || url.startsWith("www"))) {
                handleFetch();
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [url]);

    const handleFetch = async () => {
        if (!url) return;
        setIsLoading(true);
        try {
            const apiKey = settings.enableYoutubeMetadata ? settings.youtubeApiKey : undefined;
            const data = await fetchMetadata(url, apiKey);
            setMetadata(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = () => {
        if (!metadata) return;

        const combinedTags = Array.from(new Set([
            ...((metadata as any).tags || []),
            metadata.source,
            "new"
        ]));

        onAdd({
            title: metadata.title,
            description: metadata.description,
            thumbnail: metadata.thumbnail || `https://picsum.photos/seed/${Date.now()}/600/400`,
            source: metadata.source,
            url: url, // Save the actual URL
            images: metadata.images,
            tags: combinedTags,
            date: new Date(),
            note: personalNote
        });

        toast.show({
            title: "Content Added",
            message: "Successfully added to your registry.",
            type: "success"
        });

        handleClose();
    };

    const handleClose = () => {
        setUrl("");
        setMetadata(null);
        setPersonalNote(""); // Reset note
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

            <GlassPanel intensity="high" className="relative w-full max-w-2xl p-0 flex flex-col border-white/20 shadow-2xl overflow-hidden min-h-[400px]">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-xl font-light tracking-tight text-white flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-blue-400" />
                        Add New Content
                    </h3>
                    <button onClick={handleClose} className="text-white/40 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6 flex-1">
                    {/* Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste URL here (Twitter, YouTube, or generic website)..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-light text-lg"
                        />
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        {isLoading && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 min-h-[200px] border border-dashed border-white/10 rounded-lg p-4 flex flex-col gap-4 bg-black/20">
                        {!metadata && !isLoading && (
                            <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-3">
                                <LinkIcon className="w-12 h-12 opacity-50" />
                                <p className="text-sm">Enter a URL to fetch metadata...</p>
                            </div>
                        )}

                        {metadata && (
                            <div className="flex gap-4 items-start animate-fade-in">
                                <div className="w-1/3 aspect-video bg-black/50 rounded overflow-hidden border border-white/10 relative group">
                                    {metadata.thumbnail ? (
                                        <img src={metadata.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20">NO IMAGE</div>
                                    )}
                                    {metadata.images.length > 1 && (
                                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white/80 border border-white/10 flex items-center gap-1">
                                            <ImageIcon className="w-3 h-3" />
                                            +{metadata.images.length - 1}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <input
                                            value={metadata.title}
                                            onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                                            className="bg-transparent border-b border-white/10 focus:border-blue-500/50 w-full text-lg font-medium outline-none text-white/90 pb-1"
                                        />
                                    </div>
                                    <textarea
                                        value={metadata.description}
                                        onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                                        className="bg-transparent border border-white/5 rounded p-2 focus:border-blue-500/50 w-full text-sm text-white/60 min-h-[80px] outline-none resize-none"
                                    />
                                    <div className="text-xs text-blue-400 uppercase tracking-widest font-bold mt-1">
                                        {metadata.source}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Personal Note */}
                        {metadata && (
                            <div className="animate-fade-in border-t border-white/5 pt-4 mt-2">
                                <label className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-2 block">Personal Note (Optional)</label>
                                <textarea
                                    value={personalNote}
                                    onChange={(e) => setPersonalNote(e.target.value)}
                                    placeholder="Add your own context, thoughts, or reminders about this content..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-green-500/30 focus:ring-1 focus:ring-green-500/20 transition-all min-h-[80px] resize-none"
                                />
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                    <CosmicButton onClick={handleClose}>Cancel</CosmicButton>
                    <CosmicButton
                        variant="glow"
                        onClick={handleConfirm}
                        disabled={!metadata || isLoading}
                    >
                        Confirm & Add
                    </CosmicButton>
                </div>
            </GlassPanel>
        </div>
    );
}
