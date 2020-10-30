import * as types from '../constants/action-types';
import { ComObj, BusOptionData, ArchBaseData, RainfallData } from '../types';

const assign = Object.assign;
const initialState:{
  answers: string[],
  busoption: BusOptionData,
  busmovesbasedic: ComObj<number>,
  routesdata: ComObj<string>,
  bustripindex: ComObj<{ elapsedtime: number, position: number[] }>,
  archbase: ArchBaseData[],
  rainfall: RainfallData[]
} = {
  answers: [],
  busoption: {},
  busmovesbasedic: {},
  routesdata: {},
  bustripindex: {},
  archbase: [],
  rainfall: []
};

interface Action {
  type: string,
  answers: string[],
  option: BusOptionData,
  dic: ComObj<number>,
  routes: ComObj<string>,
  bustripindex: ComObj<{ elapsedtime: number, position: number[] }>,
  archbase: ArchBaseData[],
  rainfall: RainfallData[]
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case types.SETANSWERS:
      return (() => {
        const answers = action.answers;
        return assign({}, state, {
          answers
        });
      })();
    case types.SETBUSOPTION:
      return (() => {
        const busoption = action.option;
        return assign({}, state, {
          busoption
        });
      })();
    case types.SETBUSMOVESBASEDIC:
      return (() => {
        const busmovesbasedic = action.dic;
        return assign({}, state, {
          busmovesbasedic
        });
      })();
    case types.SETROUTESDATA:
      return (() => {
        const routesdata = action.routes;
        return assign({}, state, {
          routesdata
        });
      })();
    case types.SETBUSTRIPINDEX:
      return (() => {
        const bustripindex = action.bustripindex;
        return assign({}, state, {
          bustripindex
        });
      })();
    case types.SETARCHBASE:
      return (() => {
        const archbase = action.archbase;
        return assign({}, state, {
          archbase
        });
      })();
    case types.SETRAINFALL:
      return (() => {
        const rainfall = action.rainfall;
        return assign({}, state, {
          rainfall
        });
      })();
    default:
      return state;
  }
};
