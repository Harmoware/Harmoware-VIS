// @flow

import React, { Component } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_play_circle_outline as icPlayArrow } from 'react-icons-kit/md';
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

export default class PlayButton extends Component<Props> {
  static defaultProps = {
    i18n: {
      playButtonCaption: '️PLAY'
    }
  }

  setAnimatePause() {
    this.props.actions.setAnimatePause(false);
  }

  render() {
    const { children, i18n } = this.props;
    const spanStyle = { padding: '0px', display: 'flex' };

    return (
      <button onClick={this.setAnimatePause.bind(this)}>
        {children === undefined ?
          <span style={spanStyle}><Icon icon={icPlayArrow} />&nbsp;{i18n.playButtonCaption}</span> :
          <span style={spanStyle}>{children}</span>
        }
      </button>
    );
  }
}
