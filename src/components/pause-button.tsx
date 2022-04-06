import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_pause_circle_outline as icPause } from 'react-icons-kit/md';
import { ActionTypes } from '../types';

interface Props {
  actions: ActionTypes,
  children?: React.ReactNode,
  i18n?: { pauseButtonCaption: string },
  className?: string,
  title?: string,
}

const default_style = { 'display': 'flex', 'justifyContent': 'center' };

const PauseButton = (props:Props)=>{
  const { children, i18n, className, title: propTitle } = props;
  const title = propTitle || (children && children.toString()) || i18n.pauseButtonCaption;

  const setAnimatePause = ()=>{
    props.actions.setAnimatePause(true);
  }

  return (
    <button onClick={setAnimatePause} className={className} title={title}>
      {children === undefined ?
        <span style={default_style}>
        <Icon icon={icPause} />&nbsp;{i18n.pauseButtonCaption}</span> :
        <span>{children}</span>
      }
    </button>
  );
}
PauseButton.defaultProps = {
  i18n: {
    pauseButtonCaption: 'PAUSE'
  },
  className: 'harmovis_button'
}
export default PauseButton
