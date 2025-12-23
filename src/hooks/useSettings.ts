import { useState, useEffect } from 'react';

export interface AppSettings {
    aiModel: string;
    timeFormat: '12h' | '24h';
    language: string;
    enableYoutubeMetadata: boolean;
    youtubeApiKey: string;
}

const DEFAULT_SETTINGS: AppSettings = {
    aiModel: "qwen2.5:7b-instruct-q4_K_M",
    timeFormat: '24h',
    language: 'en',
    enableYoutubeMetadata: false,
    youtubeApiKey: "",
};

export function useSettings() {
    const [settings, setSettings] = useState<AppSettings>(() => {
        try {
            const stored = localStorage.getItem('cosmic-settings');
            return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
        } catch (e) {
            console.error("Failed to parse settings", e);
            return DEFAULT_SETTINGS;
        }
    });

    useEffect(() => {
        localStorage.setItem('cosmic-settings', JSON.stringify(settings));
    }, [settings]);

    const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return { settings, updateSetting };
}
