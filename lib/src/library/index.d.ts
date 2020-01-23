import * as Actions from '../actions';
import { AnalyzedBaseData, BasedProps as Props, RoutePaths, MovesbaseFile, Movesbase, MovedData, DepotsData, ClickedObject, EventInfo } from '../types';
export declare const getContainerProp: <P>(state: P) => P;
export declare const calcLoopTime: (timeLength: number, secperhour: number) => number;
export declare const analyzeMovesBase: (inputData: MovesbaseFile | Movesbase[]) => AnalyzedBaseData;
export declare const getDepots: (props: Props) => DepotsData[];
export declare const getMoveObjects: (props: Props) => MovedData[];
export interface pickParams {
    mode: string;
    info: EventInfo;
}
export declare const onHoverClick: (pickParams: pickParams, getColor: any) => void;
export declare const checkClickedObjectToBeRemoved: (movedData: MovedData[], clickedObject: ClickedObject[], routePaths: RoutePaths[], actions: typeof Actions) => void;
export declare const defaultMapStateToProps: <P>(state: P) => P;
export declare const connectToHarmowareVis: (App: any, moreActions?: any, mapStateToProps?: <P>(state: P) => P) => any;
export declare const getCombinedReducer: (combined?: object) => import("redux").Reducer<import("redux").CombinedState<{
    base: import("../types").BasedState;
}>, import("redux").AnyAction>;
