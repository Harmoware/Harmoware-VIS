// @flow

import React, { Component, PropTypes } from 'react';
import type { InputEvent } from '../types';
import typeof { setTime } from '../actions';

type Props = {
  settime: number,
  timeLength: number,
  min: number,
  step: number,
  actions: {
    setTime: setTime
  }
}

export default class ElapsedTimeRange extends Component<Props> {

  static defaultProps = {
    min: -100,
    step: 1
  }

  setTime(e: InputEvent) {
    this.props.actions.setTime(Math.floor(Number(e.target.value)));
  }

  render() {
    const { settime, timeLength, min, step } = this.props;

    return (
      <input
        type="range"
        value={Math.floor(settime)}
        min={min} max={timeLength} step={step}
        onChange={this.setTime.bind(this)}
      />
    );
  }
}
