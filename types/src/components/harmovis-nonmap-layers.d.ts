import * as React from 'react';
import { Layer } from 'deck.gl';
import { Viewport, ActionTypes } from '../types';
interface Props {
    viewport: Viewport;
    actions: ActionTypes;
    onChangeViewport?(viewport: Viewport): any;
    layers: Layer[];
}
export default class HarmoVisNonMapLayers extends React.Component<Props, any> {
    componentDidMount(): void;
    initialize(gl: any): void;
    canvas: any;
    render(): JSX.Element;
}
export {};
