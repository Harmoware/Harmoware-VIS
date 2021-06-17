import { LayerProps, CompositeLayer } from '@deck.gl/core';
import { IcoSphereGeometry } from '@luma.gl/engine';
import { DepotsData, LayerTypes, IconDesignation } from '../../types';
interface Props extends LayerProps {
    iconlayer?: LayerTypes;
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
    optionDisplayPosition?: number;
    iconDesignations?: IconDesignation[];
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
        optionDisplayPosition: number;
        pickable: boolean;
        getColor: (x: DepotsData) => (number | number[])[];
        getRadius: (x: DepotsData) => number;
        getCubeColor: (x: DepotsData) => (number | number[])[][];
        getCubeElevation: (x: DepotsData) => number[];
        mesh: IcoSphereGeometry;
        meshSizeScale: number;
        getOrientation: number[];
        getScale: number[];
        getTranslation: number[];
    };
    getIconLayer(): any[];
    renderLayers(): any[];
}
export {};
