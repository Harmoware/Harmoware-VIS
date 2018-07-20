import React, { Component, PropTypes } from 'react';

export default class CanvasComponent extends Component {
  componentDidMount() {
    this.updateCanvas();
  }

  componentWillReceiveProps(nextProps) {
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

CanvasComponent.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  updateCanvas: PropTypes.func.isRequired,
};
