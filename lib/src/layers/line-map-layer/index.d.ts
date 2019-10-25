import { LayerProps, CompositeLayer, LineLayer } from 'deck.gl';
import { LineMapData, LineData } from '../../types';
interface Props extends LayerProps {
    linemapData: LineMapData[];
    visible?: boolean;
    opacity?: number;
    pickable?: boolean;
    getSourcePosition?: (x: any) => number[];
    getTargetPosition?: (x: any) => number[];
    getColor?: (x: any) => number[];
    getWidth?: (x: any) => number;
}
export default class LineMapLayer extends CompositeLayer<Props> {
    static defaultProps: {
        opacity: number;
        pickable: boolean;
        getSourcePosition: (x: LineData) => number[];
        getTargetPosition: (x: LineData) => number[];
        getWidth: (x: any) => any;
        getColor: (x: LineData) => number[];
    };
    static layerName: string;
    renderLayers(): LineLayer<{
        id: string;
        data: LineMapData[];
        visible: true;
        opacity: number;
        pickable: boolean;
        getSourcePosition: (x: any) => number[];
        getTargetPosition: (x: any) => number[];
        getColor: (x: any) => number[];
        getWidth: (x: any) => number;
        widthUnits: string;
        widthMinPixels: number;
    }, {}>;
}
export {};
