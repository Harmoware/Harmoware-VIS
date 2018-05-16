import * as types from '../constants/action-types';

const initialState = {
  answers: [],
  busoption: {},
  busmovesbasedic: {},
  routesdata: {}
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
    default:
      return state;
  }
};
