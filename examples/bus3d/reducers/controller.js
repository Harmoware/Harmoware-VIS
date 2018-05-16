import * as types from '../constants/action-types';

const initialState = {
  delayheight: 0,
  delayrange: 10,
  elevationScale: 5,
  xbandCellSize: 0,
  bsoptFname: '',
  xbandFname: '',
  selectedBusstop: '',
  selectedBus: '',
  answer: '',
  hovered: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SETDELAYHEIGHT:
      return (() => {
        const delayheight = action.height;
        return Object.assign({}, state, {
          delayheight
        });
      })();
    case types.SETSCALEELEVATION:
      return (() => {
        const elevationScale = action.elevation;
        return Object.assign({}, state, {
          elevationScale
        });
      })();
    case types.SETCELLSIZE:
      return (() => {
        const xbandCellSize = action.xbandCellSize;
        return Object.assign({}, state, {
          xbandCellSize
        });
      })();
    case types.SETBSOPTFNAME:
      return (() => {
        const bsoptFname = action.name;
        return Object.assign({}, state, {
          bsoptFname
        });
      })();
    case types.SETXBANDFNAME:
      return (() => {
        const xbandFname = action.xbandFname;
        return Object.assign({}, state, {
          xbandFname
        });
      })();
    case types.SETDELAYRANGE:
      return (() => {
        const delayrange = action.delayrange;
        return Object.assign({}, state, {
          delayrange
        });
      })();
    case types.SETANSWER:
      return (() => {
        const answer = action.answer;
        return Object.assign({}, state, {
          answer
        });
      })();
    case types.SETHOVERED:
      return (() => {
        const hovered = action.hovered;
        return Object.assign({}, state, {
          hovered
        });
      })();
    case types.SETSELECTEDBUSSTOP:
      return (() => {
        const selectedBusstop = action.busstop;
        return Object.assign({}, state, {
          selectedBusstop
        });
      })();
    case types.SETSELECTEDBUS:
      return (() => {
        const selectedBus = action.selectedBus;
        return Object.assign({}, state, {
          selectedBus
        });
      })();
    default:
      return state;
  }
};
