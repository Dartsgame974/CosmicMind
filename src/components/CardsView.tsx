import { useState } from "react";
import { ContentCard } from "./ContentCard";
import { ContentOverlay } from "./ContentOverlay";
import { InputOverlay } from "./InputOverlay";
import { GlassPanel } from "./GlassPanel";
import { CosmicButton } from "./CosmicButton";
import { CosmicDropdown } from "./CosmicDropdown";
import { FolderPlus, Trash2, ArrowUpDown, CheckSquare } from "lucide-react";
import { cn } from "../lib/utils";
import { useToast } from "./ToastContext";

export function CardsView() {
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "az" | "za">("newest");
    const [showFolderInput, setShowFolderInput] = useState(false);

    const toast = useToast();

    // Mock Data
    const [cards, setCards] = useState(Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        date: new Date(Date.now() - i * 86400000), // Mock dates
        thumbnail: `https://picsum.photos/seed/${i + 40}/600/400`,
        title: i % 3 === 0 ? "Unity Particle System Tutorial - Advanced VFX" : i % 3 === 1 ? "The Future of React Server Components" : "Cyberpunk City Ambience - 10 Hours",
        description: "Learn how to create stunning visual effects using the Unity Particle System. In this deep dive, we explore force fields, sub-emitters, and custom shaders.",
        tags: i % 3 === 0 ? ["vfx", "unity", "3d"] : ["tech", "coding", "web"],
        source: i % 3 === 0 ? "youtube" : "web"
    })));

    const toggleSelection = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSort = (value: string) => {
        setSortOrder(value as any);
        const order = value as "newest" | "oldest" | "az" | "za";

        setCards(prev => [...prev].sort((a, b) => {
            if (order === "newest") return b.id - a.id;
            if (order === "oldest") return a.id - b.id;
            if (order === "az") return a.title.localeCompare(b.title);
            if (order === "za") return b.title.localeCompare(a.title);
            return 0;
        }));
    };

    const handleDelete = () => {
        if (confirm(`Delete ${selectedIds.length} items?`)) {
            setCards(prev => prev.filter(c => !selectedIds.includes(c.id)));
            toast.show({
                title: "Items Deleted",
                message: `Successfully removed ${selectedIds.length} items from the registry.`,
                type: "success"
            });
            setSelectedIds([]);
            setSelectionMode(false);
        }
    };

    const handleCreateFolder = (name: string) => {
        toast.show({
            title: "Folder Created",
            message: `Collection "${name}" has been successfully created.`,
            type: "success"
        });
        setShowFolderInput(false);
    };

    return (
        <>
            <div className="p-8 pt-12 pl-24 pb-28 w-full max-w-[1600px] mx-auto animate-fade-in">

                {/* Header Section */}
                <div className="mb-8 pl-1 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-light tracking-tight flex items-center gap-3">
                            <span className="text-purple-400">Content</span> Registry
                        </h2>
                        <div className="h-px w-full max-w-sm bg-gradient-to-r from-purple-500/50 to-transparent mt-4" />
                    </div>

                    {/* Toolbar */}
                    <GlassPanel intensity="low" className="p-1 flex items-center gap-1 rounded-xl bg-black/40 border-white/5">
                        <CosmicButton
                            variant="ghost"
                            className={cn("text-xs gap-1.5", selectionMode && "bg-blue-500/10 text-blue-400")}
                            onClick={() => {
                                setSelectionMode(!selectionMode);
                                setSelectedIds([]);
                            }}
                        >
                            <CheckSquare className="w-3.5 h-3.5" />
                            Select
                        </CosmicButton>

                        <div className="w-px h-4 bg-white/10 mx-1" />

                        <CosmicDropdown
                            icon={ArrowUpDown}
                            label="Sort By"
                            value={sortOrder}
                            onSelect={handleSort}
                            items={[
                                { label: "Newest First", value: "newest" },
                                { label: "Oldest First", value: "oldest" },
                                { label: "Alphabetical (A-Z)", value: "az" },
                                { label: "Alphabetical (Z-A)", value: "za" },
                            ]}
                        />

                        <CosmicButton onClick={() => setShowFolderInput(true)} variant="ghost" className="text-xs gap-1.5 hover:text-green-400">
                            <FolderPlus className="w-3.5 h-3.5" />
                            New Folder
                        </CosmicButton>

                        {selectedIds.length > 0 && (
                            <>
                                <div className="w-px h-4 bg-white/10 mx-1" />
                                <CosmicButton
                                    variant="ghost"
                                    className="text-xs gap-1.5 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete ({selectedIds.length})
                                </CosmicButton>
                            </>
                        )}
                    </GlassPanel>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cards.map((card) => (
                        <ContentCard
                            key={card.id}
                            title={card.title}
                            description={card.description}
                            thumbnail={card.thumbnail}
                            tags={card.tags}
                            source={card.source as any}
                            onClick={() => setSelectedCard(card)}
                            selectable={selectionMode}
                            isSelected={selectedIds.includes(card.id)}
                            onToggleSelect={() => toggleSelection(card.id)}
                        />
                    ))}
                </div>
            </div>

            <ContentOverlay
                isOpen={!!selectedCard}
                data={selectedCard}
                onClose={() => setSelectedCard(null)}
            />

            <InputOverlay
                isOpen={showFolderInput}
                title="Create New Folder"
                placeholder="Folder Name (e.g., 'Tutorials')"
                onConfirm={handleCreateFolder}
                onCancel={() => setShowFolderInput(false)}
            />
        </>
    );
}
