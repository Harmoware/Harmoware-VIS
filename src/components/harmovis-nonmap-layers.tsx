

import * as React from 'react';
import DeckGL, { Layer } from 'deck.gl';
import { Viewport, Actions } from '../types';
import OrbitController from './orbit-control';

interface Props {
  viewport: Viewport,
  actions: typeof Actions,
  onChangeViewport?: typeof Actions.setViewport,
  layers: Layer[]
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
