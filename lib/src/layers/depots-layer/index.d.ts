import { LayerProps, CompositeLayer, ScatterplotLayer, SimpleMeshLayer } from 'deck.gl';
import { IcoSphereGeometry } from 'luma.gl';
import CubeGraphLayer from '../cubegraph-layer';
import { DepotsData, Position, Radius, DataOption } from '../../types';
interface Props extends LayerProps {
    iconChange?: boolean;
    layerRadiusScale?: number;
    layerOpacity?: number;
    depotsData: DepotsData[];
    optionVisible?: boolean;
    optionChange?: boolean;
    optionOpacity?: number;
    optionCellSize?: number;
    optionElevationScale?: number;
    optionCentering?: boolean;
    getColor?: (x: any) => number[];
    getRadius?: (x: any) => number;
    getCubeColor?: (x: DataOption) => number[][];
    getCubeElevation?: (x: DataOption) => number[];
    mesh?: any;
    meshSizeScale?: number;
    getOrientation?: (x: DataOption) => number[];
    getScale?: (x: DataOption) => number[];
    getTranslation?: (x: DataOption) => number[];
}
export default class DepotsLayer extends CompositeLayer<Props> {
    constructor(props: Props);
    static layerName: string;
    static defaultProps: {
        iconChange: boolean;
        layerRadiusScale: number;
        layerOpacity: number;
        optionVisible: boolean;
        optionChange: boolean;
        optionOpacity: number;
        optionCellSize: number;
        optionElevationScale: number;
        optionCentering: boolean;
        pickable: boolean;
        getColor: (x: DataOption) => number[];
        getRadius: (x: Radius) => number;
        getCubeColor: (x: DataOption) => number[] | number[][];
        getCubeElevation: (x: DataOption) => number[];
        mesh: IcoSphereGeometry;
        meshSizeScale: number;
        getOrientation: number[];
        getScale: number[];
        getTranslation: number[];
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
    }, {}> | SimpleMeshLayer<{
        id: string;
        data: DepotsData[];
        mesh: any;
        sizeScale: number;
        getPosition: (x: Position) => number[];
        getColor: (x: any) => number[];
        getOrientation: (x: DataOption) => number[];
        getScale: (x: DataOption) => number[];
        getTranslation: (x: DataOption) => number[];
        opacity: number;
        pickable: boolean;
    }, {}>)[];
}
export {};
