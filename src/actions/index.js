// @flow

import * as types from '../constants/action-types';
import type { BasedProps as Props, LightSettings, Viewport,
  Movesbase, MovesbaseFile, Depotsbase, GetMovesOptionFunc, GetDepotsOptionFunc,
  ClickedObject, RoutePaths, Rainfall } from '../types';

export const addMinutes =
  (min: number) : {|type: string, min: number|} => ({ type: types.ADDMINUTES, min });

export const increaseTime =
  (props: Props) : {|type: string, props: Props|} => ({ type: types.INCREASETIME, props });

export const decreaseTime =
  (props: Props) : {|type: string, props: Props|} => ({ type: types.DECREASETIME, props });

export const setFrameTimestamp =
  (props: Props) : {|type: string, props: Props|} => ({ type: types.SETFRAMETIMESTAMP, props });

export const setTimeStamp =
  (time: number) : {|type: string, time: number|} => ({ type: types.SETTIMESTAMP, time });

export const setTime =
  (time: number) : {|type: string, time: number|} => ({ type: types.SETTIME, time });

export const setLeading =
  (leading: number) : {|type: string, leading: number|} => ({ type: types.SETLEADING, leading });

export const setTrailing =
  (trailing: number) : {|type: string, trailing: number|} =>
  ({ type: types.SETTRAILING, trailing });

export const setViewport =
  (viewport: Viewport) : {|type: string, viewport: Viewport|} =>
  ({ type: types.SETVIEWPORT, viewport });

export const setLightSettings =
  (lightSettings: LightSettings) : {|type: string, lightSettings: LightSettings|} =>
  ({ type: types.SETLIGHTSETTINGS, lightSettings });

export const setMovesBase =
  (base: (Movesbase | MovesbaseFile)) : {|type: string, base: (Movesbase | MovesbaseFile)|} =>
  ({ type: types.SETMOVESBASE, base });

export const setDepotsBase =
  (depotsBase: Depotsbase) : {|type: string, depotsBase: Depotsbase|} =>
  ({ type: types.SETDEPOTSBASE, depotsBase });

export const setAnimatePause =
  (pause: boolean) : {|type: string, pause: boolean|} => ({ type: types.SETANIMATEPAUSE, pause });

export const setAnimateReverse =
  (reverse: boolean) : {|type: string, reverse: boolean|} =>
  ({ type: types.SETANIMATEREVERSE, reverse });

export const setSecPerMin =
  (secpermin: number) : {|type: string, secpermin: number|} =>
  ({ type: types.SETSECPERMIN, secpermin });

export const setClicked =
  (clickedObject: ClickedObject) :
  {|type: string, clickedObject: ClickedObject|} =>
  ({ type: types.SETCLICKED, clickedObject });

export const setRoutePaths =
  (paths: RoutePaths) : {|type: string, paths: RoutePaths|} =>
  ({ type: types.SETROUTEPATHS, paths });

export const setDefaultZoom =
  (defaultZoom: number) : {|type: string, defaultZoom: number|} =>
  ({ type: types.SETDEFAULTZOOM, defaultZoom });

export const setDefaultPitch =
  (defaultPitch: number) : {|type: string, defaultPitch: number|} =>
  ({ type: types.SETDEFAULTPITCH, defaultPitch });

export const setMovesOptionFunc =
  (func: GetMovesOptionFunc) : {|type: string, func: GetMovesOptionFunc|} =>
  ({ type: types.SETMOVESOPTIONFUNC, func });

export const setDepotsOptionFunc =
  (func: GetDepotsOptionFunc) : {|type: string, func: GetDepotsOptionFunc|} =>
  ({ type: types.SETDEPOTSOPTIONFUNC, func });

export const setRainfall =
  (rainfall: Rainfall) : {|type: string, rainfall: Rainfall|} =>
  ({ type: types.SETRAINFALL, rainfall });
