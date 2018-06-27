// @flow

import React from 'react';
import MapGL from 'react-map-gl';
import DeckGL, { Layer } from 'deck.gl';
import type { Viewport } from '../types';
import typeof { setViewport, setNonmapView } from '../actions';

type Props = {
  viewport : Viewport,
  mapboxApiAccessToken: string,
  mapStyle: string,
  actions: {
    setViewport: setViewport,
    setNonmapView: setNonmapView
  },
  onChangeViewport: setViewport,
  layers: Array<typeof Layer>
}

export default class HarmoVisLayers extends React.Component<Props> {

  static defaultProps = {
    mapStyle: 'mapbox://styles/mapbox/dark-v8',
  }

  componentDidMount() {
    this.props.actions.setNonmapView(false);
  }

  initialize(gl: any) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    const { viewport, mapStyle, actions, mapboxApiAccessToken, layers } = this.props;
    const onChangeViewport = this.props.onChangeViewport || actions.setViewport;

    return (
      <MapGL
        {...viewport} mapStyle={mapStyle} perspectiveEnabled
        onChangeViewport={onChangeViewport}
        mapboxApiAccessToken={mapboxApiAccessToken}
      >
        <DeckGL {...viewport} layers={layers} onWebGLInitialized={this.initialize} />
      </MapGL>
    );
  }
}
