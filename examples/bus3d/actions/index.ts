import * as types from '../constants/action-types';
import { ComObj, BusStopsCsvData, BusTripsCsvData, Bus3dEventInfo, BusOptionData,
  Busroutes, ArchBaseData, RainfallData } from '../types';

export const setDelayHeight = (delayheight: string) => ({ type: types.SETDELAYHEIGHT, delayheight });
export const setScaleElevation = (elevationScale: string) => ({ type: types.SETSCALEELEVATION, elevationScale });
export const setCellSize = (xbandCellSize: number) => ({ type: types.SETCELLSIZE, xbandCellSize });
export const setXbandFname = (xbandFname: string) => ({ type: types.SETXBANDFNAME, xbandFname });
export const setDelayRange = (delayrange: number) => ({ type: types.SETDELAYRANGE, delayrange });
export const setBsoptFname = (bsoptFname: string) => ({ type: types.SETBSOPTFNAME, bsoptFname });
export const setSelectedBusstop = (selectedBusstop: string) => ({ type: types.SETSELECTEDBUSSTOP, selectedBusstop });
export const setSelectedBus = (selectedBus: string) => ({ type: types.SETSELECTEDBUS, selectedBus });
export const setFilelist = (filelist: string[]) => ({ type: types.SETFILELIST, filelist });
export const setFile = (file: string) => ({ type: types.SETFILE, file });
export const setHovered = (hovered: Bus3dEventInfo) => ({ type: types.SETHOVERED, hovered });
export const setBusOption = (busoption: BusOptionData) => ({ type: types.SETBUSOPTION, busoption });
export const setBusMovesBaseDic = (busmovesbasedic: ComObj<number>) => ({ type: types.SETBUSMOVESBASEDIC, busmovesbasedic });
export const setRoutesData = (routesdata: ComObj<string>) => ({ type: types.SETROUTESDATA, routesdata });
export const setBusTripsCsv = (bustripscsv: BusTripsCsvData[]) => ({ type: types.SETBUSTRIPSCSV, bustripscsv });
export const setBusstopsCsv = (busstopscsv: BusStopsCsvData[]) => ({ type: types.SETBUSSTOPSCSV, busstopscsv });
export const setBusRoutes = (busroutes: Busroutes) => ({ type: types.SETBUSROUTES, busroutes });
export const setBusTripIndex = (bustripindex: ComObj<{ elapsedtime: number, position: number[] }>) => ({ type: types.SETBUSTRIPINDEX, bustripindex });
export const setArchBase = (archbase: ArchBaseData[]) => ({ type: types.SETARCHBASE, archbase });
export const setRainfall = (rainfall: RainfallData[]) => ({ type: types.SETRAINFALL, rainfall });
