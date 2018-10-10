// @flow

import React, { Component } from 'react';
import typeof { setSecPerHour } from '../actions';
import type { InputEvent } from '../types';

type Props = {
  secperhour: number,
  actions: {
    setSecPerHour: setSecPerHour
  },
  maxsecperhour: number,
  min: number,
  id: string,
  className: string
}

export default class SpeedValue extends Component<Props> {
  static defaultProps = {
    maxsecperhour: 3600,
    min: 1,
    className: 'harmovis_input_number'
  }

  setSecPerHour(e : InputEvent) {
    const value = Number(e.target.value);
    const { actions, maxsecperhour, min } = this.props;
    const secperhour = Math.min(maxsecperhour, Math.max(min, value));
    actions.setSecPerHour(secperhour);
  }

  render() {
    const { secperhour, maxsecperhour, min, id, className } = this.props;

    return (
      <input
        type="number"
        value={secperhour}
        min={min} max={maxsecperhour}
        onChange={this.setSecPerHour.bind(this)}
        id={id} className={className}
      />
    );
  }
}
