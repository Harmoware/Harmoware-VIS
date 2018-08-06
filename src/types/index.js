// @flow

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

export type Movesbase = {
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
};

export type AnalyzedBaseData = {
  timeBegin : number,
  timeLength : number,
  bounds: Bounds,
  movesbase: Array<Movesbase>,
  viewport: Viewport
};

export type MovesbaseFile = {
  timeBegin: number,
  timeLength: number,
  bounds: Bounds,
  movesbase: Array<Movesbase>,
};

export type Depotsbase = {
  longitude: number,
  latitude: number,
  position: Array<number>
};

export type ClickedObject = {
  object: {movesbaseidx: number},
  layer: {id: string}
};

export type LineData = {
  sourcePosition: Array<number>,
  targetPosition: Array<number>,
  color: Array<number>
};

export type RoutePaths = {
  movesbaseidx: number,
  sourcePosition: Array<number>,
  targetPosition: Array<number>,
  color: Array<number>
};

export type LineMapData = {
  sourcePosition: Array<number>,
  targetPosition: Array<number>,
  color: Array<number>
};

export type MovedData = { movesbaseidx: number, position: Array<number> };

export type DepotsData = { position: Array<number> };

export type BasedState = {
  animatePause: boolean,
  animateReverse: boolean,
  beforeFrameTimestamp: number,
  bounds: Bounds,
  clickedObject: null | Array<ClickedObject>,
  defaultPitch: number,
  defaultZoom: number,
  depotsBase: Array<Depotsbase>,
  depotsBaseOriginal: string,
  depotsData: Array<DepotsData>,
  getDepotsOptionFunc: null | ((props: any, i: number) => any),
  getMovesOptionFunc: null | ((props: any, i: number, j: number) => any),
  leading: number,
  lightSettings: LightSettings,
  loopTime: number,
  movedData: Array<MovedData>,
  movesbase: Array<Movesbase>,
  nonmapView: boolean,
  routePaths: Array<RoutePaths>,
  secperhour: number,
  settime: number,
  starttimestamp: number,
  timeBegin: number,
  timeLength: number,
  trailing: number,
  viewport: Viewport,
  linemapData: Array<LineMapData>,
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
  {|type: string, base: (Array<Movesbase> | MovesbaseFile)|} &
  {|type: string, depotsBase: Array<Depotsbase>|} &
  {|type: string, pause: boolean|} &
  {|type: string, reverse: boolean|} &
  {|type: string, secperhour: number|} &
  {|type: string, clickedObject: null | Array<ClickedObject>|} &
  {|type: string, paths: Array<RoutePaths>|} &
  {|type: string, defaultZoom: number|} &
  {|type: string, defaultPitch: number|} &
  {|type: string, func: GetMovesOptionFunc|} &
  {|type: string, func: GetDepotsOptionFunc|} &
  {|type: string, nonmapView: boolean|} &
  {|type: string, linemapData: Array<LineMapData>|};
