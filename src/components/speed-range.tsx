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

export default class SpeedRange extends React.Component<Props> {
  static defaultProps = {
    maxsecperhour: 3600,
    maxmultiplySpeed: 3600,
    min: 1,
    step: 1,
    className: 'harmovis_input_range'
  }

  setSecPerHour(e : React.ChangeEvent<HTMLInputElement>) {
    const value = +e.target.value;
    const { maxsecperhour, min, actions } = this.props;
    const secperhour = (maxsecperhour + min) - (value|0);
    actions.setSecPerHour(secperhour);
  }
  setMultiplySpeed(e : React.ChangeEvent<HTMLInputElement>) {
    const value = +e.target.value;
    const { actions } = this.props;
    const multiplySpeed = value|0;
    actions.setMultiplySpeed(multiplySpeed);
  }

  render() {
    const { secperhour, multiplySpeed, maxsecperhour, maxmultiplySpeed,
      min, step, id, className, title: propTitle } = this.props;
    const title = propTitle || `${secperhour}`;

    return (
      secperhour ?
      <input
        type="range"
        value={(maxsecperhour + min) - secperhour}
        min={min} max={maxsecperhour} step={step}
        onChange={this.setSecPerHour.bind(this)}
        id={id} className={className} title={title}
      />
      :multiplySpeed ?
      <input
        type="range"
        value={multiplySpeed}
        min={min} max={maxmultiplySpeed} step={step}
        onChange={this.setMultiplySpeed.bind(this)}
        id={id} className={className} title={title}
      />
      :<p>SpeedRange props error!</p>
    );
  }
}
