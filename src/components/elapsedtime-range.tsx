import * as React from 'react';
import { ActionTypes } from '../types';

interface Props {
  settime: number,
  timeBegin: number,
  timeLength: number,
  min?: number,
  step?: number,
  actions: ActionTypes,
  id?: string,
  className?: string,
  title?: string,
}

export default class ElapsedTimeRange extends React.Component<Props> {
  static defaultProps = {
    min: -100,
    step: 1,
    className: 'harmovis_input_range'
  }

  setTime(e: React.ChangeEvent<HTMLInputElement>) {
    const { actions, timeBegin } = this.props;
    actions.setTime(Math.floor(Number(e.target.value) + timeBegin));
  }

  render() {
    const { settime, timeBegin, timeLength, min, step, id, className, title: propTitle } = this.props;
    const title = propTitle || `${Math.floor(settime - timeBegin)}`;

    return (
      <input
        type="range"
        value={Math.floor(settime - timeBegin)}
        min={min} max={timeLength} step={step}
        onChange={this.setTime.bind(this)}
        id={id} className={className} title={title}
      />
    );
  }
}
