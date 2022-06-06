import { ViewportProps } from 'react-map-gl';
import * as BaseActions from '../actions';

export interface Viewport extends Partial<ViewportProps> {};

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
  direction?: number,
  color?: void | number[],
};

export interface Movesbase {
  type?: string,
  departuretime?: number,
  arrivaltime?: number,
  operation: MovesbaseOperation[],
  movesbaseidx?: number
};

export interface MovesbaseFile {
  timeBegin?: number,
  timeLength?: number,
  bounds?: Bounds,
  elapsedtimeMode?: string,
  movesbase: Movesbase[],
};

export interface AnalyzedBaseData extends MovesbaseFile {
  viewport?: Viewport
};

export interface Depotsbase {
  type?: string,
  longitude?: number,
  latitude?: number,
  position?: number[]
};

export interface ClickedObject {
  object: Partial<MovedData>,
  layer: {id: string}
};

export interface RoutePaths {
  movesbaseidx?: number,
  sourcePosition: number[],
  targetPosition: number[],
  routeColor?: number[],
  routeWidth?: number,
};

export interface LineMapData {
  sourcePosition?: number[],
  targetPosition?: number[],
  color?: number[],
  path?: number[][],
  polygon?: number[][],
  coordinates?: number[][],
  elevation?: number,
  strokeWidth?: number,
  dash?: number[],
};

export interface MovedData {
  movesbaseidx: number,
  type?: string,
  position?: number[],
  sourcePosition?: number[],
  targetPosition?: number[],
  direction?: number,
  sourceColor?: number[],
  targetColor?: number[],
  radius?: number,
  scale?: number[],
  color?: (number | number[])[],
  settime: number,
  routeColor?: number[],
  routeWidth?: number,
  optColor?: number[][],
  optElevation?: number[],
  archWidth?: number,
};

export interface LocationData extends Partial<MovedData> {
  id: any,
  elapsedtime?: number,
  [key:string] : any
};
export interface LocationDataOption extends Pick<Partial<BasedState>, 'locationMoveDuration'|'defaultAddTimeLength'|'remainingTime'>{}

export interface DepotsData {
  type?: string,
  position: number[],
  radius?: number,
  color?: (number | number[])[],
  optColor?: number[][],
  optElevation?: number[],
  settime: number,
};

export type LayerTypes = 'Scatterplot'|'SimpleMesh'|'Scenegraph';
export interface IconDesignation {
  type: string,
  layer: LayerTypes,
  radiusScale?: number,
  getColor?: (x: MovedData|DepotsData) => number[],
  getOrientation?: (x: MovedData|DepotsData) => number[],
  getScale?: (x: MovedData|DepotsData) => number[],
  getTranslation?: (x: MovedData|DepotsData) => number[],
  getRadius?: (x: MovedData|DepotsData) => number,
  sizeScale?: number,
  mesh?: any,
  scenegraph?: any,
};

export interface BasedState {
  animatePause: boolean,
  loopEndPause: boolean,
  animateReverse: boolean,
  beforeFrameTimestamp: number,
  bounds: Bounds,
  clickedObject: null | ClickedObject[],
  defaultPitch: number,
  defaultZoom: number,
  depotsBase: Depotsbase[],
  depotsData: DepotsData[],
  getDepotsOptionFunc: null | GetDepotsOptionFunc,
  getMovesOptionFunc: null | GetMovesOptionFunc,
  leading: number,
  loopTime: number,
  movedData: MovedData[],
  locationBase: LocationData[],
  locationData: LocationData[],
  locationMoveDuration: number,
  defaultAddTimeLength: number,
  remainingTime: number,
  ExtractedData: any,
  getExtractedDataFunc: null | GetExtractedDataFunc,
  movesbase: Movesbase[],
  routePaths: RoutePaths[],
  secperhour: number,
  multiplySpeed: number,
  settime: number,
  starttimestamp: number,
  timeBegin: number,
  timeLength: number,
  trailing: number,
  viewport: Viewport,
  linemapData: LineMapData[],
  loading: boolean,
  inputFileName: {[propName:string]:string},
  noLoop: boolean,
  initialViewChange: boolean,
  iconGradation: boolean,
};

type ActionTypes = typeof BaseActions;

export interface ActionsInterface extends ActionTypes { }

export interface BasedProps extends BasedState {
  actions: ActionsInterface
};

export interface GetDepotsOptionFunc {(props: object, i: number): object;}

export interface GetMovesOptionFunc {(props: object, i: number, j: number): object;}

export interface GetExtractedDataFunc {(props: object): any;}

export interface EventInfo extends React.MouseEvent<HTMLButtonElement> {
  object: Partial<MovedData>,
  layer: {
    id: string,
    props: {
      movesbase: Movesbase[],
      routePaths: RoutePaths[],
      actions: ActionsInterface,
      clickedObject: ClickedObject[],
      getRouteColor?: Function,
      getRouteWidth?: Function,
      iconDesignations?: IconDesignation[],
    }
  },
  x: number,
  y: number,
}
