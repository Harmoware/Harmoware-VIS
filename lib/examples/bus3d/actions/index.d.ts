import { ComObj, BusStopsCsvData, BusTripsCsvData, Bus3dEventInfo, BusOptionData, Busroutes, ArchBaseData, RainfallData, Bus3dClickedObject } from '../types';
/** saga * */
export declare const fetchDataList: (path: string) => {
    type: string;
    path: string;
};
export declare const fetchDataByAnswer: (answer: string) => {
    type: string;
    answer: string;
};
export declare const fetchBusstopCSV: () => {
    type: string;
};
export declare const fetchBusstopRoutesJSON: () => {
    type: string;
};
export declare const fetchRoutesJSON: () => {
    type: string;
};
export declare const fetchBusstopsOption: () => {
    type: string;
};
export declare const initializeFetch: (path: string) => {
    type: string;
    path: string;
};
export declare const setupFetch: (answer: string) => {
    type: string;
    answer: string;
};
export declare const updateRoute: (el: Bus3dClickedObject[], sw: boolean) => {
    type: string;
    el: Bus3dClickedObject[];
    sw: boolean;
};
export declare const updateRainfall: (settime: number, xbandCellSize: number, answer: string, xbandFname: string) => {
    type: string;
    settime: number;
    xbandCellSize: number;
    answer: string;
    xbandFname: string;
};
/** reducer * */
export declare const setDelayHeight: (height: string) => {
    type: string;
    height: string;
};
export declare const setScaleElevation: (elevation: string) => {
    type: string;
    elevation: string;
};
export declare const setCellSize: (xbandCellSize: number) => {
    type: string;
    xbandCellSize: number;
};
export declare const setXbandFname: (xbandFname: string) => {
    type: string;
    xbandFname: string;
};
export declare const setDelayRange: (delayrange: number) => {
    type: string;
    delayrange: number;
};
export declare const setBsoptFname: (name: string) => {
    type: string;
    name: string;
};
export declare const setSelectedBusstop: (busstop: string) => {
    type: string;
    busstop: string;
};
export declare const setSelectedBus: (selectedBus: string) => {
    type: string;
    selectedBus: string;
};
export declare const setAnswers: (answers: string[]) => {
    type: string;
    answers: string[];
};
export declare const setAnswer: (answer: string) => {
    type: string;
    answer: string;
};
export declare const setHovered: (hovered: Bus3dEventInfo) => {
    type: string;
    hovered: Bus3dEventInfo;
};
export declare const setBusOption: (option: BusOptionData) => {
    type: string;
    option: BusOptionData;
};
export declare const setBusMovesBaseDic: (dic: ComObj<number>) => {
    type: string;
    dic: ComObj<number>;
};
export declare const setRoutesData: (routes: ComObj<string>) => {
    type: string;
    routes: ComObj<string>;
};
export declare const setBusTripsCsv: (bustripscsv: BusTripsCsvData[]) => {
    type: string;
    bustripscsv: BusTripsCsvData[];
};
export declare const setBusstopsCsv: (busstopscsv: BusStopsCsvData[]) => {
    type: string;
    busstopscsv: BusStopsCsvData[];
};
export declare const setBusRoutes: (routes: Busroutes) => {
    type: string;
    routes: Busroutes;
};
export declare const setBusTripIndex: (bustripindex: ComObj<{
    elapsedtime: number;
    position: number[];
}>) => {
    type: string;
    bustripindex: ComObj<{
        elapsedtime: number;
        position: number[];
    }>;
};
export declare const setArchBase: (archbase: ArchBaseData[]) => {
    type: string;
    archbase: ArchBaseData[];
};
export declare const setRainfall: (rainfall: RainfallData[]) => {
    type: string;
    rainfall: RainfallData[];
};
