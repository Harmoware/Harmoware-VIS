import * as React from 'react';
import { Layer } from '@deck.gl/core';
import DeckGL, { OrbitView } from 'deck.gl';

import { Viewport, ActionTypes } from '../types';

interface Props {
  viewport: Viewport,
  actions: ActionTypes,
  layers: Layer[]
};

export default class HarmoVisNonMapLayers extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.onViewStateChange = this.onViewStateChange.bind(this);
    this.rotateCamera = this.rotateCamera.bind(this);
  }

  onViewStateChange({viewState}) {
    const { viewport, actions } = this.props;
    actions.setViewport({ ...viewport, ...viewState });
  }

  onLoad() {
    this.rotateCamera();
  }

  rotateCamera() {
    const { viewport, actions } = this.props;
    actions.setViewport({
        ...viewport
    });
  }

  componentDidMount() {
    this.props.actions.setNonmapView(true);
  }

  canvas: HTMLCanvasElement;

  render() {
    const { viewport, layers } = this.props;
    const { width, height } = viewport;

    return (
      <DeckGL
        width={width} height={height}
        views={new OrbitView()}
        viewState={viewport}
        controller={true}
        onLoad={this.onLoad}
        onViewStateChange={this.onViewStateChange}
        layers={layers}
      />
    );
  }
}
