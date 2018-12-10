

import * as React from 'react';

interface Props {
  width: number,
  height: number,
  updateCanvas: (context: CanvasRenderingContext2D) => void,
}

export default class CanvasComponent extends React.Component<Props> {
  canvas: HTMLCanvasElement;

  componentDidMount() {
    this.updateCanvas();
  }

  updateCanvas() {
    const { canvas } = this;
    const context = canvas.getContext('2d');
    this.props.updateCanvas(context);
  }

  render() {
    return (<canvas
      ref={(canvas) => { this.canvas = canvas; }}
      width={this.props.width} height={this.props.height}
    />);
  }
}
