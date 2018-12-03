import * as React from 'react';
import { ActionTypes, InputEvent } from '../types';

interface Props {
  settime: number,
  timeBegin: number,
  timeLength: number,
  min?: number,
  actions: ActionTypes,
  id?: string,
  className?: string
}

export default class ElapsedTimeValue extends React.Component<Props> {
  static defaultProps = {
    min: -100,
    className: 'harmovis_input_number'
  }

  setTime(e: InputEvent) {
    const value = Number(e.target.value);
    const { actions, timeBegin, timeLength, min } = this.props;
    const settime = Math.min(timeLength, Math.max(min, value));
    actions.setTime(Math.floor(settime + timeBegin));
  }

  render() {
    const { settime, timeBegin, timeLength, min, id, className } = this.props;

    return (
      <input
        type="number"
        value={Math.floor(settime - timeBegin)}
        min={min} max={timeLength}
        onChange={this.setTime.bind(this)}
        id={id} className={className}
      />
    );
  }
}
