import { Actions as BaseActions, ActionsInterface, BasedState,
    DepotsData, Movesbase, MovesbaseOperation, MovedData, Depotsbase,
    ClickedObject } from 'harmoware-vis';
import * as Actions from '../actions';

export interface Bus3dState extends BasedState {
    bustripscsv?: BusTripsCsvData[],
    busstopscsv?: BusStopsCsvData[],
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
    answers?: string[],
    busoption?: BusOptionData,
    busmovesbasedic?: Object,
    routesdata?: Object,
    bustripindex?: Object,
    archbase?: ArchBaseData[],
    rainfall?: Object[],
    depotsBase?: BusStopsCsvData[],
    depotsData?: Bus3dDepotsData[],
    movesbase?: Bus3dMovesbase[],
    movedData?: Bus3dMovedData[],
    clickedObject?: Bus3dClickedObject[],
};
export interface Bus3dProps extends Bus3dState {
    actions?: typeof Bus3dActions,
};
interface Bus3dActionsInterface extends ActionsInterface {
    fetchDataList: typeof Actions.fetchDataList,
    fetchDataByAnswer: typeof Actions.fetchDataByAnswer,
    fetchBusstopCSV: typeof Actions.fetchBusstopCSV,
    fetchBusstopRoutesJSON: typeof Actions.fetchBusstopRoutesJSON,
    fetchRoutesJSON: typeof Actions.fetchRoutesJSON,
    fetchBusstopsOption: typeof Actions.fetchBusstopsOption,
    initializeFetch: typeof Actions.initializeFetch,
    setupFetch: typeof Actions.setupFetch,
    updateRoute: typeof Actions.updateRoute,
    updateRainfall: typeof Actions.updateRainfall,
    setDelayHeight: typeof Actions.setDelayHeight,
    setScaleElevation: typeof Actions.setScaleElevation,
    setCellSize: typeof Actions.setCellSize,
    setXbandFname: typeof Actions.setXbandFname,
    setDelayRange: typeof Actions.setDelayRange,
    setBsoptFname: typeof Actions.setBsoptFname,
    setSelectedBusstop: typeof Actions.setSelectedBusstop,
    setSelectedBus: typeof Actions.setSelectedBus,
    setAnswers: typeof Actions.setAnswers,
    setAnswer: typeof Actions.setAnswer,
    setHovered: typeof Actions.setHovered,
    setBusOption: typeof Actions.setBusOption,
    setBusMovesBaseDic: typeof Actions.setBusMovesBaseDic,
    setRoutesData: typeof Actions.setRoutesData,
    setBusTripsCsv: typeof Actions.setBusTripsCsv,
    setBusstopsCsv: typeof Actions.setBusstopsCsv,
    setBusRoutes: typeof Actions.setBusRoutes,
    setBusTripIndex: typeof Actions.setBusTripIndex,
    setArchBase: typeof Actions.setArchBase,
    setRainfall: typeof Actions.setRainfall,
}
export const Bus3dActions: Bus3dActionsInterface = {
    ...Actions,
    ...BaseActions,
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
export interface BusOptionData {
    busmovesoption?: Object[],
    busstopsoption?: Object[],
    archoption?: Object[],
};
export interface ArchBaseData {
    departuretime: number,
    arrivaltime: number,
    arcdata: PositionPair,
};
export interface PositionPair {
    sourcePosition: number[],
    targetPosition: number[],
};

export interface Bus3dDepotsData extends DepotsData {
    code?: string,
    name?: string,
    memo?: string,
};
export interface Bus3dMovesbaseOperation extends MovesbaseOperation {
    delaysec?: number,
};
export interface Bus3dMovesbase extends Movesbase {
    busclass?: BusClass,
    operation: Bus3dMovesbaseOperation[]
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
