import * as React from 'react';
import DeckGL, { Layer } from 'deck.gl';
import { Viewport, ActionTypes } from '../types';
import OrbitController from './orbit-control';

interface Props {
  viewport: Viewport,
  actions: ActionTypes,
  onViewportChange?(viewport: Viewport): void,
  layers: Layer[]
};

export default class HarmoVisNonMapLayers extends React.Component<Props> {
  componentDidMount() {
    this.props.actions.setNonmapView(true);
  }

  initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  canvas;

  render() {
    const { viewport, actions, layers } = this.props;
    const onViewportChange = this.props.onViewportChange || actions.setViewport;
    const { width, height } = viewport;
    const glViewport = OrbitController.getViewport(viewport);

    return (
      <OrbitController
        {...viewport}
        ref={(canvas) => { this.canvas = canvas; }}
        onViewportChange={onViewportChange}
      >
        <DeckGL
          width={width} height={height} viewport={glViewport}
          layers={layers} onWebGLInitialized={this.initialize}
        />
      </OrbitController>
    );
  }
}
