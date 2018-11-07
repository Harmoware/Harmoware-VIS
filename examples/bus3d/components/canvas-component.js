

import React, { Component } from 'react';

type Props = {
  width: number,
  height: number,
  updateCanvas: Function,
}

export default class CanvasComponent extends Component<Props> {
  componentDidMount() {
    this.updateCanvas();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props !== nextProps) {
      this.updateCanvas();
    }
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    const { canvas } = (this: any);
    const context = canvas.getContext('2d');
    this.props.updateCanvas(context);
  }

  render() {
    return (<canvas
      ref={(canvas) => { (this: any).canvas = canvas; }}
      width={this.props.width} height={this.props.height}
    />);
  }
}
