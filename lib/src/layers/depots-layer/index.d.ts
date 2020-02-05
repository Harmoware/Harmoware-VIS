import { LayerProps, CompositeLayer, ScatterplotLayer, SimpleMeshLayer } from 'deck.gl';
import { IcoSphereGeometry } from 'luma.gl';
import CubeGraphLayer from '../cubegraph-layer';
import { DepotsData } from '../../types';
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
    getColor?: (x: DepotsData) => number[];
    getRadius?: (x: DepotsData) => number;
    getCubeColor?: (x: DepotsData) => number[][];
    getCubeElevation?: (x: DepotsData) => number[];
    mesh?: any;
    meshSizeScale?: number;
    getOrientation?: (x: DepotsData) => number[];
    getScale?: (x: DepotsData) => number[];
    getTranslation?: (x: DepotsData) => number[];
}
export default class DepotsLayer extends CompositeLayer<Props> {
    constructor(props: Props);
    static layerName: string;
    static defaultProps: {
        id: string;
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
        getColor: (x: DepotsData) => (number | number[])[];
        getRadius: (x: DepotsData) => number;
        getCubeColor: (x: DepotsData) => number[] | (number | number[])[][];
        getCubeElevation: (x: DepotsData) => number[];
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
        getPosition: (x: DepotsData) => number[];
        getFillColor: (x: DepotsData) => number[];
        getRadius: (x: DepotsData) => number;
        opacity: number;
        pickable: boolean;
        radiusMinPixels: number;
    }, {}> | SimpleMeshLayer<{
        id: string;
        data: DepotsData[];
        mesh: any;
        sizeScale: number;
        getPosition: (x: DepotsData) => number[];
        getColor: (x: DepotsData) => number[];
        getOrientation: (x: DepotsData) => number[];
        getScale: (x: DepotsData) => number[];
        getTranslation: (x: DepotsData) => number[];
        opacity: number;
        pickable: boolean;
    }, {}>)[];
}
export {};
