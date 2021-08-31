/// <reference types="mapbox-gl" />
import * as React from 'react';
import { TransitionInterpolator } from 'react-map-gl';
import type { TRANSITION_EVENTS } from 'react-map-gl';
import { Layer } from '@deck.gl/core';
import { ActionTypes, Viewport } from '../types';
declare type FlyToInterpolatorProps = any;
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
    flytoArgument?: FlyToInterpolatorProps;
    transitionDuration?: number | 'auto';
    transitionInterpolator?: TransitionInterpolator;
    transitionInterruption?: typeof TRANSITION_EVENTS;
}
interface State {
    transition?: boolean;
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
        transitionDuration: number;
        transitionInterpolator: any;
        transitionInterruption: any;
    };
    constructor(props: Props);
    componentDidUpdate(prevProps: Props): void;
    initialize(gl: WebGLRenderingContext): void;
    render(): JSX.Element;
}
export {};
