import * as React from 'react';
import { BasedProps } from '../types';

class Container<P extends BasedProps, S = {}> extends React.Component<P, S> {

  constructor(props: P) {
    super(props);
    this.animate = this.animate.bind(this)
    this.resize = this.resize.bind(this)
    this.animationFrame = window.requestAnimationFrame(this.animate);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  animationFrame: number;

  animate() {
    if (this.props.timeLength > 0) {
      if (!this.props.animatePause && !this.props.loopEndPause) {
        if (!this.props.animateReverse) {
          this.props.actions.increaseTime(this.props);
        } else {
          this.props.actions.decreaseTime(this.props);
        }
      } else {
        this.props.actions.setFrameTimestamp(this.props);
      }
    } else {
      this.props.actions.setTimeStamp(this.props);
    }
    this.animationFrame = window.requestAnimationFrame(this.animate);
  }

  resize() {
    this.props.actions.setViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    return (<>{this.props.children}</>)
  }
}
export default Container
