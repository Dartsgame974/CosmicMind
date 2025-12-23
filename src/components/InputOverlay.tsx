import { useState, useEffect, useRef } from "react";
import { GlassPanel } from "./GlassPanel";
import { CosmicButton } from "./CosmicButton";

interface InputOverlayProps {
    isOpen: boolean;
    title: string;
    placeholder?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
}

export function InputOverlay({ isOpen, title, placeholder, onConfirm, onCancel }: InputOverlayProps) {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setValue("");
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-fade-in">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onCancel}
            />

            <GlassPanel intensity="high" className="relative w-full max-w-md p-6 flex flex-col gap-4 border-white/20 shadow-2xl">
                <h3 className="text-lg font-medium tracking-tight text-white">{title}</h3>

                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && value.trim()) onConfirm(value);
                        if (e.key === "Escape") onCancel();
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-light"
                />

                <div className="flex justify-end gap-3 mt-2">
                    <CosmicButton onClick={onCancel}>Cancel</CosmicButton>
                    <CosmicButton
                        variant="glow"
                        onClick={() => value.trim() && onConfirm(value)}
                        disabled={!value.trim()}
                    >
                        Create
                    </CosmicButton>
                </div>
            </GlassPanel>
        </div>
    );
}
