import { ActionsInterface, BasedState,
    DepotsData, Movesbase, MovesbaseOperation, MovedData, Depotsbase,
    ClickedObject, EventInfo } from 'harmoware-vis';
import * as Bus3dActions from '../actions';

export interface ComObj<T=number> {
    [propName: string]: T,
}
export interface OnryBus3dState {
    bustripscsv: BusTripsCsvData[],
    busstopscsv: BusStopsCsvData[],
    busroutes: Busroutes,
    delayheight: number,
    delayrange: number,
    elevationScale: number,
    xbandCellSize: number,
    bsoptFname: string,
    xbandFname: string,
    selectedBusstop: string,
    selectedBus: string,
    file: string,
    hovered: Bus3dEventInfo,
    filelist: string[],
    busoption: BusOptionData,
    busmovesbasedic: ComObj<number>,
    routesdata: ComObj<string>,
    bustripindex: ComObj<{ elapsedtime: number, position: number[] }>,
    archbase: ArchBaseData[],
    rainfall: RainfallData[],
};
export interface Bus3dState extends OnryBus3dState,Partial<BasedState> {
    depotsBase?: Bus3dDepotsbase[],
    depotsData?: Bus3dDepotsData[],
    movesbase?: Bus3dMovesbase[],
    movedData?: Bus3dMovedData[],
    clickedObject?: Bus3dClickedObject[],
};
type Bus3dActionsType = typeof Bus3dActions
export interface Bus3dActionsInterface extends ActionsInterface,Bus3dActionsType { }
export interface Bus3dProps extends Bus3dState {
    actions: Bus3dActionsInterface,
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
export interface BusStopsCsvData extends Depotsbase {
    code: string,
    name: string,
};
export interface Bus3dDepotsbase extends Depotsbase {
    code: string,
    name: string,
    option?: {
        stime: number;
        etime: number;
        data: {
            time: number;
            elevation: number | number[];
            color: number[] | number[][];
            memo: string;
        }[]
    },
};
export interface BusOptionData {
    busmovesoption?: ComObj<ComObj<{
        elevation: number,
        color: number[],
        memo: string
    }>>[],
    busstopsoption?: ComObj<{
        bscode: number,
        elevation: number | number[],
        color: number[] | number[][],
        memo: string
    }[]>,
    archoption?: Archoption[],
};
interface Archoption extends ComObj<any> {
    diagramId: string,
    sourceDepotsCode: string,
    sourceDepotsOrder: string,
    targetDepotsCode: string,
    targetDepotsOrder: string,
}
export interface ArchBaseData {
    departuretime: number,
    arrivaltime: number,
    arcdata: Arcdata,
};
export interface Arcdata extends ComObj<any> {
    sourcePosition: number[],
    targetPosition: number[],
    color?: number[],
    strokeWidth?: number,
};

export interface Bus3dDepotsData extends DepotsData {
    code?: string,
    name?: string,
    memo?: string,
};
export interface Bus3dMovesbaseOperation extends MovesbaseOperation {
    delaysec?: number,
    busprop?: Busprop,
};
export interface Busprop {
    elevation?: number | number[];
    color?: number[] | number[][];
    memo?: string;
};
export interface Bus3dMovesbase extends Movesbase {
    busclass?: BusClass,
    operation: Bus3dMovesbaseOperation[]
};
export interface BusClass {
    diagramid?: string, 
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
    object: Partial<Bus3dMovedData>,
    layer: {id: string, props?:Partial<Bus3dProps>}
};
export interface Bus3dEventInfo extends EventInfo {
    object: {
        movesbaseidx: number,
        code: string,
    },
};
export interface Busroutes extends ComObj<string[]> {}
export interface RainfallData {
    position: number[],
    elevation: number,
    color: number[],
}