import { useState } from "react";
import ScheduleView from "./ScheduleView.tsx";
import RouteFinder from "./RouteFinder.tsx";
import RoutesOverview from "./RoutesOverview.tsx";
import Map from "./Map.tsx";

export default function App() {
    const [activePanel, setActivePanel] = useState<null | string>(null);

    return (
        <div className="w-screen h-screen relative overflow-hidden">

            <nav className="absolute top-0 left-0 right-0 flex gap-4 p-4 bg-black/60 backdrop-blur-md text-white z-30">
                <button onClick={() => setActivePanel("rozklad")}>Rozkład jazdy</button>
                <button onClick={() => setActivePanel("trasa")}>Znajdź trasę</button>
                <button onClick={() => setActivePanel("przeglad")}>Przegląd tras</button>
                <button onClick={() => setActivePanel(null)}>Zamknij</button>
            </nav>

            {activePanel && (
                <div className="absolute top-0 right-0 h-full w-96 bg-white/95 backdrop-blur-xl shadow-2xl z-40 p-4 overflow-y-auto transition-transform duration-300">
                    {activePanel === "rozklad" && <ScheduleView />}
                    {activePanel === "trasa" && <RouteFinder />}
                    {activePanel === "przeglad" && <RoutesOverview />}
                </div>
            )}

            <Map />
        </div>
    );
}