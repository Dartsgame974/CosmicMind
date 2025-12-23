import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { SearchBar } from "./components/SearchBar";
import { Dashboard } from "./components/Dashboard";
import { CardsView } from "./components/CardsView";
import { ToastProvider } from "./components/ToastContext";

import { SettingsView } from "./components/SettingsView";

function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "cards" | "settings">("dashboard");

  return (
    <ToastProvider>
      <div className="min-h-screen w-full bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
        {/* Background Ambience */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
        </div>

        {/* Main Layout */}
        <div className="relative z-10 flex">
          <Sidebar currentView={currentView} onNavigate={setCurrentView} />
          <main className="flex-1">
            {currentView === "dashboard" && <Dashboard />}
            {currentView === "cards" && <CardsView />}
            {currentView === "settings" && <SettingsView />}
          </main>
        </div>

        <SearchBar />
      </div>
    </ToastProvider>
  );
}

export default App;
