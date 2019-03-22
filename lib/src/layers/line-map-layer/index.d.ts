import { LayerProps, CompositeLayer, LineLayer } from 'deck.gl';
import { LineMapData, LineData } from '../../types';
interface Props extends LayerProps {
    layerOpacity?: number;
    linemapData: LineMapData[];
    getStrokeWidth?: any;
    getColor?: (x: any) => number[];
}
export default class LineMapLayer extends CompositeLayer<Props> {
    static defaultProps: {
        layerOpacity: number;
        getStrokeWidth: (x: any) => any;
        getColor: (x: LineData) => number[];
    };
    static layerName: string;
    renderLayers(): LineLayer<{
        id: string;
        data: LineMapData[];
        coordinateSystem: number;
        getSourcePosition: (x: LineData) => number[];
        getTargetPosition: (x: LineData) => number[];
        getColor: (x: any) => number[];
        opacity: number;
        pickable: true;
        getStrokeWidth: any;
    }, {}>[];
}
export {};
