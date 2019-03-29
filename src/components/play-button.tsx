import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_play_circle_outline as icPlayArrow } from 'react-icons-kit/md';
import { ActionTypes } from '../types';

interface Props {
  actions: ActionTypes,
  children?: React.ReactNode,
  i18n?: { playButtonCaption: string },
  className?: string
}

export default class PlayButton extends React.Component<Props> {
  static defaultProps = {
    i18n: {
      playButtonCaption: '️PLAY'
    },
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
