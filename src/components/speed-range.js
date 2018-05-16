// @flow

import React, { Component, PropTypes } from 'react';
import typeof { setSecPerMin } from '../actions';
import type { InputEvent } from '../types';

type Props = {
  secpermin: number,
  actions: {
    setSecPerMin: setSecPerMin
  },
  maxsecpermin: number,
  min: number,
  step: number
}

export default class SpeedRange extends Component<Props> {

  static defaultProps = {
    maxsecpermin: 10,
    min: 1,
    step: 1
  }

  // static propTypes = {
  //   secpermin: PropTypes.number.isRequired,
  //   actions: PropTypes.objectOf(PropTypes.func).isRequired,
  //   maxsecpermin: PropTypes.number,
  //   min: PropTypes.number,
  //   step: PropTypes.number,
  // }

  setSecPerMin(e : InputEvent) {
    const value = Number(e.target.value);
    const secpermin = (this.props.maxsecpermin + 1) - Math.floor(value);
    this.props.actions.setSecPerMin(secpermin);
  }

  render() {
    const { secpermin, maxsecpermin, min, step } = this.props;

    return (
      <input
        type="range"
        value={(maxsecpermin + 1) - secpermin}
        min={min} max={`${maxsecpermin}`} step={step}
        onChange={this.setSecPerMin.bind(this)}
      />
    );
  }
}
