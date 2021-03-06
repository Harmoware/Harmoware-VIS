import * as React from 'react';
import { ActionTypes } from '../types';
import { safeCheck, safeAdd, safeSubtract } from '../library';
const {max,min} = Math;

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

  setTime(e: React.ChangeEvent<HTMLInputElement>) {
    const value = safeCheck(+e.target.value);
    const { actions, timeBegin, timeLength, min:minimum } = this.props;
    const settime = min(timeLength, max(minimum, value));
    actions.setTime(safeAdd(settime, timeBegin)|0);
  }

  render() {
    const { settime, timeBegin, timeLength, min, id, className } = this.props;

    return (
      <input
        type="number"
        value={safeSubtract(Math.floor(settime), timeBegin)|0}
        min={min} max={timeLength}
        onChange={this.setTime.bind(this)}
        id={id} className={className}
      />
    );
  }
}
