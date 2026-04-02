import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import map from "./assets/schemat_tram.svg";

function Map() {
    return (
        <div className="fixed inset-0 z-0 bg-gray-300 overflow-hidden">
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={4}
                centerOnInit
                wheel={{ step: 0.05 }}
                doubleClick={{ disabled: true }}
            >
                <TransformComponent
                    wrapperClass="w-full h-full"
                    contentClass="w-full h-full flex items-center justify-center"
                >
                    <img
                        src={map}
                        alt="map"
                        className="max-w-none select-none"
                        draggable={false}
                    />
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}

export default Map;