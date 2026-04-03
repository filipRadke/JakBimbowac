import { useState } from "react";
import Map from "./Map";
import "./App.css";

type Panel = "rozklad" | "trasa" | "przeglad" | null;

export default function App() {
    const [activePanel, setActivePanel] = useState<Panel>(null);

    const toggle = (panel: Panel) => {
        setActivePanel(prev => prev === panel ? null : panel);
    };

    const navItems: { id: Panel; label: string; sublabel: string; icon: string }[] = [
        { id: "rozklad", label: "Rozkład jazdy", sublabel: "odjazdy z przystanku", icon: "schedule" },
        { id: "trasa",   label: "Znajdź trasę",  sublabel: "wyznacz połączenie",  icon: "route"    },
        { id: "przeglad",label: "Przegląd tras", sublabel: "linie tramwajowe",    icon: "lines"    },
    ];

    return (
        <div className="app-root">
            {/* Top bar */}
            <header className="topbar">
                <div className="topbar-brand">
                    <div className="brand-mark">
                        <TramIcon />
                    </div>
                    <span className="brand-name">Tramwaje</span>
                    <span className="brand-city">Poznań · ZTM</span>
                </div>
                <nav className="topbar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-btn${activePanel === item.id ? " active" : ""}`}
                            onClick={() => toggle(item.id)}
                        >
                            <NavIcon type={item.icon} />
                            <span className="nav-btn-label">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </header>

            {/* Map always in background */}
            <main className="map-area">
                <Map />
            </main>

            {/* Side panel */}
            {activePanel && (
                <aside className="side-panel">
                    <div className="side-panel-header">
                        <span className="side-panel-title">
                            {navItems.find(n => n.id === activePanel)?.label}
                        </span>
                        <button className="close-btn" onClick={() => setActivePanel(null)}>
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="side-panel-body">
                        {activePanel === "rozklad"  && <ScheduleView />}
                        {activePanel === "trasa"    && <RouteFinder />}
                        {activePanel === "przeglad" && <RoutesOverview />}
                    </div>
                </aside>
            )}

            {/* Mobile bottom nav */}
            <nav className="bottom-nav">
                <button className={`bnav-item${activePanel === null ? " active" : ""}`} onClick={() => setActivePanel(null)}>
                    <MapIcon />
                    <span>Mapa</span>
                </button>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`bnav-item${activePanel === item.id ? " active" : ""}`}
                        onClick={() => toggle(item.id)}
                    >
                        <NavIcon type={item.icon} />
                        <span>{item.id === "rozklad" ? "Rozkład" : item.id === "trasa" ? "Trasa" : "Linie"}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}

function TramIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="16" height="14" rx="3"/>
            <path d="M4 10h16"/>
            <path d="M8 19l-2 2M16 19l2 2M8 19h8"/>
        </svg>
    );
}

function MapIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            <line x1="8" y1="2" x2="8" y2="18"/>
            <line x1="16" y1="6" x2="16" y2="22"/>
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    );
}

function NavIcon({ type }: { type: string }) {
    if (type === "schedule") return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    );
    if (type === "route") return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="3"/><path d="M12 2C8.69 2 6 4.69 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6z"/>
        </svg>
    );
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
    );
}
