import { ActionTypes, AnalyzedBaseData, BasedState, RoutePaths, MovesbaseFile, Movesbase, MovedData, DepotsData, ClickedObject, EventInfo } from '../types';
export declare const getContainerProp: <P>(state: P) => P;
export declare const safeCheck: (value: number) => number;
export declare const safeAdd: (left: number, right: number) => number;
export declare const safeSubtract: (left: number, right: number) => number;
export declare const analyzeMovesBase: (state: BasedState, inputData: (Movesbase[] | MovesbaseFile), update: boolean) => AnalyzedBaseData;
export declare const getDepots: (props: BasedState) => DepotsData[];
interface RetrunState extends Pick<Partial<BasedState>, 'movedData' | 'locationData' | 'ExtractedData'> {
}
export declare const getMoveObjects: (props: Readonly<BasedState>) => RetrunState;
export declare const onDefaultClick: (event: EventInfo) => void;
export declare const checkClickedObjectToBeRemoved: (movedData: MovedData[], clickedObject: null | ClickedObject[], routePaths: RoutePaths[], actions: ActionTypes) => void;
export declare const defaultMapStateToProps: <P>(state: P) => P;
export declare const connectToHarmowareVis: (App: any, moreActions?: any, mapStateToProps?: <P>(state: P) => P) => import("react-redux").ConnectedComponent<any, Omit<unknown, never> & import("react-redux").ConnectProps>;
export declare const getCombinedReducer: (combined?: object) => import("redux").Reducer<import("redux").CombinedState<{
    base: BasedState;
}>, import("redux").AnyAction>;
export declare const getConfigureStore: (combined?: object) => import("@reduxjs/toolkit").EnhancedStore<import("redux").CombinedState<{
    base: BasedState;
}>, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<[import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
    base: BasedState;
}>, import("redux").AnyAction, undefined>]>>;
export {};
