import { BasedState, BasedProps, LocationData, LocationDataOption, Movesbase, MovesbaseFile, Depotsbase, Viewport, ClickedObject, RoutePaths, GetMovesOptionFunc, GetDepotsOptionFunc, GetExtractedDataFunc, LineMapData } from '../types';
interface Action<T> {
    type: string;
    payload: T;
}
export declare const baseSlice: import("@reduxjs/toolkit").Slice<BasedState, {
    addMinutes: (state: BasedState, action: Action<number>) => BasedState;
    setViewport: (state: BasedState, action: Action<Viewport>) => BasedState;
    setDefaultViewport: (state: BasedState, action: Action<{
        defaultZoom?: number;
        defaultPitch?: number;
    }>) => BasedState;
    setTimeStamp: (state: BasedState, action: Action<BasedProps>) => BasedState;
    setTime: (state: BasedState, action: Action<number>) => BasedState;
    increaseTime: (state: BasedState, action: Action<BasedProps>) => BasedState;
    decreaseTime: (state: BasedState, action: Action<BasedProps>) => BasedState;
    setLeading: (state: BasedState, action: Action<number>) => BasedState;
    setTrailing: (state: BasedState, action: Action<number>) => BasedState;
    setFrameTimestamp: (state: BasedState, action: Action<BasedProps>) => BasedState;
    setMovesBase: (state: BasedState, action: Action<(Movesbase[] | MovesbaseFile)>) => BasedState;
    setDepotsBase: (state: BasedState, action: Action<Depotsbase[]>) => BasedState;
    setLocationData: (state: BasedState, action: Action<Readonly<LocationData>>) => BasedState;
    setLocationDataOption: (state: BasedState, action: Action<LocationDataOption>) => BasedState;
    setAnimatePause: (state: BasedState, action: Action<boolean>) => BasedState;
    setAnimateReverse: (state: BasedState, action: Action<boolean>) => BasedState;
    setSecPerHour: (state: BasedState, action: Action<number>) => BasedState;
    setMultiplySpeed: (state: BasedState, action: Action<number>) => BasedState;
    setClicked: (state: BasedState, action: Action<(null | ClickedObject[])>) => BasedState;
    setRoutePaths: (state: BasedState, action: Action<RoutePaths[]>) => BasedState;
    setDefaultPitch: (state: BasedState, action: Action<number>) => BasedState;
    setMovesOptionFunc: (state: BasedState, action: Action<GetMovesOptionFunc>) => BasedState;
    setDepotsOptionFunc: (state: BasedState, action: Action<GetDepotsOptionFunc>) => BasedState;
    setExtractedDataFunc: (state: BasedState, action: Action<GetExtractedDataFunc>) => BasedState;
    setLinemapData: (state: BasedState, action: Action<LineMapData[]>) => BasedState;
    setLoading: (state: BasedState, action: Action<boolean>) => BasedState;
    setInputFilename: (state: BasedState, action: Action<Object>) => BasedState;
    updateMovesBase: (state: BasedState, action: Action<Movesbase[]>) => BasedState;
    setNoLoop: (state: BasedState, action: Action<boolean>) => BasedState;
    setInitialViewChange: (state: BasedState, action: Action<boolean>) => BasedState;
    setIconGradationChange: (state: BasedState, action: Action<boolean>) => BasedState;
    setTimeBegin: (state: BasedState, action: Action<number>) => BasedState;
    setTimeLength: (state: BasedState, action: Action<number>) => BasedState;
    addMovesBaseData: (state: BasedState, action: Action<Movesbase[]>) => BasedState;
}, "base">;
declare const _default: import("redux").Reducer<BasedState, import("redux").AnyAction>;
export default _default;
