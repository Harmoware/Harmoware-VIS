import * as Actions from '../actions';
import { AnalyzedBaseData, BasedProps as Props, RoutePaths, MovesbaseFile, Movesbase, MovedData, Depotsbase, DepotsData, ClickedObject, LineMapData, EventInfo } from '../types';
export declare const getContainerProp: <P>(state: P) => P;
export declare const calcLoopTime: (timeLength: number, secperhour: number) => number;
export declare const analyzeMovesBase: (nonmapView: boolean, inputData: MovesbaseFile | Movesbase[]) => AnalyzedBaseData;
export declare const analyzeDepotsBase: (nonmapView: boolean, depotsBase: Depotsbase[]) => Depotsbase[];
export declare const getDepots: (props: Props) => DepotsData[];
export declare const getMoveObjects: (props: Props) => MovedData[];
export interface pickParams {
    mode: string;
    info: EventInfo;
}
export declare const onHoverClick: (pickParams: pickParams) => void;
export declare const checkClickedObjectToBeRemoved: (movedData: MovedData[], clickedObject: ClickedObject[], routePaths: RoutePaths[], actions: typeof Actions) => void;
export declare const analyzelinemapData: (nonmapView: boolean, linemapData: LineMapData[]) => LineMapData[];
export declare const defaultMapStateToProps: <P>(state: P) => P;
export declare const connectToHarmowareVis: (App: any, moreActions?: any, mapStateToProps?: <P>(state: P) => P) => import("react-redux").ConnectedComponentClass<any, Pick<{}, never>>;
export declare const getCombinedReducer: (combined?: object) => import("redux").Reducer<{}>;
