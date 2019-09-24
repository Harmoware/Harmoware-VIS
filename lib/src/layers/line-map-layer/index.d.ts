import { LayerProps, CompositeLayer, LineLayer } from 'deck.gl';
import { LineMapData, LineData, Viewport } from '../../types';
interface Props extends LayerProps {
    viewport: Viewport;
    linemapData: LineMapData[];
    visible?: boolean;
    opacity?: number;
    pickable?: boolean;
    getSourcePosition?: (x: any) => number[];
    getTargetPosition?: (x: any) => number[];
    getColor?: (x: any) => number[];
    getStrokeWidth?: (x: any) => number;
}
export default class LineMapLayer extends CompositeLayer<Props> {
    static defaultProps: {
        opacity: number;
        pickable: boolean;
        getSourcePosition: (x: LineData) => number[];
        getTargetPosition: (x: LineData) => number[];
        getStrokeWidth: (x: any) => any;
        getColor: (x: LineData) => number[];
    };
    static layerName: string;
    shouldUpdateState({ changeFlags: { viewportChanged } }: {
        changeFlags: {
            viewportChanged: any;
        };
    }): any;
    renderLayers(): LineLayer<{
        id: string;
        data: LineMapData[];
        visible: true;
        opacity: number;
        pickable: boolean;
        getSourcePosition: (x: any) => number[];
        getTargetPosition: (x: any) => number[];
        getColor: (x: any) => number[];
        getStrokeWidth: (x: any) => number;
        updateTriggers: {
            getStrokeWidth: Viewport;
        };
    }, {}>[];
}
export {};
