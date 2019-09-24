import { BasedProps as Props, LightSettings, Viewport, Movesbase, MovesbaseFile, Depotsbase, ClickedObject, RoutePaths, LineMapData } from '../types';
export declare const addMinutes: {
    (payload: number, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<number>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<number>;
};
export declare const increaseTime: {
    (payload: Props, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<Props>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<Props>;
};
export declare const decreaseTime: {
    (payload: Props, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<Props>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<Props>;
};
export declare const setFrameTimestamp: {
    (payload: Props, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<Props>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<Props>;
};
export declare const setTimeStamp: {
    (payload: Props, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<Props>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<Props>;
};
export declare const setTime: {
    (payload: number, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<number>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<number>;
};
export declare const setLeading: {
    (payload: number, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<number>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<number>;
};
export declare const setTrailing: {
    (payload: number, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<number>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<number>;
};
export declare const setViewport: {
    (payload: Viewport, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<Viewport>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<Viewport>;
};
export declare const setDefaultViewport: import("typescript-fsa").ActionCreator<void>;
export declare const setLightSettings: {
    (payload: LightSettings, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<LightSettings>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<LightSettings>;
};
export declare const setMovesBase: {
    (payload: MovesbaseFile | Movesbase[], meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<MovesbaseFile | Movesbase[]>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<MovesbaseFile | Movesbase[]>;
};
export declare const setDepotsBase: {
    (payload: Depotsbase[], meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<Depotsbase[]>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<Depotsbase[]>;
};
export declare const setAnimatePause: {
    (payload: boolean, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<boolean>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<boolean>;
};
export declare const setAnimateReverse: {
    (payload: boolean, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<boolean>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<boolean>;
};
export declare const setSecPerHour: {
    (payload: number, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<number>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<number>;
};
export declare const setClicked: {
    (payload: ClickedObject[], meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<ClickedObject[]>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<ClickedObject[]>;
};
export declare const setRoutePaths: {
    (payload: RoutePaths[], meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<RoutePaths[]>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<RoutePaths[]>;
};
export declare const setDefaultZoom: {
    (payload: number, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<number>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<number>;
};
export declare const setDefaultPitch: {
    (payload: number, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<number>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<number>;
};
export declare const setMovesOptionFunc: {
    (payload: (props: Props, i: number, j: number) => object, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<(props: Props, i: number, j: number) => object>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<(props: Props, i: number, j: number) => object>;
};
export declare const setDepotsOptionFunc: {
    (payload: (props: Props, i: number) => object, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<(props: Props, i: number) => object>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<(props: Props, i: number) => object>;
};
export declare const setLinemapData: {
    (payload: LineMapData[], meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<LineMapData[]>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<LineMapData[]>;
};
export declare const setLoading: {
    (payload: boolean, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<boolean>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<boolean>;
};
export declare const setInputFilename: {
    (payload: Object, meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<Object>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<Object>;
};
export declare const updateMovesBase: {
    (payload: MovesbaseFile | Movesbase[], meta?: {
        [key: string]: any;
    }): import("typescript-fsa").Action<MovesbaseFile | Movesbase[]>;
    type: string;
    match: (action: import("typescript-fsa").AnyAction) => action is import("typescript-fsa").Action<MovesbaseFile | Movesbase[]>;
};
