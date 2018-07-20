// @flow

import React, { Component } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_pause_circle_outline as icPause } from 'react-icons-kit/md';
import type { Node } from 'react';
import type { I18n } from '../types';
import typeof { setAnimatePause } from '../actions';

type Props = {
  actions: {
    setAnimatePause: setAnimatePause
  },
  children: Node,
  i18n: I18n
}

export default class PauseButton extends Component<Props> {
  static defaultProps = {
    i18n: {
      pauseButtonCaption: 'PAUSE'
    }
  }

  setAnimatePause() {
    this.props.actions.setAnimatePause(true);
  }

  render() {
    const { children, i18n } = this.props;

    return (
      <button onClick={this.setAnimatePause.bind(this)}>
        {children === undefined ?
          <span><Icon icon={icPause} />&nbsp;{i18n.pauseButtonCaption}</span> :
          <span>{children}</span>
        }
      </button>
    );
  }
}
