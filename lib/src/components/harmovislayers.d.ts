/// <reference types="mapbox-gl" />
import * as React from 'react';
import { TransitionInterpolator, TRANSITION_EVENTS } from 'react-map-gl';
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
    flytoArgument?: FlyToProps;
    transitionDuration?: number | 'auto';
    transitionInterpolator?: TransitionInterpolator;
    transitionInterruption?: TRANSITION_EVENTS;
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
        flytoArgument: any;
        transitionDuration: any;
        transitionInterpolator: any;
        transitionInterruption: any;
    };
    constructor(props: Props);
    componentDidUpdate(prevProps: Props): void;
    initialize(gl: WebGLRenderingContext): void;
    render(): JSX.Element;
}
export {};
