import * as React from 'react';
import { Layer } from '@deck.gl/core';
import { Viewport, ActionTypes } from '../types';
interface Props {
    viewport: Viewport;
    actions: ActionTypes;
    layers: Layer[];
}
export default class HarmoVisNonMapLayers extends React.Component<Props> {
    constructor(props: Props);
    onViewStateChange({ viewState }: {
        viewState: any;
    }): void;
    onLoad(): void;
    rotateCamera(): void;
    componentDidMount(): void;
    initialize(gl: WebGLRenderingContext): void;
    canvas: HTMLCanvasElement;
    render(): JSX.Element;
}
export {};
