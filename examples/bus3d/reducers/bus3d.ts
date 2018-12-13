import * as types from '../constants/action-types';
import { BusTripsCsvData, BusStopsCsvData, Busroutes } from '../types';

const initialState: {
  bustripscsv: BusTripsCsvData[],
  busstopscsv: BusStopsCsvData[],
  busroutes: Busroutes,
} = {
  bustripscsv: [],
  busstopscsv: [],
  busroutes: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SETBUSTRIPSCSV:
      return (() => {
        const bustripscsv = action.csv;
        return Object.assign({}, state, {
          bustripscsv
        });
      })();
    case types.SETBUSSTOPSCSV:
      return (() => {
        const busstopscsv = action.csv;
        return Object.assign({}, state, {
          busstopscsv
        });
      })();
    case types.SETBUSROUTES:
      return (() => {
        const busroutes = action.routes;
        return Object.assign({}, state, {
          busroutes
        });
      })();
    default:
      return state;
  }
};
