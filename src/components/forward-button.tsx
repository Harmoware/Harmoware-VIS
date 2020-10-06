import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_forward as icForward } from 'react-icons-kit/md';
import { ActionTypes } from '../types';

interface Props {
  actions: ActionTypes,
  children?: React.ReactNode,
  i18n?: { forwardButtonCaption: string },
  className?: string,
  title?: string,
}

const default_style = { 'display': 'flex', 'justifyContent': 'center' };

export default class ForwardButton extends React.Component<Props> {
  static defaultProps = {
    i18n: {
      forwardButtonCaption: 'FORWARD'
    },
    className: 'harmovis_button'
  }

  setAnimateReverse() {
    this.props.actions.setAnimateReverse(false);
  }

  render() {
    const { children, i18n, className, title: propTitle } = this.props;
    const title = propTitle || (children && children.toString()) || i18n.forwardButtonCaption;

    return (
      <button onClick={this.setAnimateReverse.bind(this)} className={className} title={title}>
        {children === undefined ?
          <span style={default_style}>
          <Icon icon={icForward} />&nbsp;{i18n.forwardButtonCaption}</span> :
          <span>{children}</span>
        }
      </button>
    );
  }
}
