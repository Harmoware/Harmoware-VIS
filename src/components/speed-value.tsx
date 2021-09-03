import * as React from 'react';
import { ActionTypes } from '../types';
const {max,min} = Math;

interface Props {
  secperhour?: number,
  multiplySpeed?: number,
  actions: ActionTypes,
  maxsecperhour?: number,
  maxmultiplySpeed?: number,
  min?: number,
  id?: string,
  className?: string
}

export default class SpeedValue extends React.Component<Props> {
  static defaultProps = {
    maxsecperhour: 3600,
    maxmultiplySpeed: 3600,
    min: 1,
    className: 'harmovis_input_number'
  }

  setSecPerHour(e : React.ChangeEvent<HTMLInputElement>) {
    const value = +e.target.value;
    const { actions, maxsecperhour, min:minimum } = this.props;
    const secperhour = min(maxsecperhour, max(minimum, value));
    actions.setSecPerHour(secperhour);
  }
  setMultiplySpeed(e : React.ChangeEvent<HTMLInputElement>) {
    const value = +e.target.value;
    const { actions, maxmultiplySpeed, min:minimum } = this.props;
    const multiplySpeed = min(maxmultiplySpeed, max(minimum, value));
    actions.setMultiplySpeed(multiplySpeed);
  }

  render() {
    const { secperhour, multiplySpeed, maxsecperhour, maxmultiplySpeed,
      min, id, className } = this.props;

    return (
      secperhour ?
      <input
        type="number"
        value={secperhour}
        min={min} max={maxsecperhour}
        onChange={this.setSecPerHour.bind(this)}
        id={id} className={className}
      />
      :multiplySpeed ?
      <input
        type="number"
        value={multiplySpeed}
        min={min} max={maxmultiplySpeed}
        onChange={this.setMultiplySpeed.bind(this)}
        id={id} className={className}
      />
      :<p>SpeedValue props error!</p>
    );
  }
}
