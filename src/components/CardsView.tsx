import { useState, useEffect } from "react";
import { ContentCard } from "./ContentCard";
import { ContentOverlay } from "./ContentOverlay";
import { InputOverlay } from "./InputOverlay";
import { AddContentModal } from "./AddContentModal";
import { GlassPanel } from "./GlassPanel";
import { CosmicButton } from "./CosmicButton";
import { CosmicDropdown } from "./CosmicDropdown";
import { FolderPlus, Trash2, ArrowUpDown, CheckSquare, PlusCircle, Search } from "lucide-react";
import { cn } from "../lib/utils";
import { useToast } from "./ToastContext";
import { useLocale } from "../hooks/useLocale";

export function CardsView() {
    const { t } = useLocale();
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "az" | "za">("newest");
    const [showFolderInput, setShowFolderInput] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


    const toast = useToast();

    const [cards, setCards] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/cards')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const parsed = data.map((c: any) => ({ ...c, date: new Date(c.date) }));
                    setCards(parsed);
                }
            })
            .catch(err => console.error("Failed to load cards", err));
    }, []);

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

    const handleDelete = async () => {
        if (confirm(`Delete ${selectedIds.length} items?`)) {
            for (const id of selectedIds) {
                await fetch(`http://localhost:3001/api/cards/${id}`, { method: 'DELETE' });
            }
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

    const handleCreateFolder = async (name: string) => {
        const newFolderPayload = {
            title: name,
            description: "Folder / Collection",
            thumbnail: "",
            tags: ["collection"],
            source: "folder",
            date: new Date(),
            images: []
        };

        try {
            const res = await fetch('http://localhost:3001/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFolderPayload)
            });
            const savedFolder = await res.json();
            savedFolder.date = new Date(savedFolder.date);

            setCards(prev => [savedFolder, ...prev]);
            toast.show({
                title: "Folder Created",
                message: `Collection "${name}" has been successfully created.`,
                type: "success"
            });
            setShowFolderInput(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddCard = async (newCard: any) => {
        try {
            const res = await fetch('http://localhost:3001/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCard)
            });
            const savedCard = await res.json();
            savedCard.date = new Date(savedCard.date);

            setCards(prev => [savedCard, ...prev]);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <div className="p-8 pt-12 pl-24 pb-28 w-full max-w-[1600px] mx-auto animate-fade-in">

                {/* Header Section */}
                <div className="mb-8 pl-1 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-light tracking-tight flex items-center gap-3">
                            <span className="text-purple-400">{t('cards.header')}</span>
                        </h2>
                        <div className="h-px w-full max-w-sm bg-gradient-to-r from-purple-500/50 to-transparent mt-4" />
                    </div>

                    {/* Toolbar */}
                    <GlassPanel intensity="low" className="p-1 flex items-center gap-1 rounded-xl bg-black/40 border-white/5 relative z-50">

                        <CosmicButton onClick={() => setShowAddModal(true)} className="text-xs gap-1.5 px-3 bg-white text-black hover:bg-white/90 border-transparent">
                            <PlusCircle className="w-3.5 h-3.5" />
                            {t('cards.add_content')}
                        </CosmicButton>

                        <div className="w-px h-4 bg-white/10 mx-1" />

                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('cards.search_placeholder')}
                                className="h-8 bg-transparent border-none text-xs text-white placeholder:text-white/30 pl-9 pr-3 w-[120px] focus:w-[180px] transition-all outline-none"
                            />
                        </div>

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
                            {t('cards.select')}
                        </CosmicButton>

                        <div className="w-px h-4 bg-white/10 mx-1" />

                        <CosmicDropdown
                            icon={ArrowUpDown}
                            label={t('cards.sort.label')}
                            value={sortOrder}
                            onSelect={handleSort}
                            items={[
                                { label: t('cards.sort.newest'), value: "newest" },
                                { label: t('cards.sort.oldest'), value: "oldest" },
                                { label: t('cards.sort.az'), value: "az" },
                                { label: t('cards.sort.za'), value: "za" },
                            ]}
                        />

                        <CosmicButton onClick={() => setShowFolderInput(true)} variant="ghost" className="text-xs gap-1.5 hover:text-green-400">
                            <FolderPlus className="w-3.5 h-3.5" />
                            {t('cards.new_folder')}
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
                                    {t('cards.delete')} ({selectedIds.length})
                                </CosmicButton>
                            </>
                        )}
                    </GlassPanel>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-0">
                    {cards.filter(card => {
                        const query = searchQuery.toLowerCase();
                        return card.title.toLowerCase().includes(query) ||
                            card.description.toLowerCase().includes(query) ||
                            card.tags.some(tag => tag.toLowerCase().includes(query));
                    }).map((card) => (
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
