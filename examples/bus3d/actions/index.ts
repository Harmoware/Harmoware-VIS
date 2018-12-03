import * as types from '../constants/action-types';
/** saga * */
export const fetchDataList = path => ({ type: types.FETCHDATALIST, path });
export const fetchDataByAnswer = answer => ({ type: types.FETCHDATABYANSWER, answer });
export const fetchBusstopCSV = () => ({ type: types.FETCHBUSSTOPCSV });
export const fetchBusstopRoutesJSON = () => ({ type: types.FETCHBUSSTOPROUTESJSON });
export const fetchRoutesJSON = () => ({ type: types.FETCHROUTESJSON });
export const fetchBusstopsOption = () => ({ type: types.FETCHBUSSTOPSOPTION });
export const initializeFetch = path => ({ type: types.INITIALIZEFETCH, path });
export const setupFetch = answer => ({ type: types.SETUPFETCH, answer });
export const updateRoute = (el, sw) => ({ type: types.UPDATEROUTE, el, sw });
export const updateRainfall = (settime, xbandCellSize, answer, xbandFname) => (
  { type: types.UPDATERAINFALL, settime, xbandCellSize, answer, xbandFname });
/** reducer * */
export const setDelayHeight = height => ({ type: types.SETDELAYHEIGHT, height });
export const setScaleElevation = elevation => ({ type: types.SETSCALEELEVATION, elevation });
export const setCellSize = xbandCellSize => ({ type: types.SETCELLSIZE, xbandCellSize });
export const setXbandFname = xbandFname => ({ type: types.SETXBANDFNAME, xbandFname });
export const setDelayRange = delayrange => ({ type: types.SETDELAYRANGE, delayrange });
export const setBsoptFname = name => ({ type: types.SETBSOPTFNAME, name });
export const setSelectedBusstop = busstop => ({ type: types.SETSELECTEDBUSSTOP, busstop });
export const setSelectedBus = selectedBus => ({ type: types.SETSELECTEDBUS, selectedBus });
export const setAnswers = answers => ({ type: types.SETANSWERS, answers });
export const setAnswer = answer => ({ type: types.SETANSWER, answer });
export const setHovered = hovered => ({ type: types.SETHOVERED, hovered });
export const setBusOption = option => ({ type: types.SETBUSOPTION, option });
export const setBusMovesBaseDic = dic => ({ type: types.SETBUSMOVESBASEDIC, dic });
export const setRoutesData = routes => ({ type: types.SETROUTESDATA, routes });
export const setBusTripsCsv = csv => ({ type: types.SETBUSTRIPSCSV, csv });
export const setBusstopsCsv = csv => ({ type: types.SETBUSSTOPSCSV, csv });
export const setBusRoutes = routes => ({ type: types.SETBUSROUTES, routes });
export const setBusTripIndex = bustripindex => ({ type: types.SETBUSTRIPINDEX, bustripindex });
export const setArchBase = archbase => ({ type: types.SETARCHBASE, archbase });
export const setRainfall = rainfall => ({ type: types.SETRAINFALL, rainfall });

