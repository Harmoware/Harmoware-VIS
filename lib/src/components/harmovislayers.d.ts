/// <reference types="mapbox-gl" />
import * as React from 'react';
import { Layer } from '@deck.gl/core';
import { FlyToProps } from 'deck.gl';
import { ActionTypes, Viewport } from '../types';
interface Props {
    visible?: boolean;
    viewport: Viewport;
    mapboxApiAccessToken: string;
    mapStyle?: string;
    actions: ActionTypes;
    onViewportChange?(viewport: Viewport): void;
    layers: Layer[];
    mapGlComponents?: any;
    mapboxAddLayerValue?: mapboxgl.Layer[];
    flyto?: boolean;
    flytoArgument?: FlyToProps;
    transitionDuration?: number | 'auto';
}
interface State {
    flyto?: boolean;
}
export default class HarmoVisLayers extends React.Component<Props, State> {
    static defaultProps: {
        visible: boolean;
        mapStyle: string;
        mapGlComponents: any;
        mapboxAddLayerValue: {
            id: string;
            source: string;
            "source-layer": string;
            filter: string[];
            type: string;
            paint: {
                "fill-extrusion-color": string;
                "fill-extrusion-height": (string | number | string[])[];
                "fill-extrusion-base": (string | number | string[])[];
                "fill-extrusion-opacity": number;
            };
        }[];
        flyto: boolean;
        flytoArgument: any;
        transitionDuration: any;
    };
    constructor(props: Props);
    componentDidUpdate(prevProps: Props): void;
    initialize(gl: WebGLRenderingContext): void;
    onViewportChange(viewState: Viewport): void;
    transitionDuration: (number | 'auto');
    render(): JSX.Element;
}
export {};
