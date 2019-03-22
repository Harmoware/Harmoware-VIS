import { LayerProps, CompositeLayer } from 'deck.gl';
import { pickParams } from '../../library';
import { MovedData, Movesbase, RoutePaths, ClickedObject, DataOption, Radius } from '../../types';
import * as Actions from '../../actions';
interface Props extends LayerProps {
    layerOpacity?: number;
    movedData: MovedData[];
    movesbase: Movesbase[];
    getColor?: (x: any) => number[];
    getRadius?: (x: any) => number;
    routePaths?: RoutePaths[];
    actions: typeof Actions;
    clickedObject?: null | ClickedObject[];
}
export default class MovesNonmapLayer extends CompositeLayer<Props> {
    static defaultProps: {
        layerOpacity: number;
        getColor: (x: DataOption) => number[];
        getRadius: (x: Radius) => number;
    };
    static layerName: string;
    getPickingInfo(pickParams: pickParams): void;
    renderLayers(): any[];
}
export {};
