import * as React from 'react';
import MapGL from 'react-map-gl';
import { Layer } from '@deck.gl/core';
import DeckGL from '@deck.gl/react';
import { ActionTypes, Viewport } from '../types';

interface thisViewport extends Viewport {
  width: number,
  height: number,
}

interface Props {
  viewport : Viewport,
  mapboxApiAccessToken: string,
  mapStyle?: string,
  actions: ActionTypes,
  onViewportChange?(viewport: Viewport): void,
  layers: Layer[],
  mapGlComponents?: any
}

export default class HarmoVisLayers extends React.Component<Props> {
  static defaultProps = {
    mapStyle: 'mapbox://styles/mapbox/dark-v8',
    mapGlComponents: null
  }

  componentDidMount() {
    this.props.actions.setNonmapView(false);
  }

  initialize(gl: WebGLRenderingContext) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    const { viewport, mapStyle, actions, mapboxApiAccessToken, layers, mapGlComponents } = this.props;
    const onViewportChange = this.props.onViewportChange || actions.setViewport;

    return (
      <MapGL
        {...(viewport as thisViewport)} mapStyle={mapStyle}
        onViewportChange={onViewportChange as any}
        mapboxApiAccessToken={mapboxApiAccessToken}
      >
        { mapGlComponents }
        <DeckGL {...viewport} layers={layers} onWebGLInitialized={this.initialize} />
      </MapGL>
    );
  }
}
