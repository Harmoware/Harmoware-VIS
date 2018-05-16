// @flow

import React, { Component, PropTypes } from 'react';
import MapGL from 'react-map-gl';
import DeckGL, { Layer } from 'deck.gl';
import type { Viewport } from '../types';
import typeof { setViewport } from '../actions';

type Props = {
  viewport : Viewport,
  mapboxApiAccessToken: string,
  mapStyle: string,
  actions: {
    setViewport: setViewport
  },
  onChangeViewport: setViewport,
  layers: Array<typeof Layer>
}

export default class HarmoVisLayers extends Component<Props> {

  static defaultProps = {
    mapStyle: 'mapbox://styles/mapbox/dark-v8',
  }

  // static propTypes = {
  //   viewport: PropTypes.objectOf(
  //     PropTypes.oneOfType([PropTypes.node, PropTypes.bool])).isRequired,
  //   actions: PropTypes.objectOf(PropTypes.func).isRequired,
  //   mapboxApiAccessToken: PropTypes.string.isRequired,
  //   mapStyle: PropTypes.string,
  //   layers: PropTypes.arrayOf(PropTypes.instanceOf(Layer)).isRequired,
  //   onChangeViewport: PropTypes.func,
  // }

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
