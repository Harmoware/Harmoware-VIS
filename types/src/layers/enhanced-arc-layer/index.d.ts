import { Layer } from 'deck.gl';
declare type Data = {
    sourcePosition: Array<number>;
    targetPosition: Array<number>;
    sourceColor: Array<number>;
    targetColor: Array<number>;
    color: Array<number>;
    strokeWidth: number;
};
interface Props {
    id?: string;
    data?: Array<Data>;
    visible?: boolean;
    opacity?: number;
    getSourcePosition?: (x: any) => Array<number>;
    getTargetPosition?: (x: any) => Array<number>;
    getSourceColor?: (x: any) => Array<number>;
    getTargetColor?: (x: any) => Array<number>;
    getStrokeWidths?: (x: any) => number;
}
interface State {
    attributeManager: any;
    model: any;
}
export default class EnhancedArcLayer extends Layer<Props, State> {
    constructor(props: any);
    static defaultProps: {
        visible: boolean;
        opacity: number;
        getSourcePosition: (x: Data) => number[];
        getTargetPosition: (x: Data) => number[];
        getSourceColor: (x: Data) => number[];
        getTargetColor: (x: Data) => number[];
        getStrokeWidths: (x: Data) => number;
    };
    static layerName: string;
    getShaders(): {
        vs: string;
        fs: string;
    };
    initializeState(): void;
    getModel(gl: any): any;
    calculateInstancePositions(attribute: {
        value: Array<number>;
        size: number;
    }): void;
    calculateInstanceSourceColors(attribute: {
        value: Array<number>;
        size: number;
    }): void;
    calculateInstanceTargetColors(attribute: {
        value: Array<number>;
        size: number;
    }): void;
    calculateInstanceStrokeWidths(attribute: {
        value: Array<number>;
        size: number;
    }): void;
}
export {};
