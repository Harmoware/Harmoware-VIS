// @flow

import * as types from '../constants/action-types';
import typeof * as Actions from '../actions';

declare type ElementEventTemplate<E> = {
  target: E
} & Event;

export type InputEvent = ElementEventTemplate<HTMLInputElement>

export type Viewport = {
  longitude?: number,
  latitude?: number,
  zoom?: number,
  maxZoom?: number,
  minZoom?: number,
  pitch?: number,
  bearing?: number,
  width?: number,
  height?: number,
  lookAt?: Array<number>,
  distance?: number,
  minDistance?: number,
  maxDistance?: number,
  rotationX?: number,
  rotationY?: number,
  fov?: number
};

export type LightSettings = {
  lightsPosition?: Array<number>,
  ambientRatio?: number,
  diffuseRatio?: number,
  specularRatio?: number,
  lightsStrength?: Array<number>,
  numberOfLights?: number
};

export type Bounds = {
  westlongitiude: number,
  eastlongitiude: number,
  southlatitude: number,
  northlatitude: number
};

export type Movesbase = Array<{
  departuretime: number,
  arrivaltime: number,
  operation: Array<{
    elapsedtime: number,
    longitude: number,
    latitude: number,
    position: Array<number>,
    color: void | Array<number>,
    normal: void | Array<number>,
  }>
}>;

export type AnalyzedBaseData = {
  timeBegin : number,
  timeLength : number,
  bounds: Bounds,
  movesbase: Movesbase,
  viewport: Viewport
};

export type MovesbaseFile = {
  timeBegin: number,
  timeLength: number,
  bounds: Bounds,
  movesbase: Movesbase,
};

export type Depotsbase = Array<{
  longitude: number,
  latitude: number,
  position: Array<number>
}>;

export type ClickedObject = null | {
  object: {movesbaseidx: number}
};

export type LineData = {
  sourcePosition: Array<number>,
  targetPosition: Array<number>,
  color: Array<number>
};

export type RoutePaths = Array<{
  sourcePosition: Array<number>,
  targetPosition: Array<number>,
  color: Array<number>
}>;

export type LineMapData = Array<{
  sourcePosition: Array<number>,
  targetPosition: Array<number>,
  color: Array<number>
}>;

export type MovedData = Array<{ movesbaseidx: number, position: Array<number> }>;

export type DepotsDataItem = { position: Array<number> };
export type DepotsData = Array<DepotsDataItem>;

export type BasedState = {
  animatePause: boolean,
  animateReverse: boolean,
  beforeFrameTimestamp: number,
  bounds: Bounds,
  clickedObject: ClickedObject,
  defaultPitch: number,
  defaultZoom: number,
  depotsBase: Depotsbase,
  depotsBaseOriginal: string,
  depotsData: DepotsData,
  getDepotsOptionFunc: null | ((props: any, i: number) => any),
  getMovesOptionFunc: null | ((props: any, i: number, j: number) => any),
  leading: number,
  lightSettings: LightSettings,
  loopTime: number,
  movedData: MovedData,
  movesbase: Movesbase,
  nonmapView: boolean,
  routePaths: RoutePaths,
  secperhour: number,
  settime: number,
  starttimestamp: number,
  timeBegin: number,
  timeLength: number,
  trailing: number,
  viewport: Viewport,
  linemapData: LineMapData,
  linemapDataOriginal: string,
};

export type BasedProps = {
  actions: Actions
} & BasedState;

export type GetDepotsOptionFunc = ((props: BasedProps, i: number) => any);
export type GetMovesOptionFunc = ((props: BasedProps, i: number, j: number) => any);

export type BaseActions = Actions;

export type Position = {position: Array<number>};
export type Radius = {radius: number};

export type DataOption = {
  color: Array<number>,
  optColor: Array<number>,
  optElevation: Array<number>,
  normal: Array<number>,
}

export type Context = {
  shaderCache: any,
  gl: any,
  viewport: {
    distanceScales: {
      degreesPerPixel: Array<number>,
      pixelsPerMeter: Array<number>
    },
    getDistanceScales: Function
  }
}

export type I18n = Object;

export type ActionTypes =
  {|type: string, min: number|} &
  {|type: string, props: BasedProps|} &
  {|type: string, time: number|} &
  {|type: string, leading: number|} &
  {|type: string, trailing: number|} &
  {|type: string, viewport: Viewport|} &
  {|type: string, lightSettings: LightSettings|} &
  {|type: string, base: (Movesbase | MovesbaseFile)|} &
  {|type: string, depotsBase: Depotsbase|} &
  {|type: string, pause: boolean|} &
  {|type: string, reverse: boolean|} &
  {|type: string, secperhour: number|} &
  {|type: string, clickedObject: ClickedObject|} &
  {|type: string, paths: RoutePaths|} &
  {|type: string, defaultZoom: number|} &
  {|type: string, defaultPitch: number|} &
  {|type: string, func: GetMovesOptionFunc|} &
  {|type: string, func: GetDepotsOptionFunc|} &
  {|type: string, nonmapView: boolean|} &
  {|type: string, linemapData: LineMapData|};
