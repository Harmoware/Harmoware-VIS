import * as React from 'react';
import { ActionsInterface } from '../types';
import { safeCheck, safeAdd, safeSubtract } from '../library';

interface Props {
  settime: number,
  timeBegin: number,
  timeLength: number,
  min?: number,
  actions: ActionsInterface,
  id?: string,
  className?: string
}

const ElapsedTimeValue = (props:Props)=>{
  const { actions, settime, timeBegin, timeLength, min:prop_min, id, className } = props;

  const setTime = React.useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    const value = safeCheck(+e.target.value);
    const settime = Math.min(timeLength, Math.max(prop_min, value));
    actions.setTime(safeAdd(settime, timeBegin)|0);
  },[timeLength,prop_min,timeBegin])

  return (
    <input
      type="number"
      value={safeSubtract(Math.floor(settime), timeBegin)|0}
      min={prop_min} max={timeLength}
      onChange={setTime}
      id={id} className={className}
    />
  );
}
ElapsedTimeValue.defaultProps = {
  min: -100,
  className: 'harmovis_input_number'
}
export default ElapsedTimeValue
