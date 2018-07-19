// @flow

import React, { Component } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_fast_forward as icFastForward, ic_fast_rewind as icFastRewind } from 'react-icons-kit/md';
import type { Node } from 'react';
import type { I18n } from '../types';
import typeof { addMinutes as addMinutesType } from '../actions';

type Props = {
  addMinutes: number,
  children?: Node,
  actions: {
    addMinutes: addMinutesType
  },
  i18n: I18n
}

export default class AddMinutesButton extends Component<Props> {

  static defaultProps = {
    addMinutes: 10,
    i18n: {
      minutesCaption: 'min'
    }
  }

  addMinutes(minutes: number) {
    this.props.actions.addMinutes(minutes);
  }

  render() {
    const { addMinutes, children, i18n } = this.props;

    return (
      <button onClick={this.addMinutes.bind(this, addMinutes)}>
        {children === undefined ?
          <span>{addMinutes > 0 ?
            <Icon icon={icFastForward} /> : <Icon icon={icFastRewind} />
          }&nbsp;{addMinutes}&nbsp;{i18n.minutesCaption}</span> :
          <span>{children}</span>
        }
      </button>
    );
  }
}
