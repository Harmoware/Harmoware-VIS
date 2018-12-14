import * as types from '../constants/action-types';
import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();
import { BasedProps as Props, LightSettings, Viewport,
  Movesbase, MovesbaseFile, Depotsbase, GetMovesOptionFunc, GetDepotsOptionFunc,
  ClickedObject, RoutePaths, LineMapData } from '../types';

export const addMinutes =  actionCreator<number>(types.ADDMINUTES);
export const increaseTime = actionCreator<Props>(types.INCREASETIME);
export const decreaseTime = actionCreator<Props>(types.DECREASETIME);
export const setFrameTimestamp = actionCreator<Props>(types.SETFRAMETIMESTAMP);
export const setTimeStamp = actionCreator<Props>(types.SETTIMESTAMP);
export const setTime = actionCreator<number>(types.SETTIME);
export const setLeading = actionCreator<number>(types.SETLEADING);
export const setTrailing = actionCreator<number>(types.SETTRAILING);
export const setViewport = actionCreator<Viewport>(types.SETVIEWPORT);
export const setLightSettings = actionCreator<LightSettings>(types.SETLIGHTSETTINGS);
export const setMovesBase = actionCreator<(Movesbase[] | MovesbaseFile)>(types.SETMOVESBASE);
export const setDepotsBase = actionCreator<Depotsbase[]>(types.SETDEPOTSBASE);
export const setAnimatePause = actionCreator<boolean>(types.SETANIMATEPAUSE);
export const setAnimateReverse = actionCreator<boolean>(types.SETANIMATEREVERSE);
export const setSecPerHour =　actionCreator<number>(types.SETSECPERHOUR);
export const setClicked = actionCreator<null | ClickedObject[]>(types.SETCLICKED);
export const setRoutePaths = actionCreator<RoutePaths[]>(types.SETROUTEPATHS);
export const setDefaultZoom = actionCreator<number>(types.SETDEFAULTZOOM);
export const setDefaultPitch = actionCreator<number>(types.SETDEFAULTPITCH);
export const setMovesOptionFunc = actionCreator<GetMovesOptionFunc>(types.SETMOVESOPTIONFUNC);
export const setDepotsOptionFunc = actionCreator<GetDepotsOptionFunc>(types.SETDEPOTSOPTIONFUNC);
export const setNonmapView = actionCreator<boolean>(types.SETNONMAPVIEW);
export const setLinemapData = actionCreator<LineMapData[]>(types.SETLINEMAPDATA);
export const setLoading = actionCreator<boolean>(types.SETLOADING);
export const setInputFilename = actionCreator<Object>(types.SETINPUTFILENAME);
export const updateMovesBase = actionCreator<(Movesbase[] | MovesbaseFile)>(types.UPDATEMOVESBASE);
