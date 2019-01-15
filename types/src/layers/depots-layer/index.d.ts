import { LayerProps, CompositeLayer, ScatterplotLayer, GridCellLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import { DepotsData, LightSettings, Position, Radius, DataOption } from '../../types';
interface Props extends LayerProps {
    layerRadiusScale?: number;
    layerOpacity?: number;
    depotsData: DepotsData[];
    optionVisible?: boolean;
    optionChange?: boolean;
    optionOpacity?: number;
    optionCellSize?: number;
    optionElevationScale?: number;
    lightSettings: LightSettings;
    getColor?: (x: any) => number[];
    getRadius?: (x: any) => number;
    getColor1?: (x: any) => number[];
    getColor2?: (x: any) => number[];
    getColor3?: (x: any) => number[];
    getColor4?: (x: any) => number[];
    getElevation1?: (x: any) => number;
    getElevation2?: (x: any) => number;
    getElevation3?: (x: any) => number;
    getElevation4?: (x: any) => number;
    i18n?: {
        error: string;
    };
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
        getColor: (x: DataOption) => number[];
        getColor1: (x: DataOption) => number | number[];
        getColor2: (x: DataOption) => number | number[];
        getColor3: (x: DataOption) => number | number[];
        getColor4: (x: DataOption) => number | number[];
        getElevation1: (x: DataOption) => number;
        getElevation2: (x: DataOption) => number;
        getElevation3: (x: DataOption) => number;
        getElevation4: (x: DataOption) => number;
        i18n: {
            error: string;
        };
    };
    renderLayers(): (CubeiconLayer | ScatterplotLayer<{
        id: string;
        data: DepotsData[];
        radiusScale: number;
        getPosition: (x: Position) => number[];
        getColor: (x: any) => number[];
        getRadius: (x: any) => number;
        opacity: number;
        pickable: true;
        radiusMinPixels: number;
    }, {}> | GridCellLayer<{
        id: string;
        data: DepotsData[];
        visible: boolean;
        getPosition: (x: Position & Radius) => number[];
        getColor: (x: any) => number[];
        getElevation: (x: any) => number;
        opacity: number;
        pickable: true;
        cellSize: number;
        elevationScale: number;
        lightSettings: LightSettings;
    }, {}>)[];
}
export {};
