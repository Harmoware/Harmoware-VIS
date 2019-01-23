import { Layer, LayerProps, AttributeManager } from 'deck.gl';
import { Model } from 'luma.gl';
declare type Data = {
    sourcePosition: number[];
    targetPosition: number[];
    sourceColor: number[];
    targetColor: number[];
    color: number[];
    strokeWidth: number;
};
interface Props extends LayerProps {
    data: Data[];
    getSourcePosition?: (x: Data) => number[];
    getTargetPosition?: (x: Data) => number[];
    getSourceColor?: (x: Data) => number[];
    getTargetColor?: (x: Data) => number[];
    getStrokeWidths?: (x: Data) => number;
}
interface State {
    attributeManager: AttributeManager;
    model: Model;
}
interface Attribute {
    value: number[];
    size: number;
}
export default class EnhancedArcLayer extends Layer<Props, State> {
    constructor(props: Props);
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
    getModel(gl: WebGLRenderingContext): Model;
    calculateInstancePositions(attribute: Attribute): void;
    calculateInstanceSourceColors(attribute: Attribute): void;
    calculateInstanceTargetColors(attribute: Attribute): void;
    calculateInstanceStrokeWidths(attribute: Attribute): void;
}
export {};
