import { Layer } from 'deck.gl';
import { LightSettings } from '../../types';
declare type Data = {
    position: Array<number>;
    elevation: Array<number>;
    color: Array<Array<number>>;
};
interface Props {
    id?: string;
    data?: Array<Data>;
    visible?: boolean;
    cellSize?: number;
    coverage?: number;
    elevationScale?: number;
    opacity?: number;
    extruded?: boolean;
    fp64?: boolean;
    lightSettings?: LightSettings;
    getPosition?: (x: any) => Array<number>;
    getElevation?: (x: any) => Array<number>;
    getColor?: (x: any) => Array<Array<number>>;
}
interface State {
    attributeManager: any;
    model: any;
}
export default class CubeiconLayer extends Layer<Props, State> {
    constructor(props: any);
    static defaultProps: {
        visible: boolean;
        cellSize: number;
        coverage: number;
        elevationScale: number;
        opacity: number;
        extruded: boolean;
        fp64: boolean;
        getPosition: (x: Data) => number[];
        getElevation: (x: Data) => number[];
        getColor: (x: Data) => number[][];
    };
    static layerName: string;
    getShaders(): {
        vs: string;
        fs: string;
        modules: string[];
        shaderCache: any;
    };
    initializeState(): void;
    updateState({ props, oldProps, changeFlags }: {
        props: any;
        oldProps: any;
        changeFlags: any;
    }): void;
    getModel(gl: any): any;
    updateUniforms(): void;
    getNumInstances(props: Props): number;
    draw(): void;
    calculateInstancePositions(attribute: {
        value: Array<number>;
        size: number;
    }): void;
    calculateInstanceColors(attribute: {
        value: Array<number>;
        size: number;
    }): void;
}
export {};
