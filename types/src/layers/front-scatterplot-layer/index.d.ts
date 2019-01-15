import { Layer, LayerProps, AttributeManager } from 'deck.gl';
import { Model } from 'luma.gl';
declare type Data = {
    position: number[];
    radius: number;
    color: (number | number[])[];
};
interface Props extends LayerProps {
    data: Data[];
    radiusScale?: number;
    radiusMinPixels?: number;
    radiusMaxPixels?: number;
    getPosition?: (x: any) => number[];
    getRadius?: (x: any) => number;
    getColor?: (x: any) => number[];
}
interface State {
    attributeManager: AttributeManager;
    model: Model;
}
interface Attribute {
    value: number[];
    size: number;
}
export default class FrontScatterplotLayer extends Layer<Props, State> {
    constructor(props: Props);
    static defaultProps: {
        radiusScale: number;
        radiusMinPixels: number;
        radiusMaxPixels: number;
        getPosition: (x: Data) => number[];
        getRadius: (x: Data) => number;
        getColor: (x: Data) => (number | number[])[];
    };
    static layerName: string;
    getShaders(): {
        vs: string;
        fs: string;
        shaderCache: any;
    };
    initializeState(): void;
    draw({ uniforms }: {
        uniforms: any;
    }): void;
    getModel(gl: WebGLRenderingContext): Model;
    calculateInstancePositions(attribute: Attribute): void;
    calculateInstanceRadius(attribute: Attribute): void;
    calculateInstanceColors(attribute: Attribute): void;
}
export {};
