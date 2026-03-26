import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function Map() {
    return (
        <div className="map-container" style={{ width: "100%", height: "100%" }}>
            <TransformWrapper
                initialScale={0.9}
                minScale={0.5}
                maxScale={3}
                wheel={{ step: 0.1 }} // scroll zoom
                doubleClick={{ disabled: true }} // optional
                pinch={{ step: 5 }} // pinch zoom on touch devices
                limitToBounds={true}
                boundsPadding={0.1}// optional: allow panning outside container
            >
                {() => (
                    <>
                        <TransformComponent>
                            <img
                                src="/src/assets/schemat_tram.svg"
                                alt="map"
                                 style={{ width: "100%", height: "100%", userSelect: "none", pointerEvents: "none" }}
                            />
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}

export default Map;