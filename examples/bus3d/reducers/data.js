import * as types from '../constants/action-types';

const initialState = {
  answers: [],
  busoption: {},
  busmovesbasedic: {},
  routesdata: {},
  bustripindex: {},
  archbase: [],
  rainfall: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SETANSWERS:
      return (() => {
        const answers = action.answers;
        return Object.assign({}, state, {
          answers
        });
      })();
    case types.SETBUSOPTION:
      return (() => {
        const busoption = action.option;
        return Object.assign({}, state, {
          busoption
        });
      })();
    case types.SETBUSMOVESBASEDIC:
      return (() => {
        const busmovesbasedic = action.dic;
        return Object.assign({}, state, {
          busmovesbasedic
        });
      })();
    case types.SETROUTESDATA:
      return (() => {
        const routesdata = action.routes;
        return Object.assign({}, state, {
          routesdata
        });
      })();
    case types.SETBUSTRIPINDEX:
      return (() => {
        const bustripindex = action.bustripindex;
        return Object.assign({}, state, {
          bustripindex
        });
      })();
    case types.SETARCHBASE:
      return (() => {
        const archbase = action.archbase;
        return Object.assign({}, state, {
          archbase
        });
      })();
    case types.SETRAINFALL:
      return (() => {
        const rainfall = action.rainfall;
        return Object.assign({}, state, {
          rainfall
        });
      })();
    default:
      return state;
  }
};
