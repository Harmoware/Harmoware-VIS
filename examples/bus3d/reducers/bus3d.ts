import * as types from '../constants/action-types';
import { Bus3dState } from '../types'

const assign = Object.assign;
const initialState: Bus3dState = {
  delayheight: 0,
  delayrange: 10,
  elevationScale: 2,
  xbandCellSize: 0,
  bsoptFname: '',
  xbandFname: '',
  selectedBusstop: '',
  selectedBus: '',
  file: '',
  hovered: null,
  filelist: [],
  busoption: {},
  busmovesbasedic: {},
  routesdata: {},
  bustripindex: {},
  archbase: [],
  rainfall: [],
  bustripscsv: [],
  busstopscsv: [],
  busroutes: {},
};

interface Action extends Bus3dState { type: string }

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case types.SETDELAYHEIGHT:
      return (() => assign({}, state, { delayheight:action.delayheight }))();
    case types.SETDELAYRANGE:
      return (() => assign({}, state, { delayrange:action.delayrange }))();
    case types.SETSCALEELEVATION:
      return (() => assign({}, state, { elevationScale:action.elevationScale  }))();
    case types.SETCELLSIZE:
      return (() => assign({}, state, { xbandCellSize:action.xbandCellSize }))();
    case types.SETBSOPTFNAME:
      return (() => assign({}, state, { bsoptFname:action.bsoptFname }))();
    case types.SETXBANDFNAME:
      return (() => assign({}, state, { xbandFname:action.xbandFname }))();
    case types.SETSELECTEDBUSSTOP:
      return (() => assign({}, state, { selectedBusstop:action.selectedBusstop }))();
    case types.SETSELECTEDBUS:
      return (() => assign({}, state, { selectedBus:action.selectedBus }))();
    case types.SETFILE:
      return (() => assign({}, state, { file:action.file }))();
    case types.SETHOVERED:
      return (() => assign({}, state, { hovered:action.hovered }))();
    case types.SETFILELIST:
      return (() => assign({}, state, { filelist:action.filelist }))();
    case types.SETBUSOPTION:
      return (() => assign({}, state, { busoption:action.busoption }))();
    case types.SETBUSMOVESBASEDIC:
      return (() => assign({}, state, { busmovesbasedic:action.busmovesbasedic }))();
    case types.SETROUTESDATA:
      return (() => assign({}, state, { routesdata:action.routesdata }))();
    case types.SETBUSTRIPINDEX:
      return (() => assign({}, state, { bustripindex:action.bustripindex }))();
    case types.SETARCHBASE:
      return (() => assign({}, state, { archbase:action.archbase }))();
    case types.SETRAINFALL:
      return (() => assign({}, state, { rainfall:action.rainfall }))();
    case types.SETBUSTRIPSCSV:
      return (() => assign({}, state, { bustripscsv:action.bustripscsv }))();
    case types.SETBUSSTOPSCSV:
      return (() => assign({}, state, { busstopscsv:action.busstopscsv }))();
    case types.SETBUSROUTES:
      return (() => assign({}, state, { busroutes:action.busroutes }))();
    default:
      return state;
  }
};
