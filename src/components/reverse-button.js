// @flow

import React, { Component } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_replay as icReplay } from 'react-icons-kit/md';
import type { Node } from 'react';
import type { I18n } from '../types';
import typeof { setAnimateReverse } from '../actions';

type Props = {
  actions: {
    setAnimateReverse: setAnimateReverse
  },
  children: Node,
  i18n: I18n
}

export default class ReverseButton extends Component<Props> {
  static defaultProps = {
    i18n: {
      reverseButtonCaption: 'REVERSE'
    }
  }

  setAnimateReverse() {
    this.props.actions.setAnimateReverse(true);
  }

  render() {
    const { children, i18n } = this.props;
    const spanStyle = { padding: '0px', display: 'flex' };

    return (
      <button onClick={this.setAnimateReverse.bind(this)}>
        {children === undefined ?
          <span style={spanStyle}><Icon icon={icReplay} />&nbsp;{i18n.reverseButtonCaption}</span> :
          <span style={spanStyle}>{children}</span>
        }
      </button>
    );
  }
}
