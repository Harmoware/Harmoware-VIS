import { CompositeLayer, LineLayer } from 'deck.gl';
import FrontScatterplotLayer from '../front-scatterplot-layer';
import { MovedData, Movesbase, RoutePaths, ClickedObject, DataOption } from '../../types';
import * as Actions from '../../actions';
declare type ActionTypes = typeof Actions;
interface Props {
    layerOpacity: number;
    movedData: Array<MovedData>;
    movesbase: Array<Movesbase>;
    getColor: (x: any) => Array<number>;
    getRadius: (x: any) => number;
    routePaths: Array<RoutePaths>;
    actions: ActionTypes;
    clickedObject: null | Array<ClickedObject>;
    onHover: Function;
    onClick: Function;
}
export default class MovesNonmapLayer extends CompositeLayer<Props> {
    static defaultProps: {
        layerOpacity: number;
        getColor: (x: DataOption) => number[];
    };
    static layerName: string;
    getPickingInfo(pickParams: any): void;
    renderLayers(): (FrontScatterplotLayer | LineLayer<{
        id: string;
        data: RoutePaths[];
        projectionMode: any;
        strokeWidth: number;
        pickable: boolean;
    }, {}>)[];
}
export {};
