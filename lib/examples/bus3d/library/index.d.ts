import { Bus3dProps, Arcdata } from '../types';
export declare const p02d: (val: number) => string;
export declare const p04d: (val: string) => string;
export declare const hsvToRgb: (H: number, S: number, V: number) => number[];
export declare const delaycolor: (delaysec: number, delayrange: number) => number[];
export declare const getBusstopOptionValue: (props: Bus3dProps, busstopsbaseidx: number) => {
    code: string;
    name: string;
    color: number[];
    radius: number;
};
export declare const getBusOptionValue: (props: Bus3dProps, movesbaseidx: number, operationidx: number) => {
    sourcePosition: any;
    targetPosition: any;
    code: string;
    name: string;
    color: number[];
    radius: number;
};
export declare const updateArcLayerData: (props: Bus3dProps) => Arcdata[];
