import { ComObj, BusOptionData, ArchBaseData, RainfallData } from '../types';
interface Action {
    type: string;
    answers: string[];
    option: BusOptionData;
    dic: ComObj<number>;
    routes: ComObj<string>;
    bustripindex: ComObj<{
        elapsedtime: number;
        position: number[];
    }>;
    archbase: ArchBaseData[];
    rainfall: RainfallData[];
}
declare const _default: (state: {
    answers: string[];
    busoption: BusOptionData;
    busmovesbasedic: ComObj<number>;
    routesdata: ComObj<string>;
    bustripindex: ComObj<{
        elapsedtime: number;
        position: number[];
    }>;
    archbase: ArchBaseData[];
    rainfall: RainfallData[];
}, action: Action) => {
    answers: string[];
    busoption: BusOptionData;
    busmovesbasedic: ComObj<number>;
    routesdata: ComObj<string>;
    bustripindex: ComObj<{
        elapsedtime: number;
        position: number[];
    }>;
    archbase: ArchBaseData[];
    rainfall: RainfallData[];
};
export default _default;
