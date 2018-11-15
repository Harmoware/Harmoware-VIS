import { CompositeLayer } from 'deck.gl';
import FrontScatterplotLayer from '../front-scatterplot-layer';
import { DepotsData, DataOption } from '../../types';
interface Props {
    layerOpacity: number;
    depotsData: Array<DepotsData>;
    getColor: (x: any) => Array<number>;
    getRadius: (x: any) => number;
}
export default class FixedPointLayer extends CompositeLayer<Props> {
    static defaultProps: {
        layerOpacity: number;
        getColor: (x: DataOption) => number[];
    };
    static layerName: string;
    renderLayers(): FrontScatterplotLayer[];
}
export {};
