import * as React from 'react';
import { Layer } from 'deck.gl';
import { Viewport } from '../types';
import { setViewport, setNonmapView } from '../actions';
interface Props {
    viewport: Viewport;
    mapboxApiAccessToken: string;
    mapStyle: string;
    actions: {
        setViewport: typeof setViewport;
        setNonmapView: typeof setNonmapView;
    };
    onChangeViewport: typeof setViewport;
    layers: Array<typeof Layer>;
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
