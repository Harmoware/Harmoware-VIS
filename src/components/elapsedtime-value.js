// @flow

import React, { Component } from 'react';
import type { InputEvent } from '../types';
import typeof { setTime } from '../actions';

type Props = {
  settime: number,
  timeLength: number,
  min: number,
  actions: {
    setTime: setTime
  },
  id: string,
  className: string
}

export default class ElapsedTimeValue extends Component<Props> {
  static defaultProps = {
    min: -100,
    className: 'harmovis_input_number'
  }

  setTime(e: InputEvent) {
    const value = Number(e.target.value);
    const { actions, timeLength, min } = this.props;
    const settime = Math.min(timeLength, Math.max(min, value));
    actions.setTime(Math.floor(settime));
  }

  render() {
    const { settime, timeLength, min, id, className } = this.props;

    return (
      <input
        type="number"
        value={Math.floor(settime)}
        min={min} max={timeLength}
        onChange={this.setTime.bind(this)}
        id={id} className={className}
      />
    );
  }
}
