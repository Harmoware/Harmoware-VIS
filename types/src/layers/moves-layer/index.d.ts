import { CompositeLayer, ScatterplotLayer, GridCellLayer, LineLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import EnhancedArcLayer from '../enhanced-arc-layer';
import { RoutePaths, MovedData, Movesbase, ClickedObject, LightSettings, Position, DataOption } from '../../types';
import * as Actions from '../../actions';
declare type ActionTypes = typeof Actions;
interface Props {
    routePaths: Array<RoutePaths>;
    layerRadiusScale: number;
    layerOpacity: number;
    movedData: Array<MovedData>;
    movesbase: Array<Movesbase>;
    clickedObject: null | Array<ClickedObject>;
    actions: ActionTypes;
    optionVisible: boolean;
    optionChange: boolean;
    optionOpacity: number;
    optionCellSize: number;
    optionElevationScale: number;
    visible: boolean;
    lightSettings: LightSettings;
    getColor: (x: any) => Array<number>;
    getRadius: (x: any) => number;
    getColor1: (x: any) => Array<number>;
    getColor2: (x: any) => Array<number>;
    getColor3: (x: any) => Array<number>;
    getColor4: (x: any) => Array<number>;
    getElevation1: (x: any) => number;
    getElevation2: (x: any) => number;
    getElevation3: (x: any) => number;
    getElevation4: (x: any) => number;
    getCubeColor: (x: any) => Array<Array<number>>;
    getCubeElevation: (x: any) => Array<number>;
    onHover: Function;
    onClick: Function;
    i18n: {
        error: string;
    };
}
export default class MovesLayer extends CompositeLayer<Props> {
    static defaultProps: {
        layerRadiusScale: number;
        layerOpacity: number;
        optionVisible: boolean;
        optionChange: boolean;
        optionOpacity: number;
        optionCellSize: number;
        optionElevationScale: number;
        visible: boolean;
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
    getPickingInfo(pickParams: any): void;
    renderLayers(): (CubeiconLayer | EnhancedArcLayer | ScatterplotLayer<{
        id: string;
        data: MovedData[];
        radiusScale: number;
        getPosition: (x: Position) => number[];
        getColor: (x: any) => number[];
        getRadius: (x: any) => number;
        visible: boolean;
        opacity: number;
        pickable: boolean;
        radiusMinPixels: number;
    }, {}> | LineLayer<{
        id: string;
        data: RoutePaths[];
        strokeWidth: number;
        visible: boolean;
        fp64: boolean;
        pickable: boolean;
    }, {}> | GridCellLayer<{
        id: string;
        data: MovedData[];
        visible: boolean;
        getPosition: (x: Position) => number[];
        getColor: (x: any) => number[];
        getElevation: (x: any) => number;
        opacity: number;
        pickable: boolean;
        cellSize: number;
        elevationScale: number;
        lightSettings: LightSettings;
    }, {}>)[];
}
export {};
