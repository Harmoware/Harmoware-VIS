/// <reference types="mapbox-gl" />
import * as React from 'react';
import { Layer } from '@deck.gl/core';
import { ActionTypes, Viewport } from '../types';
interface Props extends addlProps {
    viewport: Viewport;
    mapboxApiAccessToken: string;
    mapStyle?: string;
    actions: ActionTypes;
    onViewportChange?(viewport: Viewport): void;
    layers: Layer[];
    mapGlComponents?: any;
}
interface addlProps {
    mapboxAddLayerValue?: mapboxgl.Layer;
}
export default class HarmoVisLayers extends React.Component<Props> {
    static defaultProps: {
        mapStyle: string;
        mapGlComponents: any;
        mapboxAddLayerValue: {
            "id": string;
            "source": string;
            "source-layer": string;
            "filter": string[];
            "type": string;
            "paint": {
                "fill-extrusion-color": string;
                "fill-extrusion-height": (string | number | string[])[];
                "fill-extrusion-base": (string | number | string[])[];
                "fill-extrusion-opacity": number;
            };
        };
    };
    constructor(props: Props);
    componentDidMount(): void;
    initialize(gl: WebGLRenderingContext): void;
    render(): JSX.Element;
}
export {};
