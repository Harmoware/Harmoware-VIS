import * as React from 'react';
import MapGL from 'react-map-gl';
import DeckGL, { Layer } from 'deck.gl';
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
  layers: Layer[]
}

export default class HarmoVisLayers extends React.Component<Props> {
  static defaultProps = {
    mapStyle: 'mapbox://styles/mapbox/dark-v8',
  }

  componentDidMount() {
    this.props.actions.setNonmapView(false);
  }

  initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    const { viewport, mapStyle, actions, mapboxApiAccessToken, layers } = this.props;
    const onViewportChange = this.props.onViewportChange || actions.setViewport;

    return (
      <MapGL
        {...(viewport as thisViewport)} mapStyle={mapStyle}
        onViewportChange={onViewportChange}
        mapboxApiAccessToken={mapboxApiAccessToken}
      >
        <DeckGL {...viewport} layers={layers} onWebGLInitialized={this.initialize} />
      </MapGL>
    );
  }
}
