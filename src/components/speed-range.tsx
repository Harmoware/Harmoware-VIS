import * as React from 'react';
import { ActionTypes } from '../types';

interface Props {
  secperhour?: number,
  multiplySpeed?: number,
  actions: ActionTypes,
  maxsecperhour?: number,
  maxmultiplySpeed?: number,
  min?: number,
  step?: number,
  id?: string,
  className?: string,
  title?: string,
}

const SpeedRange = (props:Props)=>{
  const { actions, secperhour, multiplySpeed, maxsecperhour, maxmultiplySpeed,
    min:prop_min, step, id, className, title: propTitle } = props;
  const title = propTitle || `${secperhour}`;

  const setSecPerHour = (e : React.ChangeEvent<HTMLInputElement>)=>{
    const value = +e.target.value;
    const secperhour = (maxsecperhour + prop_min) - (value|0);
    actions.setSecPerHour(secperhour);
  }

  const setMultiplySpeed = (e : React.ChangeEvent<HTMLInputElement>)=>{
    const value = +e.target.value;
    const multiplySpeed = value|0;
    actions.setMultiplySpeed(multiplySpeed);
  }

  return (
    secperhour ?
    <input
      type="range"
      value={(maxsecperhour + prop_min) - secperhour}
      min={prop_min} max={maxsecperhour} step={step}
      onChange={setSecPerHour}
      id={id} className={className} title={title}
    />
    :multiplySpeed ?
    <input
      type="range"
      value={multiplySpeed}
      min={prop_min} max={maxmultiplySpeed} step={step}
      onChange={setMultiplySpeed}
      id={id} className={className} title={title}
    />
    :<p>SpeedRange props error!</p>
  )
}
SpeedRange.defaultProps = {
  maxsecperhour: 3600,
  maxmultiplySpeed: 3600,
  min: 1,
  step: 1,
  className: 'harmovis_input_range'
}
export default SpeedRange
