import { BasedProps as Props, LightSettings, Viewport, Movesbase, MovesbaseFile, Depotsbase, ClickedObject, RoutePaths, LineMapData } from '../types';
export declare const addMinutes: (min: number) => {
    type: string;
    min: number;
};
export declare const increaseTime: (props: Props) => {
    type: string;
    props: Props;
};
export declare const decreaseTime: (props: Props) => {
    type: string;
    props: Props;
};
export declare const setFrameTimestamp: (props: Props) => {
    type: string;
    props: Props;
};
export declare const setTimeStamp: (props: Props) => {
    type: string;
    props: Props;
};
export declare const setTime: (time: number) => {
    type: string;
    time: number;
};
export declare const setLeading: (leading: number) => {
    type: string;
    leading: number;
};
export declare const setTrailing: (trailing: number) => {
    type: string;
    trailing: number;
};
export declare const setViewport: (viewport: Viewport) => {
    type: string;
    viewport: Viewport;
};
export declare const setLightSettings: (lightSettings: LightSettings) => {
    type: string;
    lightSettings: LightSettings;
};
export declare const setMovesBase: (base: MovesbaseFile | Movesbase[]) => {
    type: string;
    base: MovesbaseFile | Movesbase[];
};
export declare const setDepotsBase: (depotsBase: Depotsbase[]) => {
    type: string;
    depotsBase: Depotsbase[];
};
export declare const setAnimatePause: (pause: boolean) => {
    type: string;
    pause: boolean;
};
export declare const setAnimateReverse: (reverse: boolean) => {
    type: string;
    reverse: boolean;
};
export declare const setSecPerHour: (secperhour: number) => {
    type: string;
    secperhour: number;
};
export declare const setClicked: (clickedObject: ClickedObject[]) => {
    type: string;
    clickedObject: ClickedObject[];
};
export declare const setRoutePaths: (paths: RoutePaths[]) => {
    type: string;
    paths: RoutePaths[];
};
export declare const setDefaultZoom: (defaultZoom: number) => {
    type: string;
    defaultZoom: number;
};
export declare const setDefaultPitch: (defaultPitch: number) => {
    type: string;
    defaultPitch: number;
};
export declare const setMovesOptionFunc: (func: (props: Props, i: number, j: number) => any) => {
    type: string;
    func: (props: Props, i: number, j: number) => any;
};
export declare const setDepotsOptionFunc: (func: (props: Props, i: number) => any) => {
    type: string;
    func: (props: Props, i: number) => any;
};
export declare const setNonmapView: (nonmapView: boolean) => {
    type: string;
    nonmapView: boolean;
};
export declare const setLinemapData: (linemapData: LineMapData[]) => {
    type: string;
    linemapData: LineMapData[];
};
export declare const setLoading: (loading: boolean) => {
    type: string;
    loading: boolean;
};
export declare const setInputFilename: (inputFileName: Object) => {
    type: string;
    inputFileName: Object;
};
