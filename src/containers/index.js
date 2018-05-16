// @flow

import { Component } from 'react';
import { calcLoopTime } from '../library';
import type { BasedProps as Props } from '../types';

export default class Root extends Component<Props> {

  constructor(props: Props) {
    super(props);
    this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  componentWillUnmount() {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  animationFrame: number;

  animate() {
    const {
      timeLength, animatePause, animateReverse, actions, leading,
      secpermin } = this.props;
    if (timeLength > 0) {
      if (!animatePause) {
        if (!animateReverse) {
          actions.increaseTime(this.props);
        } else {
          actions.decreaseTime(this.props);
        }
      } else {
        actions.setFrameTimestamp(this.props);
      }
    } else {
      actions.setTimeStamp(Date.now() + calcLoopTime(leading, secpermin));
    }
    this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.props.actions.setViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
}
