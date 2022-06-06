import * as React from 'react';
import { ActionsInterface } from '../types';
import { safeCheck,safeAdd, safeSubtract } from '../library';

interface Props {
  settime: number,
  timeBegin: number,
  timeLength: number,
  min?: number,
  step?: number,
  actions: ActionsInterface,
  id?: string,
  className?: string,
  title?: string,
}

const ElapsedTimeRange = (props:Props)=>{
  const { actions, settime, timeBegin, timeLength,
    min, step, id, className, title: propTitle } = props;
  const title = propTitle || `${safeSubtract(settime, timeBegin)|0}`;

  const setTime = React.useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    const value = safeCheck(+e.target.value);
    actions.setTime(safeAdd(value, timeBegin)|0);
  },[timeBegin])

  return (
    <input
      type="range"
      value={safeSubtract(settime, timeBegin)|0}
      min={min} max={timeLength} step={step}
      onChange={setTime}
      id={id} className={className} title={title}
    />
  );
}
ElapsedTimeRange.defaultProps = {
  min: -100,
  step: 1,
  className: 'harmovis_input_range'
}
export default ElapsedTimeRange
