import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_pause_circle_outline as icPause } from 'react-icons-kit/md';
import { ActionTypes } from '../types';

interface Props {
  actions: ActionTypes,
  children?: React.ReactNode,
  i18n?: { pauseButtonCaption: string },
  className?: string
}

const default_style = { 'display': 'flex', 'justifyContent': 'center' };

export default class PauseButton extends React.Component<Props> {
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
          <span style={default_style}>
          <Icon icon={icPause} />&nbsp;{i18n.pauseButtonCaption}</span> :
          <span>{children}</span>
        }
      </button>
    );
  }
}
