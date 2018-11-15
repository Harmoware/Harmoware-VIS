import * as Actions from '../actions';
import { AnalyzedBaseData, BasedProps as Props, RoutePaths, MovesbaseFile, Movesbase, MovedData, Depotsbase, DepotsData, ClickedObject, LineMapData } from '../types';
export declare const getContainerProp: (state: any) => any;
export declare const calcLoopTime: (timeLength: number, secperhour: number) => number;
export declare const analyzeMovesBase: (nonmapView: boolean, inputData: Movesbase[] | MovesbaseFile) => AnalyzedBaseData;
export declare const analyzeDepotsBase: (nonmapView: boolean, depotsBase: Depotsbase[]) => Depotsbase[];
export declare const getDepots: (props: Props) => DepotsData[];
export declare const getMoveObjects: (props: Props) => MovedData[];
export declare const onHoverClick: (pickParams: {
    mode: string;
    info: {
        object: {
            movesbaseidx: number;
        };
        layer: {
            id: string;
            props: {
                movesbase: Movesbase[];
                routePaths: RoutePaths[];
                actions: typeof Actions;
                clickedObject: ClickedObject[];
                onHover: Function;
                onClick: Function;
            };
        };
    };
}) => void;
export declare const checkClickedObjectToBeRemoved: (movedData: MovedData[], clickedObject: ClickedObject[], routePaths: RoutePaths[], actions: typeof Actions) => void;
export declare const analyzelinemapData: (nonmapView: boolean, linemapData: LineMapData[]) => LineMapData[];
export declare const defaultMapStateToProps: (state: any) => any;
export declare const connectToHarmowareVis: (App: any, moreActions?: any, mapStateToProps?: any) => any;
export declare const getCombinedReducer: (combined: any) => any;
