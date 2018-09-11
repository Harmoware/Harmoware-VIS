// @flow

import React from 'react';

declare module 'harmoware-vis' {
  declare export type I18n = Object;

  declare export type InputEvent = {
    target: HTMLInputElement
  } & Event;

  declare export type Bounds = {
    westlongitiude: number, eastlongitiude: number,
    southlatitude: number, northlatitude: number
  };

  declare export type ClickedObject = {
    object: {movesbaseidx: number},
    layer: {id: string}
  };

  declare export type Depotsbase = {
    longitude: number, latitude: number, position: Array<number>
  };

  declare export type DepotsData = { position: Array<number> };

  declare export type LineMapData = {
    sourcePosition: Array<number>, targetPosition: Array<number>, color: Array<number>
  };

  declare export type GetDepotsOptionFunc = ((props: BasedProps, i: number) => any);

  declare export type GetMovesOptionFunc = ((props: BasedProps, i: number, j: number) => any);

  declare export type LightSettings = {
    lightsPosition?: Array<number>, ambientRatio?: number, diffuseRatio?: number,
    specularRatio?: number, lightsStrength?: Array<number>, numberOfLights?: number
  };

  declare export type MovedData = { movesbaseidx: number, position: Array<number> };

  declare export type Position = { position: Array<number> };
  declare export type LongLat = { longitude: number, latitude: number };
  declare export type Movesbase = {
    departuretime: number, arrivaltime: number,
    operation: Array<{
      elapsedtime: number, color: void | Array<number>, normal: void | Array<number>
    } & Position | LongLat>
  };

  declare export type RoutePaths = {
    movesbaseidx: number,
    sourcePosition: Array<number>, targetPosition: Array<number>, color: Array<number>
  };

  declare export type Viewport = {
    longitude?: number, latitude?: number, zoom?: number, maxZoom?: number, minZoom?: number,
    pitch?: number, bearing?: number, width?: number, height?: number, lookAt?: Array<number>,
    distance?: number, minDistance?: number, maxDistance?: number, rotationX?: number,
    rotationY?: number, fov?: number,
  };

  declare export type BasedState = {
    animatePause: boolean, animateReverse: boolean, beforeFrameTimestamp: number, bounds: Bounds,
    clickedObject: null | Array<ClickedObject>, defaultPitch: number, defaultZoom: number,
    depotsBase: Array<Depotsbase>, depotsData: Array<DepotsData>,
    getDepotsOptionFunc: null | GetDepotsOptionFunc, getMovesOptionFunc: null | GetMovesOptionFunc,
    leading: number, lightSettings: LightSettings,
    loopTime: number, movedData: Array<MovedData>, movesbase: Array<Movesbase>, nonmapView: boolean,
    routePaths: Array<RoutePaths>, secperhour: number, settime: number,
    starttimestamp: number, timeBegin: number, timeLength: number, trailing: number,
    viewport: Viewport, linemapData: Array<LineMapData>, loading: boolean };

  declare export type BasedProps = { actions: Actions } & BasedState;

  declare export type MovesbaseFile = {
    timeBegin: number, timeLength: number, bounds: Bounds, movesbase: Array<Movesbase>,
  };

  declare export type Actions = {|
    addMinutes: (min: number) => {| min: number, type: string |},
    decreaseTime: (props: BasedProps) => {| props: BasedProps, type: string |},
    increaseTime: (props: BasedProps) => {| props: BasedProps, type: string |},
    setAnimatePause: (pause: boolean) => {| pause: boolean, type: string |},
    setAnimateReverse: (reverse: boolean) => {| reverse: boolean, type: string |},
    setClicked: (clickedObject: null | Array<ClickedObject>) =>
      {| clickedObject: null | Array<ClickedObject>, type: string |},
    setDefaultPitch: (defaultPitch: number) => {| defaultPitch: number, type: string |},
    setDefaultZoom: (defaultZoom: number) => {| defaultZoom: number, type: string |},
    setDepotsBase: (depotsBase: Array<Depotsbase>) =>
      {| depotsBase: Array<Depotsbase>, type: string |},
    setDepotsOptionFunc: (func: GetDepotsOptionFunc) =>
      {| func: GetDepotsOptionFunc, type: string |},
    setFrameTimestamp: (props: BasedProps) => {| props: BasedProps, type: string |},
    setLeading: (leading: number) => {| leading: number, type: string |},
    setLightSettings: (lightSettings: LightSettings) =>
      {| lightSettings: LightSettings, type: string |},
    setMovesBase: (base: (Array<Movesbase> | MovesbaseFile)) =>
      {| base: (Array<Movesbase> | MovesbaseFile), type: string |},
    setMovesOptionFunc: (func: GetMovesOptionFunc) => {| func: GetMovesOptionFunc, type: string |},
    setRoutePaths: (paths: Array<RoutePaths>) => {| paths: Array<RoutePaths>, type: string |},
    setSecPerHour: (secperhour: number) => {| secperhour: number, type: string |},
    setTime: (time: number) => {| time: number, type: string |},
    setTimeStamp: (props: BasedProps) => {| props: BasedProps, type: string |},
    setTrailing: (trailing: number) => {| trailing: number, type: string |},
    setViewport: (viewport: Viewport) => {| type: string, viewport: Viewport |},
    setLinemapData: (linemapData: Array<LineMapData>) =>
      {| type: string, linemapData: Array<LineMapData> |},
    setLoading: (loading: boolean) => {| type: string, loading: boolean |}
  |};

  declare type MovesInputProps = {|
    actions: {
      setMovesBase: (base: (Array<Movesbase> | MovesbaseFile)) =>
        {| base: (Array<Movesbase> | MovesbaseFile), type: string |},
      setRoutePaths: (paths: Array<RoutePaths>) => {| paths: Array<RoutePaths>, type: string |},
      setClicked: (clickedObject: null | Array<ClickedObject>) =>
        {| clickedObject: null | Array<ClickedObject>, type: string |},
      setAnimatePause: (pause: boolean) => {| pause: boolean, type: string |},
      setAnimateReverse: (reverse: boolean) => {| reverse: boolean, type: string |}, },
      i18n?: I18n, id?: string, className?: string, style?: Object |};
  declare export class MovesInput extends React$Component<MovesInputProps> {}

  declare type DepotsInputProps = {|
    actions: { setDepotsBase: (depotsBase: Array<Depotsbase>) =>
      {| depotsBase: Array<Depotsbase>, type: string |} }, i18n?: I18n, id?: string,
      className?: string, style?: Object |};
  declare export class DepotsInput extends React$Component<DepotsInputProps> {}

  declare type LinemapInputProps = {|
    actions: { setLinemapData: (linemapData: Array<LineMapData>) =>
      {| type: string, linemapData: Array<LineMapData> |} }, i18n?: I18n, id?: string,
      className?: string, style?: Object |};
  declare export class LinemapInput extends React$Component<LinemapInputProps> {}

  declare type LoadingIconProps = {|
    loading: boolean, color?: string |};
  declare export class LoadingIcon extends React$Component<LoadingIconProps> {}

  declare type AddMinutesButtonProps = {|
    addMinutes?: number, children?: React.Element | string, className?: string,
    actions: { addMinutes: (min: number) => {| min: number, type: string |} }, i18n?: I18n |};
  declare export class AddMinutesButton extends React$Component<AddMinutesButtonProps> {}

  declare type PlayButtonProps = {|
    actions: { setAnimatePause: (pause: boolean) => {| pause: boolean, type: string |} },
    children?: React.Element | string, i18n?: I18n, className?: string |};
  declare export class PlayButton extends React$Component<PlayButtonProps> {}

  declare type PauseButtonProps = {|
    actions: { setAnimatePause: (pause: boolean) => {| pause: boolean, type: string |} },
    children?: React.Element | string, i18n?: I18n, className?: string |};
  declare export class PauseButton extends React$Component<PauseButtonProps> {}

  declare type ForwardButtonProps = {|
    actions: { setAnimateReverse: (reverse: boolean) => {| reverse: boolean, type: string |} },
    children?: React.Element | string, i18n?: I18n, className?: string |};
  declare export class ForwardButton extends React$Component<ForwardButtonProps> {}

  declare type ReverseButtonProps = {|
    actions: { setAnimateReverse: (reverse: boolean) => {| reverse: boolean, type: string |} },
    children?: React.Element | string, i18n?: I18n, className?: string |};
  declare export class ReverseButton extends React$Component<ReverseButtonProps> {}

  declare type ElapsedTimeRangeProps = {|
    settime: number, timeLength: number, min?: number, step?: number, className?: string,
    actions: { setTime: (time: number) => {| time: number, type: string |} } |};
  declare export class ElapsedTimeRange extends React$Component<ElapsedTimeRangeProps> {}

  declare type SpeedRangeProps = {|
    secperhour: number, actions: {
      setSecPerHour: (secperhour: number) => {| secperhour: number, type: string |}
    }, maxsecperhour?: number, min?: number, step?: number, className?: string |};
  declare export class SpeedRange extends React$Component<SpeedRangeProps> {}

  declare type SimulationDateTimeProps = {|
    timeBegin: number, settime: number, caption?: string,
    locales?: string, options?: any, className?: string |};
  declare export class SimulationDateTime extends React$Component<SimulationDateTimeProps> {}

  declare type HarmoVisLayersProps = {|
    viewport: Viewport, mapboxApiAccessToken?: ? string, mapStyle?: string, actions: Actions,
    onChangeViewport?: (viewport: Viewport) => {| type: string, viewport: Viewport |},
    layers: Array<Layer> |};
  declare export class HarmoVisLayers extends React$Component<HarmoVisLayersProps> {}

  declare type HarmoVisNonMapLayersProps = {|
    viewport: Viewport, actions: Actions,
    onChangeViewport?: (viewport: Viewport) => {| type: string, viewport: Viewport |},
    layers: Array<Layer> |};
  declare export class HarmoVisNonMapLayers extends React$Component<HarmoVisNonMapLayersProps> {}

  declare export class Container<P = void, S = void> extends React$Component<P, S> {
    props: P; state: S;
  }

  declare class Layer {}
  declare class CompositeLayer extends Layer {}

  declare type MovesLayerProps = {|
    routePaths: Array<RoutePaths>, layerRadiusScale?: number, layerOpacity?: number,
    movedData: Array<MovedData>, movesbase: Array<Movesbase>,
    clickedObject?: null | Array<ClickedObject>,
    actions: {
      setRoutePaths: (paths: Array<RoutePaths>) => {| paths: Array<RoutePaths>, type: string |},
      setClicked: (clickedObject: null | Array<ClickedObject>) =>
        {| clickedObject: null | Array<ClickedObject>, type: string |},
    }, optionVisible?: boolean, optionChange?: boolean, optionOpacity?: number,
    optionCellSize?: number, optionElevationScale?: number, lightSettings?: LightSettings,
    getColor?: (x: any) => Array<number>, getRadius?: (x: any) => number,
    getColor1?: (x: any) => Array<number>, getColor2?: (x: any) => Array<number>,
    getColor3?: (x: any) => Array<number>, getColor4?: (x: any) => Array<number>,
    getElevation1?: (x: any) => number, getElevation2?: (x: any) => number,
    getElevation3?: (x: any) => number, getElevation4?: (x: any) => number,
    getCubeColor?: (x: any) => Array<Array<number>>, getCubeElevation?: (x: any) => Array<number>,
    onHover?: Function, onClick?: Function, i18n?: I18n |};
  declare export class MovesLayer extends CompositeLayer { constructor(MovesLayerProps): void; }

  declare type MovesNonmapLayerProps = {|
    layerOpacity?: number, movedData: Array<MovedData>, movesbase: Array<Movesbase>,
    getColor?: (x: any) => Array<number>, getRadius?: (x: any) => number,
    actions: {
      setRoutePaths: (paths: Array<RoutePaths>) => {| paths: Array<RoutePaths>, type: string |},
      setClicked: (clickedObject: null | Array<ClickedObject>) =>
        {| clickedObject: null | Array<ClickedObject>, type: string |}
    }, routePaths: Array<RoutePaths>, clickedObject?: null | Array<ClickedObject>,
    onHover?: Function, onClick?: Function |};
  declare export class MovesNonmapLayer extends CompositeLayer {
    constructor(MovesNonmapLayerProps): void;
  }

  declare type DepotsLayerProps = {|
    layerRadiusScale?: number, layerOpacity?: number, depotsData: Array<DepotsData>,
    optionVisible?: boolean, optionChange?: boolean, optionOpacity?: number,
    optionCellSize?: number, optionElevationScale?: number, lightSettings?: LightSettings,
    getColor?: (x: any) => Array<number>, getRadius?: (x: any) => number,
    getColor1?: (x: any) => Array<number>, getColor2?: (x: any) => Array<number>,
    getColor3?: (x: any) => Array<number>, getColor4?: (x: any) => Array<number>,
    getElevation1?: (x: any) => number, getElevation2?: (x: any) => number,
    getElevation3?: (x: any) => number, getElevation4?: (x: any) => number,
    onHover?: Function, onClick?: Function, i18n?: I18n |};
  declare export class DepotsLayer extends CompositeLayer { constructor(DepotsLayerProps): void; }

  declare type FixedPointLayerProps = {|
    layerOpacity?: number, depotsData: Array<DepotsData>,
    getColor?: (x: any) => Array<number>, getRadius?: (x: any) => number,
    onHover?: Function, onClick?: Function |};
  declare export class FixedPointLayer extends CompositeLayer {
    constructor(FixedPointLayerProps): void;
  }

  declare type LineMapLayerProps = {|
    layerOpacity?: number, linemapData: Array<LineMapData>, strokeWidth?: number,
    getColor?: (x: any) => Array<number>,
    onHover?: Function, onClick?: Function |};
  declare export class LineMapLayer extends CompositeLayer {
    constructor(LineMapLayerProps): void; }

  declare export function applyDefaultStyle(opt?: {bootstrap?: boolean}) : void;

  declare export function getContainerProp(state: any) : any;
  declare export function connectToHarmowareVis
    (App: any, moreActions: void | any, mapStateToProps: void | any) : any;
}
