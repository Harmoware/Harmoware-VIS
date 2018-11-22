import { Layer } from 'deck.gl';
interface Props {
    id?: string;
    data?: any;
    getSourcePosition?: any;
    getTargetPosition?: any;
    getSourceColor?: any;
    getTargetColor?: any;
    getStrokeWidths?: any;
}
interface State {
    attributeManager: any;
    model: any;
}
export default class DepotsArcLayer extends Layer<Props, State> {
    static defaultProps: {
        getSourcePosition: (x: any) => any;
        getTargetPosition: (x: any) => any;
        getSourceColor: (x: any) => any;
        getTargetColor: (x: any) => any;
        getStrokeWidths: (x: any) => any;
    };
    static layerName: string;
    constructor(props: any);
    getShaders(): {
        vs: string;
        fs: string;
    };
    initializeState(): void;
    getModel(gl: any): any;
    calculateInstancePositions(attribute: any): void;
    calculateInstanceSourceColors(attribute: any): void;
    calculateInstanceTargetColors(attribute: any): void;
    calculateInstanceStrokeWidths(attribute: any): void;
}
export {};
