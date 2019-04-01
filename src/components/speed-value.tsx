import * as React from 'react';
import { ActionTypes } from '../types';

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
    const value = Number(e.target.value);
    const { actions, maxsecperhour, min } = this.props;
    const secperhour = Math.min(maxsecperhour, Math.max(min, value));
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
