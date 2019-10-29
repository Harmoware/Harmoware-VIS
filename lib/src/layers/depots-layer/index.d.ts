import { LayerProps, CompositeLayer, ScatterplotLayer } from 'deck.gl';
import CubeGraphLayer from '../cubegraph-layer';
import { DepotsData, Position, Radius, DataOption } from '../../types';
interface Props extends LayerProps {
    layerRadiusScale?: number;
    layerOpacity?: number;
    depotsData: DepotsData[];
    optionVisible?: boolean;
    optionChange?: boolean;
    optionOpacity?: number;
    optionCellSize?: number;
    optionElevationScale?: number;
    getColor?: (x: any) => number[];
    getRadius?: (x: any) => number;
    getCubeColor?: (x: DataOption) => number[][];
    getCubeElevation?: (x: DataOption) => number[];
}
export default class DepotsLayer extends CompositeLayer<Props> {
    constructor(props: Props);
    static layerName: string;
    static defaultProps: {
        layerRadiusScale: number;
        layerOpacity: number;
        optionVisible: boolean;
        optionChange: boolean;
        optionOpacity: number;
        optionCellSize: number;
        optionElevationScale: number;
        pickable: boolean;
        getColor: (x: DataOption) => number[];
        getRadius: (x: Radius) => number;
        getCubeColor: (x: DataOption) => number[] | number[][];
        getCubeElevation: (x: DataOption) => number[];
    };
    renderLayers(): (CubeGraphLayer | ScatterplotLayer<{
        id: string;
        data: DepotsData[];
        radiusScale: number;
        getPosition: (x: Position) => number[];
        getFillColor: (x: any) => number[];
        getRadius: (x: any) => number;
        opacity: number;
        pickable: boolean;
        radiusMinPixels: number;
    }, {}>)[];
}
export {};
