import { LayerProps, CompositeLayer } from 'deck.gl';
import { DepotsData, DataOption } from '../../types';
interface Props extends LayerProps {
    layerOpacity?: number;
    depotsData: DepotsData[];
    getColor?: (x: DataOption) => number[];
    getRadius?: (x: DataOption) => number;
}
export default class FixedPointLayer extends CompositeLayer<Props> {
    static defaultProps: {
        layerOpacity: number;
        getColor: (x: DataOption) => number[];
    };
    static layerName: string;
    renderLayers(): any[];
}
export {};
