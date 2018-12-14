import * as types from '../constants/action-types';
import { Bus3dEventInfo } from '../types'

const initialState: {
  delayheight: number,
  delayrange: number,
  elevationScale: number,
  xbandCellSize: number,
  bsoptFname: string,
  xbandFname: string,
  selectedBusstop: string,
  selectedBus: string,
  answer: string,
  hovered: Bus3dEventInfo,
} = {
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

interface Action {
  type: string,
  height: number,
  delayrange: number,
  elevation: number,
  xbandCellSize: number,
  name: string,
  xbandFname: string,
  busstop: string,
  selectedBus: string,
  answer: string,
  hovered: Bus3dEventInfo,
}

export default (state = initialState, action: Action) => {
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
