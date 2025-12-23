import { useState, useEffect } from "react";
import { useSettings } from "./useSettings";

interface Locale {
    id: string;
    name: string;
}

export function useLocale() {
    const { settings, updateSetting } = useSettings();
    const [translations, setTranslations] = useState<any>({});
    const [availableLocales, setAvailableLocales] = useState<Locale[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch available locales
    useEffect(() => {
        fetch('http://localhost:3001/api/locales')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch locales");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setAvailableLocales(data);
                } else {
                    console.error("Locales data is not an array:", data);
                    setAvailableLocales([]);
                }
            })
            .catch(err => {
                console.error("Failed to load locales list", err);
                setAvailableLocales([]);
            });
    }, []);

    // Fetch translations for current language
    useEffect(() => {
        const lang = settings.language || 'en';
        setIsLoading(true);
        fetch(`http://localhost:3001/api/locales/${lang}`)
            .then(res => {
                if (!res.ok) throw new Error("Locale not found");
                return res.json();
            })
            .then(data => {
                setTranslations(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load translations", err);
                setIsLoading(false);
            });
    }, [settings.language]);

    // Helper to get nested translation keys (e.g., "dashboard.welcome")
    const t = (key: string) => {
        const keys = key.split('.');
        let value = translations;
        for (const k of keys) {
            value = value?.[k];
            if (!value) break;
        }
        return value || key; // Return key if translation missing
    };

    return {
        t,
        currentLocale: settings.language || 'en',
        availableLocales,
        changeLocale: (lang: string) => updateSetting('language', lang),
        isLoading
    };
}
