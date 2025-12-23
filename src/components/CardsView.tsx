import { useState } from "react";
import { ContentCard } from "./ContentCard";
import { ContentOverlay } from "./ContentOverlay";
import { InputOverlay } from "./InputOverlay";
import { AddContentModal } from "./AddContentModal";
import { GlassPanel } from "./GlassPanel";
import { CosmicButton } from "./CosmicButton";
import { CosmicDropdown } from "./CosmicDropdown";
import { FolderPlus, Trash2, ArrowUpDown, CheckSquare, PlusCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { useToast } from "./ToastContext";

export function CardsView() {
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "az" | "za">("newest");
    const [showFolderInput, setShowFolderInput] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const toast = useToast();

    // Mock Data
    const [cards, setCards] = useState(Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        date: new Date(Date.now() - i * 86400000), // Mock dates
        thumbnail: `https://picsum.photos/seed/${i + 40}/600/400`,
        title: i % 3 === 0 ? "Unity Particle System Tutorial - Advanced VFX" : i % 3 === 1 ? "The Future of React Server Components" : "Cyberpunk City Ambience - 10 Hours",
        description: "Learn how to create stunning visual effects using the Unity Particle System. In this deep dive, we explore force fields, sub-emitters, and custom shaders.",
        tags: i % 3 === 0 ? ["vfx", "unity", "3d"] : ["tech", "coding", "web"],
        source: i % 3 === 0 ? "youtube" : "web",
        images: []
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
            if (order === "newest") return b.date.getTime() - a.date.getTime();
            if (order === "oldest") return a.date.getTime() - b.date.getTime();
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
        const newFolder = {
            id: Math.max(...cards.map(c => c.id), 0) + 1,
            title: name,
            description: "Folder / Collection",
            thumbnail: "", // Will use icon in Card
            tags: ["collection"],
            source: "folder",
            date: new Date(),
            images: []
        };
        setCards(prev => [newFolder as any, ...prev]);

        toast.show({
            title: "Folder Created",
            message: `Collection "${name}" has been successfully created.`,
            type: "success"
        });
        setShowFolderInput(false);
    };

    const handleAddCard = (newCard: any) => {
        const cardWithId = {
            ...newCard,
            id: Math.max(...cards.map(c => c.id), 0) + 1,
            date: new Date()
        };
        // Add to beginning
        setCards(prev => [cardWithId, ...prev]);

        // Re-sort if needed, but usually assume newest is shown first or stick to current sort
        // Simplest is to just add to state, sorting will apply on next render only if we trigger logic, 
        // but here we just prepend.
        // If sortOrder is Newest, prepending is correct.
        // If sortOrder is Oldest, prepending is "wrong" visually until resort, but acceptable for demo.
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
                    <GlassPanel intensity="low" className="p-1 flex items-center gap-1 rounded-xl bg-black/40 border-white/5 relative z-50">

                        <CosmicButton onClick={() => setShowAddModal(true)} variant="glow" className="text-xs gap-1.5 px-3">
                            <PlusCircle className="w-3.5 h-3.5" />
                            Add Content
                        </CosmicButton>

                        <div className="w-px h-4 bg-white/10 mx-1" />

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-0">
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

            <AddContentModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddCard}
            />
        </>
    );
}
