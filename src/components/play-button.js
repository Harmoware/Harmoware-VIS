// @flow

import React, { Component } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_play_circle_outline as icPlayArrow } from 'react-icons-kit/md';
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

export default class PlayButton extends Component<Props> {
  static defaultProps = {
    i18n: {
      playButtonCaption: '️PLAY'
    },
    className: ButtonClass
  }

  setAnimatePause() {
    this.props.actions.setAnimatePause(false);
  }

  render() {
    const { children, i18n, className } = this.props;

    return (
      <button onClick={this.setAnimatePause.bind(this)} className={className}>
        {children === undefined ?
          <span><Icon icon={icPlayArrow} />&nbsp;{i18n.playButtonCaption}</span> :
          <span>{children}</span>
        }
      </button>
    );
  }
}
