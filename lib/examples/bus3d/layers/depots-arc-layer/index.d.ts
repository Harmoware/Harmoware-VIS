import { Layer, LayerProps, AttributeManager } from 'deck.gl';
import { Model } from 'luma.gl';
import { Arcdata } from '../../types';
interface Props extends LayerProps {
    id: string;
    data: Arcdata[];
    getSourcePosition?: (x: Arcdata) => number[];
    getTargetPosition?: (x: Arcdata) => number[];
    getSourceColor?: (x: Arcdata) => number[];
    getTargetColor?: (x: Arcdata) => number[];
    getStrokeWidths?: (x: Arcdata) => number;
}
interface State {
    attributeManager: AttributeManager;
    model: Model;
}
interface Attribute {
    value: number[];
    size: number;
}
export default class DepotsArcLayer extends Layer<Props, State> {
    static defaultProps: {
        getSourcePosition: (x: Arcdata) => number[];
        getTargetPosition: (x: Arcdata) => number[];
        getSourceColor: (x: Arcdata) => number[];
        getTargetColor: (x: Arcdata) => number[];
        getStrokeWidths: (x: Arcdata) => number;
    };
    static layerName: string;
    constructor(props: Props);
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
