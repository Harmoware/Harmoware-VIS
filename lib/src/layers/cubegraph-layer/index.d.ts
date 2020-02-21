import { LayerProps, GridCellLayer, CompositeLayer } from 'deck.gl';
import { MovedData, DepotsData } from '../../types';
interface Props extends LayerProps {
    optionData: MovedData[] | DepotsData[];
    cellSize?: number;
    coverage?: number;
    elevationScale?: number;
    extruded?: boolean;
    getPosition?: (x: MovedData | DepotsData) => number[];
    getCubeColor?: (x: MovedData | DepotsData) => number[][];
    getCubeElevation?: (x: MovedData | DepotsData) => number[];
    getRadius?: (x: MovedData | DepotsData) => number;
    stacking1?: boolean;
    stacking2?: boolean;
    optionCentering?: boolean;
}
export default class CubeGraphLayer extends CompositeLayer<Props> {
    static defaultProps: Props;
    static layerName: string;
    renderLayers(): GridCellLayer<{
        id: string;
        data: any[];
        pickable: boolean;
        opacity: number;
        cellSize: number;
        elevationScale: number;
        getPosition: (x: any) => any;
        getElevation: (x: any) => any;
        getFillColor: (x: any) => any;
        offset: number[];
    }, {}>;
}
export {};
