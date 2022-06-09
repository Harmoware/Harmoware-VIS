import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_play_circle_outline as icPlayArrow } from 'react-icons-kit/md';
import { ActionTypes } from '../types';

interface Props {
  actions: ActionTypes,
  children?: React.ReactNode,
  i18n?: { playButtonCaption: string },
  className?: string,
  title?: string,
}

const default_style = { 'display': 'flex', 'justifyContent': 'center' };

const PlayButton = (props:Props)=>{
  const { children, i18n, className, title: propTitle } = props;
  const title = propTitle || (children && children.toString()) || i18n.playButtonCaption;

  const setAnimatePause = ()=>{
    props.actions.setAnimatePause(false);
  }

  return (
    <button onClick={setAnimatePause} className={className} title={title}>
      {children === undefined ?
        <span style={default_style}>
        <Icon icon={icPlayArrow} />&nbsp;{i18n.playButtonCaption}</span> :
        <span>{children}</span>
      }
    </button>
  );
}
PlayButton.defaultProps = {
  i18n: {
    playButtonCaption: '️PLAY'
  },
  className: 'harmovis_button'
}
export default PlayButton
