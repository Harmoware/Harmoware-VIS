import { Layer } from '@deck.gl/core';
import { LayerProps, AttributeManager } from 'deck.gl';
import { Model } from 'luma.gl';
import { LightSettings } from '../../types';
interface Props extends LayerProps {
    cellSize?: number;
    coverage?: number;
    heightScale?: number;
    extruded?: boolean;
    lightSettings: LightSettings;
    getPosition?: (x: any) => number[];
    getHeight?: (x: any) => number;
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
export default class CubeiconLayer extends Layer<Props, State> {
    constructor(props: Props);
    static defaultProps: Props;
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
    getNumInstances(props: Props): number;
    draw(): void;
    calculateInstancePositions(attribute: Attribute): void;
    calculateInstanceColors(attribute: Attribute): void;
}
export {};
