import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_replay as icReplay } from 'react-icons-kit/md';
import { ActionTypes } from '../types';

interface Props {
  actions: ActionTypes,
  children?: React.ReactNode,
  i18n?: { reverseButtonCaption: string },
  className?: string
}

export default class ReverseButton extends React.Component<Props> {
  static defaultProps = {
    i18n: {
      reverseButtonCaption: 'REVERSE'
    },
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
