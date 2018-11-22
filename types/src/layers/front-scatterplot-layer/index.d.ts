import { Layer } from 'deck.gl';
declare type Data = {
    position: Array<number>;
    radius: number;
    color: Array<number>;
};
interface Props {
    data: Array<Data>;
    radiusScale?: number;
    radiusMinPixels?: number;
    radiusMaxPixels?: number;
    getPosition?: (x: any) => Array<number>;
    getRadius?: (x: any) => number;
    getColor?: (x: any) => Array<number>;
    onHover?: (el: any) => void;
    onClick?: (el: any) => void;
}
interface State {
    attributeManager: any;
    model: any;
}
export default class FrontScatterplotLayer extends Layer<Props, State> {
    constructor(props: any);
    static defaultProps: {
        radiusScale: number;
        radiusMinPixels: number;
        radiusMaxPixels: number;
        getPosition: (x: Data) => number[];
        getRadius: (x: Data) => number;
        getColor: (x: Data) => number[];
    };
    static layerName: string;
    getShaders(): {
        vs: string;
        fs: string;
        shaderCache: any;
    };
    initializeState(): void;
    draw({ uniforms }: any): void;
    getModel(gl: any): any;
    calculateInstancePositions(attribute: {
        value: Array<number>;
        size: number;
    }): void;
    calculateInstanceRadius(attribute: {
        value: Array<number>;
        size: number;
    }): void;
    calculateInstanceColors(attribute: {
        value: Array<number>;
        size: number;
    }): void;
}
export {};
