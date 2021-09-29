import { ActionTypes, AnalyzedBaseData, BasedState, RoutePaths, IconDesignation, MovesbaseFile, Movesbase, MovedData, DepotsData, ClickedObject, EventInfo } from '../types';
export declare const getContainerProp: <P>(state: P) => P;
export declare const safeCheck: (value: number) => number;
export declare const safeAdd: (left: number, right: number) => number;
export declare const safeSubtract: (left: number, right: number) => number;
export declare const analyzeMovesBase: (state: BasedState, inputData: (Movesbase[] | MovesbaseFile), update: boolean) => AnalyzedBaseData;
export declare const getDepots: (props: BasedState) => DepotsData[];
export declare const getMoveObjects: (props: BasedState) => {
    movedData?: MovedData[];
    ExtractedData?: any;
};
export interface pickParams {
    mode: string;
    info: EventInfo;
}
export declare const onHoverClick: (pickParams: pickParams, getRouteColor: Function, getRouteWidth: Function, iconDesignations: IconDesignation[]) => void;
export declare const checkClickedObjectToBeRemoved: (movedData: MovedData[], clickedObject: null | ClickedObject[], routePaths: RoutePaths[], actions: ActionTypes) => void;
export declare const defaultMapStateToProps: <P>(state: P) => P;
export declare const connectToHarmowareVis: (App: any, moreActions?: any, mapStateToProps?: <P>(state: P) => P) => import("react-redux").ConnectedComponent<any, import("react-redux").Omit<unknown, never>>;
export declare const getCombinedReducer: (combined?: object) => import("redux").Reducer<import("redux").CombinedState<{
    base: BasedState;
}>, import("redux").AnyAction>;
