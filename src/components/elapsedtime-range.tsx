import * as React from 'react';
import { ActionTypes, InputEvent } from '../types';

interface Props {
  settime: number,
  timeLength: number,
  min?: number,
  step?: number,
  actions: ActionTypes,
  id?: string,
  className?: string
}

export default class ElapsedTimeRange extends React.Component<Props> {
  static defaultProps = {
    min: -100,
    step: 1,
    className: 'harmovis_input_range'
  }

  setTime(e: InputEvent) {
    this.props.actions.setTime(Math.floor(Number(e.target.value)));
  }

  render() {
    const { settime, timeLength, min, step, id, className } = this.props;

    return (
      <input
        type="range"
        value={Math.floor(settime)}
        min={min} max={timeLength} step={step}
        onChange={this.setTime.bind(this)}
        id={id} className={className}
      />
    );
  }
}
