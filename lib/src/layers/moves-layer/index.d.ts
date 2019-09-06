import { LayerProps, CompositeLayer, ScatterplotLayer, LineLayer, ArcLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import CubeGraphLayer from '../cubegraph-layer';
import PolygonIconLayer from '../polygon-icon-layer';
import { pickParams } from '../../library';
import { RoutePaths, MovedData, Movesbase, ClickedObject, LightSettings, Position, Radius, DataOption, Viewport } from '../../types';
import * as Actions from '../../actions';
interface Props extends LayerProps {
    viewport: Viewport;
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
    iconChange?: boolean;
    iconCubeType?: number;
    iconCubeSize?: number;
    lightSettings: LightSettings;
    getColor?: (x: DataOption) => number[];
    getRadius?: (x: Radius) => number;
    getCubeColor?: (x: DataOption) => number[][];
    getCubeElevation?: (x: DataOption) => number[];
    getStrokeWidth?: any;
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
        iconChange: boolean;
        iconCubeType: number;
        iconCubeSize: number;
        getColor: (x: DataOption) => number[];
        getRadius: (x: Radius) => number;
        getCubeColor: (x: DataOption) => number[] | number[][];
        getCubeElevation: (x: DataOption) => number[];
        getStrokeWidth: (x: any) => any;
    };
    static layerName: string;
    getPickingInfo(pickParams: pickParams): void;
    renderLayers(): (CubeiconLayer | CubeGraphLayer | PolygonIconLayer | ScatterplotLayer<{
        id: string;
        data: MovedData[];
        radiusScale: number;
        getPosition: (x: Position) => number[];
        getFillColor: (x: DataOption) => number[];
        getRadius: (x: Radius) => number;
        visible: true;
        opacity: number;
        pickable: true;
        radiusMinPixels: number;
    }, {}> | LineLayer<{
        id: string;
        data: RoutePaths[];
        getStrokeWidth: number;
        getColor: (x: DataOption) => number[];
        visible: true;
        fp64: boolean;
        pickable: false;
    }, {}> | ArcLayer<{
        id: string;
        data: any[];
        visible: boolean;
        pickable: true;
        getSourceColor: (x: MovedData) => (number | number[])[];
        getTargetColor: (x: MovedData) => (number | number[])[];
        getStrokeWidth: (x: any) => number;
        opacity: number;
    }, {}>)[];
}
export {};
