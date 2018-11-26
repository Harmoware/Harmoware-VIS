/** saga * */
export declare const fetchDataList: (path: any) => {
    type: any;
    path: any;
};
export declare const fetchDataByAnswer: (answer: any) => {
    type: any;
    answer: any;
};
export declare const fetchBusstopCSV: () => {
    type: any;
};
export declare const fetchBusstopRoutesJSON: () => {
    type: any;
};
export declare const fetchRoutesJSON: () => {
    type: any;
};
export declare const fetchBusstopsOption: () => {
    type: any;
};
export declare const initializeFetch: (path: any) => {
    type: any;
    path: any;
};
export declare const setupFetch: (answer: any) => {
    type: any;
    answer: any;
};
export declare const updateRoute: (el: any, sw: any) => {
    type: any;
    el: any;
    sw: any;
};
export declare const updateRainfall: (settime: any, timeBegin: any, xbandCellSize: any, answer: any, xbandFname: any) => {
    type: any;
    settime: any;
    timeBegin: any;
    xbandCellSize: any;
    answer: any;
    xbandFname: any;
};
/** reducer * */
export declare const setDelayHeight: (height: any) => {
    type: string;
    height: any;
};
export declare const setScaleElevation: (elevation: any) => {
    type: string;
    elevation: any;
};
export declare const setCellSize: (xbandCellSize: any) => {
    type: string;
    xbandCellSize: any;
};
export declare const setXbandFname: (xbandFname: any) => {
    type: string;
    xbandFname: any;
};
export declare const setDelayRange: (delayrange: any) => {
    type: string;
    delayrange: any;
};
export declare const setBsoptFname: (name: any) => {
    type: string;
    name: any;
};
export declare const setSelectedBusstop: (busstop: any) => {
    type: string;
    busstop: any;
};
export declare const setSelectedBus: (selectedBus: any) => {
    type: string;
    selectedBus: any;
};
export declare const setAnswers: (answers: any) => {
    type: string;
    answers: any;
};
export declare const setAnswer: (answer: any) => {
    type: string;
    answer: any;
};
export declare const setHovered: (hovered: any) => {
    type: string;
    hovered: any;
};
export declare const setBusOption: (option: any) => {
    type: string;
    option: any;
};
export declare const setBusMovesBaseDic: (dic: any) => {
    type: string;
    dic: any;
};
export declare const setRoutesData: (routes: any) => {
    type: string;
    routes: any;
};
export declare const setBusTripsCsv: (csv: any) => {
    type: string;
    csv: any;
};
export declare const setBusstopsCsv: (csv: any) => {
    type: string;
    csv: any;
};
export declare const setBusRoutes: (routes: any) => {
    type: string;
    routes: any;
};
export declare const setBusTripIndex: (bustripindex: any) => {
    type: string;
    bustripindex: any;
};
export declare const setArchBase: (archbase: any) => {
    type: string;
    archbase: any;
};
export declare const setRainfall: (rainfall: any) => {
    type: string;
    rainfall: any;
};
