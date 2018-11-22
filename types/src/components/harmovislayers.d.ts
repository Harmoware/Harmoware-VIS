import * as React from 'react';
import { Layer } from 'deck.gl';
import { ActionTypes, Viewport } from '../types';
interface Props {
    viewport: Viewport;
    mapboxApiAccessToken: string;
    mapStyle?: string;
    actions: ActionTypes;
    onChangeViewport?(viewport: Viewport): any;
    layers: Layer[];
}
export default class HarmoVisLayers extends React.Component<Props> {
    static defaultProps: {
        mapStyle: string;
    };
    componentDidMount(): void;
    initialize(gl: any): void;
    render(): JSX.Element;
}
export {};
