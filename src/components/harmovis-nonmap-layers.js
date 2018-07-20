// @flow

import React from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGL, { Layer } from 'deck.gl';
import type { BaseActions as Actions, Viewport } from '../types';
import typeof { setViewport } from '../actions';
import OrbitController from './orbit-control';

type Props = {
  viewport : Viewport,
  actions: Actions,
  onChangeViewport: setViewport,
  layers: Array<typeof Layer>
};

export default class HarmoVisNonMapLayers extends React.Component<Props, any> {
  componentDidMount() {
    this.props.actions.setNonmapView(true);
  }

  initialize(gl: any) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  canvas: any;

  render() {
    const { viewport, actions, layers } = this.props;
    const onChangeViewport = this.props.onChangeViewport || actions.setViewport;
    const { width, height } = viewport;
    const glViewport = OrbitController.getViewport(viewport);

    return (
      <OrbitController
        {...viewport}
        ref={(canvas) => { this.canvas = canvas; }}
        onViewportChange={onChangeViewport}
      >
        <DeckGL
          width={width} height={height} viewport={glViewport}
          layers={layers} onWebGLInitialized={this.initialize}
        />
      </OrbitController>
    );
  }
}
