import * as React from 'react';
import { ActionTypes } from '../types';

interface Props {
  secperhour: number,
  actions: ActionTypes,
  maxsecperhour?: number,
  min?: number,
  step?: number,
  id?: string,
  className?: string,
  title?: string,
}

export default class SpeedRange extends React.Component<Props> {
  static defaultProps = {
    maxsecperhour: 3600,
    min: 1,
    step: 1,
    className: 'harmovis_input_range'
  }

  setSecPerHour(e : React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    const { maxsecperhour, min, actions } = this.props;
    const secperhour = (maxsecperhour + min) - Math.floor(value);
    actions.setSecPerHour(secperhour);
  }

  render() {
    const { secperhour, maxsecperhour, min, step, id, className, title: propTitle } = this.props;
    const title = propTitle || `${secperhour}`;

    return (
      <input
        type="range"
        value={(maxsecperhour + min) - secperhour}
        min={min} max={maxsecperhour} step={step}
        onChange={this.setSecPerHour.bind(this)}
        id={id} className={className} title={title}
      />
    );
  }
}
