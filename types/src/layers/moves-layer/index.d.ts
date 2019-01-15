import { LayerProps, CompositeLayer, ScatterplotLayer, GridCellLayer, LineLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import EnhancedArcLayer from '../enhanced-arc-layer';
import { pickParams } from '../../library';
import { RoutePaths, MovedData, Movesbase, ClickedObject, LightSettings, Position, Radius, DataOption } from '../../types';
import * as Actions from '../../actions';
interface Props extends LayerProps {
    routePaths: RoutePaths[];
    layerRadiusScale?: number;
    layerOpacity?: number;
    movedData: MovedData[];
    movesbase: Movesbase[];
    clickedObject: null | ClickedObject[];
    actions: typeof Actions;
    optionVisible?: boolean;
    optionChange?: boolean;
    optionOpacity?: number;
    optionCellSize?: number;
    optionElevationScale?: number;
    lightSettings: LightSettings;
    getColor?: (x: DataOption) => number[];
    getRadius?: (x: Radius) => number;
    getColor1?: (x: DataOption) => number[];
    getColor2?: (x: DataOption) => number[];
    getColor3?: (x: DataOption) => number[];
    getColor4?: (x: DataOption) => number[];
    getElevation1?: (x: DataOption) => number;
    getElevation2?: (x: DataOption) => number;
    getElevation3?: (x: DataOption) => number;
    getElevation4?: (x: DataOption) => number;
    getCubeColor?: (x: DataOption) => number[][];
    getCubeElevation?: (x: DataOption) => number[];
    i18n?: {
        error: string;
    };
}
export default class MovesLayer extends CompositeLayer<Props> {
    constructor(props: Props);
    static defaultProps: {
        layerRadiusScale: number;
        layerOpacity: number;
        optionVisible: boolean;
        optionChange: boolean;
        optionOpacity: number;
        optionCellSize: number;
        optionElevationScale: number;
        visible: boolean;
        getRadius: (x: Radius) => number;
        getColor: (x: DataOption) => number[];
        getColor1: (x: DataOption) => number | number[];
        getColor2: (x: DataOption) => number | number[];
        getColor3: (x: DataOption) => number | number[];
        getColor4: (x: DataOption) => number | number[];
        getElevation1: (x: DataOption) => number;
        getElevation2: (x: DataOption) => number;
        getElevation3: (x: DataOption) => number;
        getElevation4: (x: DataOption) => number;
        getCubeColor: (x: DataOption) => number[] | number[][];
        getCubeElevation: (x: DataOption) => number[];
        i18n: {
            error: string;
        };
    };
    static layerName: string;
    getPickingInfo(pickParams: pickParams): void;
    renderLayers(): (CubeiconLayer | EnhancedArcLayer | ScatterplotLayer<{
        id: string;
        data: MovedData[];
        radiusScale: number;
        getPosition: (x: Position) => number[];
        getColor: (x: DataOption) => number[];
        getRadius: (x: Radius) => number;
        visible: boolean;
        opacity: number;
        pickable: true;
        radiusMinPixels: number;
    }, {}> | LineLayer<{
        id: string;
        data: RoutePaths[];
        strokeWidth: number;
        visible: boolean;
        fp64: boolean;
        pickable: false;
    }, {}> | GridCellLayer<{
        id: string;
        data: MovedData[];
        visible: boolean;
        getPosition: (x: Position) => number[];
        getColor: (x: DataOption) => number[];
        getElevation: (x: DataOption) => number;
        opacity: number;
        pickable: true;
        cellSize: number;
        elevationScale: number;
        lightSettings: LightSettings;
    }, {}>)[];
}
export {};
