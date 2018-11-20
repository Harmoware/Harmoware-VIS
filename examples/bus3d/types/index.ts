import { Actions as BaseActions, BasedState, DepotsData, Movesbase, MovedData, ClickedObject } from 'harmoware-vis';
import * as Actions from '../actions';

export interface Bus3dState extends BasedState {
    bustripscsv?: Array<BusTripsCsvData>,
    busstopscsv?: Array<BusStopsCsvData>,
    busroutes?: Object,
    delayheight?: number,
    delayrange?: number,
    elevationScale?: number,
    xbandCellSize?: number,
    bsoptFname?: string,
    xbandFname?: string,
    selectedBusstop?: string,
    selectedBus?: string,
    answer?: string,
    hovered?: Object,
    answers?: Array<string>,
    busoption?: BusOptionData,
    busmovesbasedic?: Object,
    routesdata?: Object,
    bustripindex?: Object,
    archbase?: Array<ArchBaseData>,
    rainfall?: Array<Object>,
    depotsData?: Array<Bus3dDepotsData>,
    movesbase?: Array<Bus3dMovesbase>,
    movedData?: Array<Bus3dMovedData>,
    clickedObject?: Array<Bus3dClickedObject>,
};
export interface Bus3dProps extends Bus3dState {
    actions?: typeof Bus3dActions,
};
export const Bus3dActions = {
    ...BaseActions,
    ...Actions
};

export interface BusTripsCsvData {
    diagramid: string,
    routecode: string,
    systemcode: string,
    direction: string,
    systemname: string,
    timetable: string,
    actualdep: string,
    busstopcode: string,
    busstoporder: string,
};
export interface BusStopsCsvData {
    code: string,
    name: string,
    longitude: string,
    latitude: string,
};
export interface BusOptionData {
    busmovesoption?: Array<Object>,
    busstopsoption?: Array<Object>,
    archoption?: Array<Object>,
};
export interface ArchBaseData {
    departuretime: number,
    arrivaltime: number,
    arcdata: PositionPair,
};
export interface PositionPair {
    sourcePosition: Array<number>,
    targetPosition: Array<number>,
};

export interface Bus3dDepotsData extends DepotsData {
    code?: string,
    name?: string,
    memo?: string,
};
export interface Bus3dMovesbase extends Movesbase {
    busclass?: BusClass,
};
export interface BusClass {
    systemcode?: string,
    direction?: string,
    systemname?: string,
    timetable?: string,
};
export interface Bus3dMovedData extends MovedData {
    code?: string,
    name?: string,
    memo?: string,
};
export interface Bus3dClickedObject extends ClickedObject {
    object: {movesbaseidx: number, name?: string},
};