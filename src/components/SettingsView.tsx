import { useState, useEffect } from "react";
import { GlassPanel } from "./GlassPanel";
import { CosmicButton } from "./CosmicButton";
import { CosmicDropdown } from "./CosmicDropdown";
import { Globe, Clock, Monitor, Bell, HardDrive, Download, Trash2, Volume2, Shield, Cpu } from "lucide-react";
import { useToast } from "./ToastContext";
import { useSettings } from "../hooks/useSettings";

export function SettingsView() {
    const { settings, updateSetting } = useSettings();
    const [models, setModels] = useState<{ name: string }[]>([]);
    const [themes, setThemes] = useState<{ id: string, name: string }[]>([]);
    const toast = useToast();

    useEffect(() => {
        // Fetch Models
        fetch('http://localhost:3001/api/models')
            .then(res => res.json())
            .then(data => setModels(data))
            .catch(err => console.error("Failed to load models", err));

        // Fetch Themes
        fetch('http://localhost:3001/api/themes')
            .then(res => res.json())
            .then(data => setThemes(data))
            .catch(err => console.error("Failed to load themes", err));
    }, []);

    const handleClearCache = () => {
        localStorage.clear();
        sessionStorage.clear();
        toast.show({
            title: "Cache Cleared",
            message: "Local storage has been successfully purged. Refreshing...",
            type: "success"
        });
        setTimeout(() => window.location.reload(), 1500);
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "cosmic_config.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast.show({
            title: "Configuration Exported",
            message: "Your settings have been saved to cosmic_config.json",
            type: "success"
        });
    };

    return (
        <div className="p-8 pt-12 pl-24 pb-28 w-full max-w-5xl mx-auto animate-fade-in space-y-8">

            <div className="mb-8">
                <h2 className="text-2xl font-light tracking-tight flex items-center gap-3">
                    <span className="text-purple-400">System</span> Configuration
                </h2>
                <div className="h-px w-full max-w-sm bg-gradient-to-r from-purple-500/50 to-transparent mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Neural Engine */}
                <GlassPanel intensity="low" className="p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-pink-400 mb-2">
                        <Cpu className="w-5 h-5" />
                        <h3 className="text-sm font-medium uppercase tracking-wider">Neural Engine</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-white/80">Ollama Model</label>
                            {models.length > 0 ? (
                                <CosmicDropdown
                                    label={settings.aiModel || "Select Model"}
                                    items={models.map(m => ({ label: m.name, value: m.name }))}
                                    onSelect={(val) => updateSetting('aiModel', val)}
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={settings.aiModel}
                                    onChange={(e) => updateSetting('aiModel', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/30"
                                    placeholder="Enter model name..."
                                />
                            )}
                            <p className="text-xs text-white/40">
                                {models.length > 0 ? `${models.length} local models detected.` : "No models detected via API."}
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* General Settings */}
                <GlassPanel intensity="low" className="p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-blue-400 mb-2">
                        <Monitor className="w-5 h-5" />
                        <h3 className="text-sm font-medium uppercase tracking-wider">General</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-white/80">Interface Language</label>
                            <CosmicDropdown
                                items={[
                                    { label: "English (US)", value: "en" },
                                    { label: "Français (FR)", value: "fr" },
                                    { label: "Español (ES)", value: "es" },
                                ]}
                                onSelect={() => { }}
                                label="English (US)"
                                icon={Globe}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm text-white/80">Theme Preset</label>
                            <CosmicDropdown
                                items={themes.length > 0 ? themes.map(t => ({ label: t.name, value: t.id })) : [{ label: "Default", value: "default" }]}
                                onSelect={() => { }}
                                label={themes.find(t => t.id === "cosmic_dark")?.name || "Cosmic Dark"}
                            />
                        </div>
                    </div>
                </GlassPanel>

                {/* Time & Date */}
                <GlassPanel intensity="low" className="p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-green-400 mb-2">
                        <Clock className="w-5 h-5" />
                        <h3 className="text-sm font-medium uppercase tracking-wider">Localization</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-white/80">Time Format</label>
                            <div className="flex gap-2">
                                <CosmicButton
                                    onClick={() => updateSetting('timeFormat', '24h')}
                                    variant={settings.timeFormat === '24h' ? 'glow' : 'ghost'}
                                    className="text-xs px-3 py-1.5 min-w-[60px]"
                                >
                                    24H
                                </CosmicButton>
                                <CosmicButton
                                    onClick={() => updateSetting('timeFormat', '12h')}
                                    variant={settings.timeFormat === '12h' ? 'glow' : 'ghost'}
                                    className="text-xs px-3 py-1.5 min-w-[60px]"
                                >
                                    12H
                                </CosmicButton>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm text-white/80">Date Format</label>
                            <CosmicDropdown
                                items={[
                                    { label: "DD/MM/YYYY", value: "dmy" },
                                    { label: "MM/DD/YYYY", value: "mdy" },
                                    { label: "YYYY/MM/DD", value: "ymd" },
                                ]}
                                onSelect={() => { }}
                                label="DD/MM/YYYY"
                                icon={Globe}
                            />
                        </div>
                    </div>
                </GlassPanel>

                {/* System */}
                <GlassPanel intensity="low" className="p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-purple-400 mb-2">
                        <Shield className="w-5 h-5" />
                        <h3 className="text-sm font-medium uppercase tracking-wider">System</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="w-4 h-4 text-white/40" />
                                <label className="text-sm text-white/80">Notifications</label>
                            </div>
                            <div className="w-10 h-5 rounded-full bg-blue-500/20 border border-blue-500/50 relative cursor-pointer">
                                <div className="absolute right-1 top-0.5 w-3.5 h-3.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Volume2 className="w-4 h-4 text-white/40" />
                                <label className="text-sm text-white/80">Sound Effects</label>
                            </div>
                            <div className="w-10 h-5 rounded-full bg-blue-500/20 border border-blue-500/50 relative cursor-pointer">
                                <div className="absolute right-1 top-0.5 w-3.5 h-3.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* Data Management */}
                <GlassPanel intensity="low" className="p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-red-400 mb-2">
                        <HardDrive className="w-5 h-5" />
                        <h3 className="text-sm font-medium uppercase tracking-wider">Data</h3>
                    </div>

                    <div className="space-y-4 pt-2">
                        <CosmicButton
                            onClick={handleClearCache}
                            variant="ghost"
                            className="w-full justify-between group hover:bg-red-500/5 hover:border-red-500/20 hover:text-red-400"
                        >
                            <span className="flex items-center gap-2">
                                <Trash2 className="w-4 h-4 opacity-50" />
                                Clear App Cache
                            </span>
                            <span className="text-xs opacity-40 group-hover:opacity-60">Purge Local Storage</span>
                        </CosmicButton>

                        <CosmicButton
                            onClick={handleExport}
                            variant="ghost"
                            className="w-full justify-between group"
                        >
                            <span className="flex items-center gap-2">
                                <Download className="w-4 h-4 opacity-50" />
                                Export Configuration
                            </span>
                            <span className="text-xs opacity-40 group-hover:opacity-60">JSON</span>
                        </CosmicButton>
                    </div>
                </GlassPanel>

            </div>
        </div>
    );
}
