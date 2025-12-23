import React, { createContext, useContext, useState, useCallback } from "react";
import { GlassPanel } from "./GlassPanel";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: number;
    title: string;
    message?: string;
    type: ToastType;
}

interface ToastContextValue {
    show: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const show = useCallback(({ title, message, type = "info" }: Omit<Toast, "id">) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, title, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const remove = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ show }}>
            {children}

            {/* Toast Container - Bottom Right */}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <GlassPanel
                        key={toast.id}
                        intensity="high"
                        className={cn(
                            "pointer-events-auto min-w-[300px] p-4 flex gap-3 items-start animate-fade-in translate-y-0 opacity-100 transition-all duration-300",
                            "border-l-4",
                            toast.type === "success" && "border-l-green-500",
                            toast.type === "error" && "border-l-red-500",
                            toast.type === "info" && "border-l-blue-500"
                        )}
                    >
                        <div className="mt-0.5">
                            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-400" />}
                            {toast.type === "info" && <Info className="w-5 h-5 text-blue-400" />}
                        </div>

                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-white">{toast.title}</h4>
                            {toast.message && <p className="text-xs text-white/60 mt-1">{toast.message}</p>}
                        </div>

                        <button
                            onClick={() => remove(toast.id)}
                            className="text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </GlassPanel>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
}
