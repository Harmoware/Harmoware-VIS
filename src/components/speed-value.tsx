import * as React from 'react';
import { ActionTypes } from '../types';
const {max,min} = Math;

interface Props {
  secperhour: number,
  actions: ActionTypes,
  maxsecperhour?: number,
  min?: number,
  id?: string,
  className?: string
}

export default class SpeedValue extends React.Component<Props> {
  static defaultProps = {
    maxsecperhour: 3600,
    min: 1,
    className: 'harmovis_input_number'
  }

  setSecPerHour(e : React.ChangeEvent<HTMLInputElement>) {
    const value = +e.target.value;
    const { actions, maxsecperhour, min:minimum } = this.props;
    const secperhour = min(maxsecperhour, max(minimum, value));
    actions.setSecPerHour(secperhour);
  }

  render() {
    const { secperhour, maxsecperhour, min, id, className } = this.props;

    return (
      <input
        type="number"
        value={secperhour}
        min={min} max={maxsecperhour}
        onChange={this.setSecPerHour.bind(this)}
        id={id} className={className}
      />
    );
  }
}
