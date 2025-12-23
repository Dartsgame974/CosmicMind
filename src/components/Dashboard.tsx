import { useState, useEffect } from "react";
import { GlassPanel } from "./GlassPanel";
import { CosmicButton } from "./CosmicButton";
import { ArrowRight, Cpu, Activity, Database, Clock, Star, Play } from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import { useLocale } from "../hooks/useLocale";

export function Dashboard() {
    const { t } = useLocale();
    const [time, setTime] = useState(new Date());
    const [stats, setStats] = useState({ cpu: 0, memory: 0 });
    const { settings } = useSettings();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/system");
                const data = await res.json();
                if (data.cpu) {
                    const totalMem = data.memory.total;
                    const usedMem = data.memory.used;
                    const memPercent = Math.round((usedMem / totalMem) * 100);
                    setStats({ cpu: data.cpu.load, memory: memPercent });
                }
            } catch (e) {
                console.error("Stats fetch error", e);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 2000);
        return () => clearInterval(interval);
    }, []);

    const mockFavorites = [
        { title: "Unity Particle System", type: "Tutorial" },
        { title: "Cyberpunk Ambience", type: "Audio" },
        { title: "React Server Components", type: "Article" }
    ];

    return (
        <div className="p-8 pt-12 pl-24 pb-28 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto animate-fade-in">

            {/* Welcome Panel with Clock */}
            <GlassPanel className="col-span-1 md:col-span-2 lg:col-span-3 p-8 relative overflow-hidden group flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

                <div className="relative z-10">
                    <h1 className="text-3xl font-light tracking-tight mb-2">
                        {t('dashboard.welcome')}
                    </h1>
                    <p className="text-white/60 max-w-xl font-light leading-relaxed">
                        {t('dashboard.subtitle')}
                    </p>
                    <div className="mt-6 flex gap-4">
                        <CosmicButton variant="glow" label={t('dashboard.initiate_scan')} />
                        <CosmicButton variant="ghost" label={t('dashboard.system_status')} />
                    </div>
                </div>

                <div className="flex flex-col items-end text-right relative z-10">
                    <div className="text-5xl font-extralight tracking-tighter tabular-nums text-white/90">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: settings.timeFormat === '12h' })}
                    </div >
                    <div className="text-white/40 text-sm uppercase tracking-widest font-medium mt-1 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                </div >
            </GlassPanel >

            {/* System Stats (CPU/GPU) */}
            < GlassPanel className="p-6 flex flex-col gap-6 hover:border-blue-500/30 transition-colors group" >
                <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('dashboard.cpu_load')}</span>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-white/60">{t('dashboard.cpu_load')}</span>
                            <span className="text-blue-400">{stats.cpu}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500/60 shadow-[0_0_10px_rgba(59,130,246,0.4)] transition-all duration-500" style={{ width: `${stats.cpu}%` }} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-white/60">{t('dashboard.memory_usage')}</span>
                            <span className="text-purple-400">{stats.memory}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all duration-500" style={{ width: `${stats.memory}%` }} />
                        </div>
                    </div>
                </div>
            </GlassPanel >

            {/* Database Stats */}
            < GlassPanel className="p-6 flex flex-col gap-4 hover:border-green-500/30 transition-colors group" >
                <div className="flex justify-between items-start">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                        <Database className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('dashboard.database_label')}</span>
                </div>

                <div className="mt-2">
                    <div className="text-4xl font-light tracking-tighter text-white">124</div>
                    <div className="text-white/40 text-xs mt-1">{t('dashboard.total_content_items')}</div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex gap-4 text-xs text-white/50">
                    <div><span className="text-green-400 font-bold">84</span> {t('dashboard.active')}</div>
                    <div><span className="text-white/30 font-bold">40</span> {t('dashboard.archived')}</div>
                </div>
            </GlassPanel >

            {/* Recent Favorites -> Starred Items */}
            < GlassPanel className="p-6 flex flex-col gap-4 hover:border-yellow-500/30 transition-colors group relative overflow-hidden" >
                <div className="flex justify-between items-start z-10">
                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                        <Star className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{t('dashboard.starred_items')}</span>
                </div>

                <div className="space-y-3 mt-1 z-10">
                    {mockFavorites.map((fav, i) => (
                        <div key={i} className="flex items-center justify-between group/item cursor-pointer">
                            <div className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-white/20 group-hover/item:text-white group-hover/item:bg-white/10 transition-colors">
                                    <Play className="w-3 h-3 fill-current" />
                                </div>
                                <div>
                                    <div className="text-sm text-white/80 group-hover/item:text-white transition-colors line-clamp-1">{fav.title}</div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-wider">{fav.type}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Decorative background glow */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-500/5 blur-[50px] pointer-events-none" />
            </GlassPanel >

            {/* Energy/Details (Refined Padding) */}
            < GlassPanel className="p-6 flex flex-col gap-4 hover:border-red-500/30 transition-colors cursor-pointer group col-span-1 md:col-span-2 lg:col-span-3" >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-white">{t('dashboard.system_diagnostics')}</h3>
                            <p className="text-xs text-white/40">All subsystems operating within normal parameters.</p>
                        </div>
                    </div>

                    {/* Fixed Padding Button */}
                    <CosmicButton variant="ghost" className="gap-2 text-xs hover:bg-white/5 px-4 py-2">
                        {t('dashboard.full_report')} <ArrowRight className="w-3 h-3" />
                    </CosmicButton>
                </div>
            </GlassPanel >

        </div >
    );
}
