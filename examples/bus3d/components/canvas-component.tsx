

import * as React from 'react';

interface Props {
  width?: number,
  height?: number,
  updateCanvas?: Function,
}

export default class CanvasComponent extends React.Component<Props> {
  canvas: any;

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
