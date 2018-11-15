import * as React from 'react';
import { Layer } from 'deck.gl';
import { BaseActions as Actions, Viewport } from '../types';
import { setViewport } from '../actions';
interface Props {
    viewport: Viewport;
    actions: Actions;
    onChangeViewport: typeof setViewport;
    layers: Array<typeof Layer>;
}
export default class HarmoVisNonMapLayers extends React.Component<Props, any> {
    componentDidMount(): void;
    initialize(gl: any): void;
    canvas: any;
    render(): JSX.Element;
}
export {};
