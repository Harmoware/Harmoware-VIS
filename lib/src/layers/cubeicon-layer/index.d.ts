import { Layer } from '@deck.gl/core';
import { LayerProps, AttributeManager } from 'deck.gl';
import { Model } from 'luma.gl';
import { LightSettings } from '../../types';
interface Data {
    position: number[];
    elevation: number[];
    color: number[][];
}
interface Props extends LayerProps {
    cellSize?: number;
    coverage?: number;
    elevationScale?: number;
    extruded?: boolean;
    fp64?: boolean;
    lightSettings: LightSettings;
    getPosition?: (x: any) => number[];
    getElevation?: (x: any) => number[];
    getColor?: (x: any) => (number | number[])[];
}
interface State {
    attributeManager: AttributeManager;
    model: Model;
}
interface Attribute {
    value: number[];
    size: number;
}
export default class CubeiconLayer extends Layer<Props, State> {
    constructor(props: Props);
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
    getModel(gl: WebGLRenderingContext): Model;
    updateUniforms(): void;
    getNumInstances(props: Props): any;
    draw(): void;
    calculateInstancePositions(attribute: Attribute): void;
    calculateInstanceColors(attribute: Attribute): void;
}
export {};
