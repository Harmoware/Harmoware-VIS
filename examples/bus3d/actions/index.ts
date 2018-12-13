import * as types from '../constants/action-types';
import { ComObj, BusStopsCsvData, BusTripsCsvData, Bus3dEventInfo, BusOptionData,
  Busroutes, ArchBaseData, RainfallData, Bus3dClickedObject } from '../types';
/** saga * */
export const fetchDataList = (path: string) => ({ type: types.FETCHDATALIST, path });
export const fetchDataByAnswer = (answer: string) => ({ type: types.FETCHDATABYANSWER, answer });
export const fetchBusstopCSV = () => ({ type: types.FETCHBUSSTOPCSV });
export const fetchBusstopRoutesJSON = () => ({ type: types.FETCHBUSSTOPROUTESJSON });
export const fetchRoutesJSON = () => ({ type: types.FETCHROUTESJSON });
export const fetchBusstopsOption = () => ({ type: types.FETCHBUSSTOPSOPTION });
export const initializeFetch = (path: string) => ({ type: types.INITIALIZEFETCH, path });
export const setupFetch = (answer: string) => ({ type: types.SETUPFETCH, answer });
export const updateRoute = (el: Bus3dClickedObject[], sw: boolean) => ({ type: types.UPDATEROUTE, el, sw });
export const updateRainfall = (settime: number, xbandCellSize: number, answer: string, xbandFname: string) => (
  { type: types.UPDATERAINFALL, settime, xbandCellSize, answer, xbandFname });
/** reducer * */
export const setDelayHeight = (height: string) => ({ type: types.SETDELAYHEIGHT, height });
export const setScaleElevation = (elevation: string) => ({ type: types.SETSCALEELEVATION, elevation });
export const setCellSize = (xbandCellSize: number) => ({ type: types.SETCELLSIZE, xbandCellSize });
export const setXbandFname = (xbandFname: string) => ({ type: types.SETXBANDFNAME, xbandFname });
export const setDelayRange = (delayrange: number) => ({ type: types.SETDELAYRANGE, delayrange });
export const setBsoptFname = (name: string) => ({ type: types.SETBSOPTFNAME, name });
export const setSelectedBusstop = (busstop: string) => ({ type: types.SETSELECTEDBUSSTOP, busstop });
export const setSelectedBus = (selectedBus: string) => ({ type: types.SETSELECTEDBUS, selectedBus });
export const setAnswers = (answers: string[]) => ({ type: types.SETANSWERS, answers });
export const setAnswer = (answer: string) => ({ type: types.SETANSWER, answer });
export const setHovered = (hovered: Bus3dEventInfo) => ({ type: types.SETHOVERED, hovered });
export const setBusOption = (option: BusOptionData) => ({ type: types.SETBUSOPTION, option });
export const setBusMovesBaseDic = (dic: ComObj<number>) => ({ type: types.SETBUSMOVESBASEDIC, dic });
export const setRoutesData = (routes: ComObj<string>) => ({ type: types.SETROUTESDATA, routes });
export const setBusTripsCsv = (csv: BusTripsCsvData[]) => ({ type: types.SETBUSTRIPSCSV, csv });
export const setBusstopsCsv = (csv: BusStopsCsvData[]) => ({ type: types.SETBUSSTOPSCSV, csv });
export const setBusRoutes = (routes: Busroutes) => ({ type: types.SETBUSROUTES, routes });
export const setBusTripIndex = (bustripindex: ComObj<{ elapsedtime: number, position: number[] }>) => ({ type: types.SETBUSTRIPINDEX, bustripindex });
export const setArchBase = (archbase: ArchBaseData[]) => ({ type: types.SETARCHBASE, archbase });
export const setRainfall = (rainfall: RainfallData[]) => ({ type: types.SETRAINFALL, rainfall });

