export declare const p02d: (val: any) => string;
export declare const p04d: (val: any) => string;
export declare const hsvToRgb: (H: any, S: any, V: any) => any[];
export declare const delaycolor: (delaysec: any, delayrange: any) => any[];
export declare const getBusstopOptionValue: (props: any, busstopsbaseidx: any) => {
    code: any;
    name: any;
    color: number[];
    radius: number;
};
export declare const getBusOptionValue: (props: any, movesbaseidx: any, operationidx: any) => {
    sourcePosition: any;
    targetPosition: any;
    code: string;
    name: string;
    color: number[];
    radius: number;
};
export declare const updateArcLayerData: (props: any) => any[];
