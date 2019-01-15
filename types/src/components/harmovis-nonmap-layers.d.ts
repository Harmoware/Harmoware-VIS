import * as React from 'react';
import { Layer } from 'deck.gl';
import { Viewport, ActionTypes } from '../types';
interface Props {
    viewport: Viewport;
    actions: ActionTypes;
    onViewportChange?(viewport: Viewport): void;
    layers: Layer[];
}
export default class HarmoVisNonMapLayers extends React.Component<Props> {
    componentDidMount(): void;
    initialize(gl: WebGLRenderingContext): void;
    canvas: HTMLCanvasElement;
    render(): JSX.Element;
}
export {};
