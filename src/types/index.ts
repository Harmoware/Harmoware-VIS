import * as BaseActions from '../actions';

export interface Viewport {
  longitude?: number,
  latitude?: number,
  zoom?: number,
  maxZoom?: number,
  minZoom?: number,
  pitch?: number,
  bearing?: number,
  width?: number,
  height?: number,
  lookAt?: number[],
  distance?: number,
  minDistance?: number,
  maxDistance?: number,
  rotationX?: number,
  rotationY?: number,
  fov?: number
};

export interface LightSettings {
  lightsPosition?: number[],
  ambientRatio?: number,
  diffuseRatio?: number,
  specularRatio?: number,
  lightsStrength?: number[],
  numberOfLights?: number
};

export interface Bounds {
  westlongitiude: number,
  eastlongitiude: number,
  southlatitude: number,
  northlatitude: number
};

export interface MovesbaseOperation {
  elapsedtime: number,
  longitude?: number,
  latitude?: number,
  position?: number[],
  color?: void | number[],
  normal?: void | number[],
};

export interface Movesbase {
  departuretime: number,
  arrivaltime: number,
  operation: MovesbaseOperation[]
};

export interface MovesbaseFile {
  timeBegin?: number,
  timeLength?: number,
  bounds?: Bounds,
  movesbase: Movesbase[],
};

export interface AnalyzedBaseData extends MovesbaseFile {
  viewport: Viewport
};

export interface Depotsbase {
  longitude?: number,
  latitude?: number,
  position?: number[]
};

export interface ClickedObject {
  object: {movesbaseidx: number},
  layer: {id: string}
};

export interface LineData {
  sourcePosition: number[],
  targetPosition: number[],
  color?: number[]
};

export interface RoutePaths {
  movesbaseidx?: number,
  sourcePosition: number[],
  targetPosition: number[],
  color?: number[]
};

export interface LineMapData {
  sourcePosition: number[],
  targetPosition: number[],
  color?: number[]
};

export interface MovedData {
  movesbaseidx: number,
  position: number[]
};

export interface DepotsData {
  position: number[]
};

export interface BasedState {
  animatePause?: boolean,
  animateReverse?: boolean,
  beforeFrameTimestamp?: number,
  bounds?: Bounds,
  clickedObject?: null | ClickedObject[],
  defaultPitch?: number,
  defaultZoom?: number,
  depotsBase?: Depotsbase[],
  depotsBaseOriginal?: string,
  depotsData?: DepotsData[],
  getDepotsOptionFunc?: null | (<P>(props: P, i: number) => any),
  getMovesOptionFunc?: null | (<P>(props: P, i: number, j: number) => any),
  leading?: number,
  lightSettings?: LightSettings,
  loopTime?: number,
  movedData?: MovedData[],
  movesbase?: Movesbase[],
  nonmapView?: boolean,
  routePaths?: RoutePaths[],
  secperhour?: number,
  settime?: number,
  starttimestamp?: number,
  timeBegin?: number,
  timeLength?: number,
  trailing?: number,
  viewport?: Viewport,
  linemapData?: LineMapData[],
  linemapDataOriginal?: string,
  loading?: boolean,
  inputFileName?: AnyObject,
};

export type ActionTypes = typeof BaseActions;

export interface ActionsInterface extends ActionTypes { }

export interface BasedProps extends BasedState {
  actions?: ActionTypes
};

export type GetDepotsOptionFunc = ((props: BasedProps, i: number) => any);

export type GetMovesOptionFunc = ((props: BasedProps, i: number, j: number) => any);

export interface Position {
  position: number[]
};

export interface Radius {
  radius: number
};

export interface DataOption {
  color?: number[],
  optColor?: number[],
  optElevation?: number[],
  normal?: number[],
}

export interface Context {
  shaderCache,
  gl: WebGLRenderingContext,
  viewport: {
    distanceScales: {
      degreesPerPixel: number[],
      pixelsPerMeter: number[]
    },
    getDistanceScales: Function
  }
}

export interface EventInfo extends React.MouseEvent<HTMLButtonElement> {
  object: {
      movesbaseidx: number
  },
  layer: {
    id: string,
    props: {
      movesbase: Movesbase[],
      routePaths: RoutePaths[],
      actions: ActionTypes,
      clickedObject: ClickedObject[],
      onHover?: (event: React.MouseEvent<HTMLButtonElement>) => void,
      onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    }
  },
  x: number,
  y: number,
}

export interface AnyObject {
  [propName: string]: any,
}
