import { createSlice, CaseReducer } from '@reduxjs/toolkit'
import { OnryBus3dState, BusOptionData, ComObj, BusTripsCsvData,
  BusStopsCsvData, Busroutes, ArchBaseData, RainfallData } from '../types'

const initialState: OnryBus3dState = {
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

interface Action<T=number> {type:string, payload:T}
interface ReducerType<T> extends CaseReducer<OnryBus3dState,Action<T>> {}
export interface BusTripIndexType { elapsedtime: number, position: number[] }
export const bus3dSlice = createSlice({
  name: 'bus3d',
  initialState,
  reducers:{
    setDelayHeight:((state, action)=>{ state.delayheight = action.payload })as ReducerType<number>,
    setScaleElevation:((state, action)=>{ state.elevationScale = action.payload })as ReducerType<number>,
    setCellSize:((state, action)=>{ state.xbandCellSize = action.payload })as ReducerType<number>,
    setXbandFname:((state, action)=>{ state.xbandFname = action.payload })as ReducerType<string>,
    setDelayRange:((state, action)=>{ state.delayrange = action.payload })as ReducerType<number>,
    setBsoptFname:((state, action)=>{ state.bsoptFname = action.payload })as ReducerType<string>,
    setSelectedBusstop:((state, action)=>{ state.selectedBusstop = action.payload })as ReducerType<string>,
    setSelectedBus:((state, action)=>{ state.selectedBus = action.payload })as ReducerType<string>,
    setFilelist:((state, action)=>{ state.filelist = action.payload })as ReducerType<string[]>,
    setFile:((state, action)=>{state.file = action.payload})as ReducerType<string>,
    setHovered:((state, action)=>{ state.hovered = action.payload })as ReducerType<any>,
    setBusOption:((state, action)=>{ state.busoption = action.payload })as ReducerType<BusOptionData>,
    setBusMovesBaseDic:((state, action)=>{ state.busmovesbasedic = action.payload })as ReducerType<ComObj>,
    setRoutesData:((state, action)=>{ state.routesdata = action.payload })as ReducerType<ComObj<string>>,
    setBusTripsCsv:((state, action)=>{ state.bustripscsv = action.payload })as ReducerType<BusTripsCsvData[]>,
    setBusstopsCsv:((state, action)=>{ state.busstopscsv = action.payload })as ReducerType<BusStopsCsvData[]>,
    setBusRoutes:((state, action)=>{ state.busroutes = action.payload })as ReducerType<Busroutes>,
    setBusTripIndex:((state, action)=>{ state.bustripindex = action.payload })as ReducerType<ComObj<BusTripIndexType>>,
    setArchBase:((state, action)=>{ state.archbase = action.payload })as ReducerType<ArchBaseData[]>,
    setRainfall:((state, action)=>{ state.rainfall = action.payload })as ReducerType<RainfallData[]>,
  }
})
export default bus3dSlice.reducer

