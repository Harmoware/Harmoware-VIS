/// <reference types="mapbox-gl" />
import * as React from 'react';
import InteractiveMap from 'react-map-gl';
import { Layer } from '@deck.gl/core';
import { ActionTypes, Viewport } from '../types';
declare type InteractiveMapProps = Parameters<typeof InteractiveMap>[0];
interface Props extends Omit<InteractiveMapProps, "transitionDuration"> {
    viewport: Viewport;
    actions: ActionTypes;
    layers: Layer[];
    mapGlComponents?: any;
    mapboxAddLayerValue?: mapboxgl.Layer[];
    terrain?: boolean;
    terrainSource?: {
        id: string;
        source: object;
    };
    setTerrain?: {
        source: string;
        exaggeration?: number;
    };
    transitionDuration?: number | 'auto';
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
        terrain: boolean;
        terrainSource: {
            id: string;
            source: {
                type: string;
                url: string;
            };
        };
        setTerrain: {
            source: string;
        };
        transitionDuration: number;
    };
    constructor(props: Props);
    componentDidUpdate(prevProps: Props): void;
    initialize(gl: WebGLRenderingContext): void;
    render(): JSX.Element;
}
export {};
