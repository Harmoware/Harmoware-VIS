import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_fast_forward as icFastForward, ic_fast_rewind as icFastRewind } from 'react-icons-kit/md';
import { ActionTypes } from '../types';

interface Props {
  addMinutes?: number,
  children?: React.ReactNode,
  actions: ActionTypes,
  i18n?: { minutesCaption: string },
  className?: string
}

const default_style = { 'display': 'flex', 'justifyContent': 'center' };

export default class AddMinutesButton extends React.Component<Props> {
  static defaultProps = {
    addMinutes: 10,
    i18n: {
      minutesCaption: 'min'
    },
    className: 'harmovis_button'
  }

  addMinutes(minutes: number) {
    this.props.actions.addMinutes(minutes);
  }

  render() {
    const { addMinutes, children, i18n, className } = this.props;

    return (
      <button onClick={this.addMinutes.bind(this, addMinutes)} className={className}>
        {children === undefined ?
          <span style={default_style}>{addMinutes > 0 ?
            <Icon icon={icFastForward} /> : <Icon icon={icFastRewind} />
          }&nbsp;{addMinutes}&nbsp;{i18n.minutesCaption}</span> :
          <span>{children}</span>
        }
      </button>
    );
  }
}
