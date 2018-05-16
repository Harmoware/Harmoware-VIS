// @flow

declare module 'harmoware-vis' {
  declare export type InputEvent = {
    target: HTMLInputElement
  } & Event;

  declare export type Bounds = {
    westlongitiude: number, eastlongitiude: number,
    southlatitude: number, northlatitude: number
  };

  declare export type ClickedObject = null | {
    object: {movesbaseidx: number}
  };

  declare export type Depotsbase = Array<{
    longitude: number, latitude: number
  }>;

  declare export type DepotsDataItem = { position: Array<number> };

  declare export type DepotsData = Array<DepotsDataItem>;

  declare export type GetDepotsOptionFunc = ((props: BasedProps, i: number) => any);

  declare export type GetMovesOptionFunc = ((props: BasedProps, i: number, j: number) => any);

  declare export type LightSettings = {
    lightsPosition?: Array<number>, ambientRatio?: number, diffuseRatio?: number,
    specularRatio?: number, lightsStrength?: Array<number>, numberOfLights?: number
  };

  declare export type MovedData = Array<{ movesbaseidx: number, position: Array<number> }>;

  declare export type Movesbase = Array<{
    departuretime: number, arrivaltime: number,
    operation: Array<{
      elapsedtime: number, longitude: number, latitude: number, color: void | Array<number>
    }>
  }>;

  declare export type RainfallItem = {
    position: Array<number>, color: Array<number>, elevation: number
  };
  declare export type Rainfall = Array<RainfallItem>;

  declare export type RoutePaths = Array<{
    sourcePosition: Array<number>, targetPosition: Array<number>, color: Array<number>
  }>;

  declare export type Viewport = {
    longitude?: number, latitude?: number, zoom?: number, maxZoom?: number, minZoom?: number,
    pitch?: number, bearing?: number, width?: number, height?: number,
  };

  declare export type BasedState = {
    animatePause: boolean, animateReverse: boolean, beforeFrameTimestamp: number,
    bounds: Bounds, clickedObject: ClickedObject, defaultPitch: number, defaultZoom: number,
    depotsBase: Depotsbase, depotsData: DepotsData, getDepotsOptionFunc: null | GetDepotsOptionFunc,
    getMovesOptionFunc: null | GetMovesOptionFunc, leading: number, lightSettings: LightSettings,
    loopTime: number, movedData: MovedData, movesbase: Movesbase, rainfall: Rainfall,
    routePaths: RoutePaths, secpermin: number, settime: number, starttimestamp: number,
    timeBegin: number, timeLength: number, trailing: number, viewport: Viewport, };

  declare export type BasedProps = { actions: Actions } & BasedState;

  declare export type MovesbaseFile = {
    timeBegin: number, timeLength: number, bounds: Bounds, movesbase: Movesbase,
  };

  declare export type Actions = {|
    addMinutes: (min: number) => {| min: number, type: string |},
    decreaseTime: (props: BasedProps) => {| props: BasedProps, type: string |},
    increaseTime: (props: BasedProps) => {| props: BasedProps, type: string |},
    setAnimatePause: (pause: boolean) => {| pause: boolean, type: string |},
    setAnimateReverse: (reverse: boolean) => {| reverse: boolean, type: string |},
    setClicked: (clickedObject: ClickedObject) =>
      {| clickedObject: ClickedObject, type: string |},
    setDefaultPitch: (defaultPitch: number) => {| defaultPitch: number, type: string |},
    setDefaultZoom: (defaultZoom: number) => {| defaultZoom: number, type: string |},
    setDepotsBase: (depotsBase: Depotsbase) => {| depotsBase: Depotsbase, type: string |},
    setDepotsOptionFunc: (func: GetDepotsOptionFunc) =>
      {| func: GetDepotsOptionFunc, type: string |},
    setFrameTimestamp: (props: BasedProps) => {| props: BasedProps, type: string |},
    setLeading: (leading: number) => {| leading: number, type: string |},
    setLightSettings: (lightSettings: LightSettings) =>
      {| lightSettings: LightSettings, type: string |},
    setMovesBase: (base: (Movesbase | MovesbaseFile)) =>
      {| base: (Movesbase | MovesbaseFile), type: string |},
    setMovesOptionFunc: (func: GetMovesOptionFunc) => {| func: GetMovesOptionFunc, type: string |},
    setRainfall: (rainfall: Rainfall) => {| rainfall: Rainfall, type: string |},
    setRoutePaths: (paths: RoutePaths) => {| paths: RoutePaths, type: string |},
    setSecPerMin: (secpermin: number) => {| secpermin: number, type: string |},
    setTime: (time: number) => {| time: number, type: string |},
    setTimeStamp: (time: number) => {| time: number, type: string |},
    setTrailing: (trailing: number) => {| trailing: number, type: string |},
    setViewport: (viewport: Viewport) => {| type: string, viewport: Viewport |}
  |};

  declare type MovesInputProps = {|
    actions: {
      setMovesBase: (base: (Movesbase | MovesbaseFile)) =>
        {| base: (Movesbase | MovesbaseFile), type: string |},
      setRoutePaths: (paths: RoutePaths) => {| paths: RoutePaths, type: string |},
      setClicked: (clickedObject: ClickedObject) =>
        {| clickedObject: ClickedObject, type: string |},
      setAnimatePause: (pause: boolean) => {| pause: boolean, type: string |},
      setAnimateReverse: (reverse: boolean) => {| reverse: boolean, type: string |}, } |};
  declare export class MovesInput extends React$Component<MovesInputProps> {}

  declare type DepotsInputProps = {|
    actions: { setDepotsBase: (depotsBase: Depotsbase) =>
      {| depotsBase: Depotsbase, type: string |} } |};
  declare export class DepotsInput extends React$Component<DepotsInputProps> {}

  declare type XbandDataInputProps = {|
    actions : { setRainfall: (rainfall: Rainfall) => {| rainfall: Rainfall, type: string |} } |};
  declare export class XbandDataInput extends React$Component<XbandDataInputProps> {}

  declare type AddMinutesButtonProps = {|
    addMinutes?: number, children?: Node | string,
    actions: { addMinutes: (min: number) => {| min: number, type: string |} } |};
  declare export class AddMinutesButton extends React$Component<AddMinutesButtonProps> {}

  declare type PlayButtonProps = {|
    actions: { setAnimatePause: (pause: boolean) => {| pause: boolean, type: string |} },
    children?: Node | string |};
  declare export class PlayButton extends React$Component<PlayButtonProps> {}

  declare type PauseButtonProps = {|
    actions: { setAnimatePause: (pause: boolean) => {| pause: boolean, type: string |} },
    children?: Node | string |};
  declare export class PauseButton extends React$Component<PauseButtonProps> {}

  declare type ForwardButtonProps = {|
    actions: { setAnimateReverse: (reverse: boolean) => {| reverse: boolean, type: string |} },
    children?: Node | string |};
  declare export class ForwardButton extends React$Component<ForwardButtonProps> {}

  declare type ReverseButtonProps = {|
    actions: { setAnimateReverse: (reverse: boolean) => {| reverse: boolean, type: string |} },
    children?: Node | string |};
  declare export class ReverseButton extends React$Component<ReverseButtonProps> {}

  declare type ElapsedTimeRangeProps = {|
    settime: number, timeLength: number, min?: number, step?: number,
    actions: { setTime: (time: number) => {| time: number, type: string |} } |};
  declare export class ElapsedTimeRange extends React$Component<ElapsedTimeRangeProps> {}

  declare type SpeedRangeProps = {|
    secpermin: number, actions: {
      setSecPerMin: (secpermin: number) => {| secpermin: number, type: string |}
    }, maxsecpermin?: number, min?: number, step?: number |};
  declare export class SpeedRange extends React$Component<SpeedRangeProps> {}

  declare type SimulationDateTimeProps = {|
    timeBegin: number, settime: number, caption?: string, locales?: string, options?: any |};
  declare export class SimulationDateTime extends React$Component<SimulationDateTimeProps> {}

  declare type HarmoVisLayersProps = {|
    viewport: Viewport, mapboxApiAccessToken: ? string, mapStyle?: string, actions: Actions,
    onChangeViewport?: (viewport: Viewport) => {| type: string, viewport: Viewport |},
    layers: Array<Layer> |};
  declare export class HarmoVisLayers extends React$Component<HarmoVisLayersProps> {}

  declare export class Container<P = void, S = void> extends React$Component<P, S> {
    props: P; state: S;
  }

  declare class Layer {}
  declare class CompositeLayer extends Layer {}

  declare type MovesLayerProps = {|
    routePaths: RoutePaths, layerRadiusScale?: number, layerOpacity?: number,
    movedData: MovedData, movesbase: Movesbase, clickedObject?: ClickedObject,
    actions: {
      setRoutePaths: (paths: RoutePaths) => {| paths: RoutePaths, type: string |},
      setClicked: (clickedObject: ClickedObject) =>
        {| clickedObject: ClickedObject, type: string |},
    }, optionVisible?: boolean, optionChange?: boolean, optionOpacity?: number,
    optionCellSize?: number, optionElevationScale?: number, lightSettings?: LightSettings,
    getColor?: (x: any) => Array<number>, getRadius?: (x: any) => number,
    getColor1?: (x: any) => Array<number>, getColor2?: (x: any) => Array<number>,
    getColor3?: (x: any) => Array<number>, getColor4?: (x: any) => Array<number>,
    getElevation1?: (x: any) => number, getElevation2?: (x: any) => number,
    getElevation3?: (x: any) => number, getElevation4?: (x: any) => number,
    getCubeColor?: (x: any) => Array<Array<number>>, getCubeElevation?: (x: any) => Array<number>,
    onHover?: Function, onClick?: Function |};
  declare export class MovesLayer extends CompositeLayer { constructor(MovesLayerProps): void; }

  declare type DepotsLayerProps = {|
    layerRadiusScale?: number, layerOpacity?: number, depotsData: DepotsData,
    optionVisible?: boolean, optionChange?: boolean, optionOpacity?: number,
    optionCellSize?: number, optionElevationScale?: number, lightSettings?: LightSettings,
    getColor?: (x: any) => Array<number>, getRadius?: (x: any) => number,
    getColor1?: (x: any) => Array<number>, getColor2?: (x: any) => Array<number>,
    getColor3?: (x: any) => Array<number>, getColor4?: (x: any) => Array<number>,
    getElevation1?: (x: any) => number, getElevation2?: (x: any) => number,
    getElevation3?: (x: any) => number, getElevation4?: (x: any) => number |};
  declare export class DepotsLayer extends CompositeLayer { constructor(DepotsLayerProps): void; }

  declare type XbandmeshLayerProps = {|
    rainfall: Rainfall, layerOpacity?: number, layerCellSize?: number, layerElevationScale?: number,
    lightSettings: LightSettings, getElevation?: (x: any) => number,
    getColor?: (x: any) => Array<number>, getRainfallColor?: (x: number) => Array<number>,
    defaultColor?: Array<number> |};
  declare export class XbandmeshLayer extends CompositeLayer {
    constructor(XbandmeshLayerProps): void; }

  declare export function getContainerProp(state: any) : any;
  declare export function connectToHarmowareVis
    (App: any, moreActions: void | any, mapStateToProps: void | any) : any;
}
