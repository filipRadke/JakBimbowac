import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import map from "./assets/schemat_tram.svg";

function Map() {
    return (
        <div style={{ width: "100%", height: "100%", background: "#ffffff", overflow: "hidden" }}>
            <TransformWrapper
                initialScale={1}
                minScale={0.4}
                maxScale={5}
                centerOnInit
                wheel={{ step: 0.06 }}
                doubleClick={{ disabled: true }}
                pinch={{ step: 5 }}
            >
                {({ zoomIn, zoomOut }) => (
                    <>
                        <TransformComponent
                            wrapperStyle={{ width: "100%", height: "100%" }}
                            contentStyle={{display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <img
                                src={map}
                                alt="Schemat sieci tramwajowej Poznań"
                                style={{ maxWidth: "100%", maxHeight: "100%", userSelect: "none", pointerEvents: "none" }}
                                draggable={false}
                            />
                        </TransformComponent>

                        {/* Zoom controls */}
                        <div style={{
                            position: "absolute", bottom: 20, right: 20,
                            display: "flex", flexDirection: "column", gap: 4, zIndex: 10,
                        }}>
                            <button onClick={() => zoomIn()} style={zoomBtnStyle} title="Przybliż">+</button>
                            <button onClick={() => zoomOut()} style={zoomBtnStyle} title="Oddal">−</button>
                        </div>

                        {/* Attribution */}
                        <div style={{
                            position: "absolute", bottom: 20, left: 20,
                            background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
                            border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8,
                            padding: "5px 10px", fontSize: 11, color: "#555",
                            display: "flex", alignItems: "center", gap: 6, zIndex: 10,
                        }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1d9e75", flexShrink: 0, display: "inline-block" }} />
                            ZTM Poznań · aktualizacja 22.11.2025
                        </div>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}

const zoomBtnStyle: React.CSSProperties = {
    width: 32, height: 32,
    background: "rgba(255,255,255,0.95)",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 8,
    fontSize: 18, fontWeight: 400,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    color: "#333",
    lineHeight: 1,
};

export default Map;
