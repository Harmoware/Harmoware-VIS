// @flow

import React, { Component } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_pause_circle_outline as icPause } from 'react-icons-kit/md';
import type { Node } from 'react';
import type { I18n } from '../types';
import typeof { setAnimatePause } from '../actions';
import { ButtonClass } from '../styles';

type Props = {
  actions: {
    setAnimatePause: setAnimatePause
  },
  children: Node,
  i18n: I18n,
  className: string
}

export default class PauseButton extends Component<Props> {
  static defaultProps = {
    i18n: {
      pauseButtonCaption: 'PAUSE'
    },
    className: ButtonClass
  }

  setAnimatePause() {
    this.props.actions.setAnimatePause(true);
  }

  render() {
    const { children, i18n, className } = this.props;

    return (
      <button onClick={this.setAnimatePause.bind(this)} className={className}>
        {children === undefined ?
          <span><Icon icon={icPause} />&nbsp;{i18n.pauseButtonCaption}</span> :
          <span>{children}</span>
        }
      </button>
    );
  }
}
