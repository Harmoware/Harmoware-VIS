

import React, { Component } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_replay as icReplay } from 'react-icons-kit/md';
import { Node } from 'react';
import { I18n } from '../types';
import { setAnimateReverse } from '../actions';

type Props = {
  actions: {
    setAnimateReverse: typeof setAnimateReverse
  },
  children: Node,
  i18n: I18n,
  className: string
}

export default class ReverseButton extends Component<Props> {
  static defaultProps = {
    i18n: {
      reverseButtonCaption: 'REVERSE'
    },
    className: 'harmovis_button'
  }

  setAnimateReverse() {
    this.props.actions.setAnimateReverse(true);
  }

  render() {
    const { children, i18n, className } = this.props;

    return (
      <button onClick={this.setAnimateReverse.bind(this)} className={className}>
        {children === undefined ?
          <span><Icon icon={icReplay} />&nbsp;{i18n.reverseButtonCaption}</span> :
          <span>{children}</span>
        }
      </button>
    );
  }
}
