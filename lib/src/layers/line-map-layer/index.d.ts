import { LayerProps, CompositeLayer, LineLayer } from 'deck.gl';
import { LineMapData, LineData } from '../../types';
interface Props extends LayerProps {
    layerOpacity?: number;
    linemapData: LineMapData[];
    strokeWidth?: number;
    getColor?: (x: any) => number[];
}
export default class LineMapLayer extends CompositeLayer<Props> {
    static defaultProps: {
        layerOpacity: number;
        strokeWidth: number;
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
        strokeWidth: number;
    }, {}>[];
}
export {};
