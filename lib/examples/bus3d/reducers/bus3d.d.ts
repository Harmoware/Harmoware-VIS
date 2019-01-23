import { BusTripsCsvData, BusStopsCsvData, Busroutes } from '../types';
interface Action {
    type: string;
    bustripscsv: BusTripsCsvData[];
    busstopscsv: BusStopsCsvData[];
    routes: Busroutes;
}
declare const _default: (state: {
    bustripscsv: BusTripsCsvData[];
    busstopscsv: BusStopsCsvData[];
    busroutes: Busroutes;
}, action: Action) => {
    bustripscsv: BusTripsCsvData[];
    busstopscsv: BusStopsCsvData[];
    busroutes: Busroutes;
};
export default _default;
