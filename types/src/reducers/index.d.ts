import { BasedState as State, BasedProps, Viewport, LightSettings, Movesbase, MovesbaseFile, Depotsbase, ClickedObject, RoutePaths, GetMovesOptionFunc, GetDepotsOptionFunc, LineMapData, AnyObject } from '../types';
interface ActionTypes {
    type: string;
    min?: number;
    props?: BasedProps;
    time?: number;
    leading?: number;
    trailing?: number;
    viewport?: Viewport;
    lightSettings?: LightSettings;
    base?: Array<Movesbase> | MovesbaseFile;
    depotsBase?: Array<Depotsbase>;
    pause?: boolean;
    reverse?: boolean;
    secperhour?: number;
    clickedObject?: null | Array<ClickedObject>;
    paths?: Array<RoutePaths>;
    defaultZoom?: number;
    defaultPitch?: number;
    func?: GetMovesOptionFunc | GetDepotsOptionFunc;
    nonmapView?: boolean;
    linemapData?: Array<LineMapData>;
    loading?: boolean;
    inputFileName?: AnyObject;
}
declare const _default: (state: State, action: ActionTypes) => State;
export default _default;
