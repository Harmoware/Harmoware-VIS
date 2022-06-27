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

  const setAnimatePause = ()=>{
    props.actions.setAnimatePause(true);
  }

  const Result = React.useMemo(()=>
    <button onClick={setAnimatePause} className={className}
      title={propTitle || (children && children.toString()) || i18n.pauseButtonCaption}>
      {children === undefined ?
        <span style={default_style}>
        <Icon icon={icPause} />{` ${i18n.pauseButtonCaption}`}</span> :
        <span>{children}</span>
      }</button>,[props])

  return Result
}
PauseButton.defaultProps = {
  i18n: {
    pauseButtonCaption: 'PAUSE'
  },
  className: 'harmovis_button'
}
export default PauseButton
