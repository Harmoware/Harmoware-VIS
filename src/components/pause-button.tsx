

import React, { Component } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_pause_circle_outline as icPause } from 'react-icons-kit/md';
import { Node } from 'react';
import { I18n } from '../types';
import { setAnimatePause } from '../actions';

type Props = {
  actions: {
    setAnimatePause: typeof setAnimatePause
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
    className: 'harmovis_button'
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
