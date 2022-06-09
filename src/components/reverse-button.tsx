import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_replay as icReplay } from 'react-icons-kit/md';
import { ActionTypes } from '../types';

interface Props {
  actions: ActionTypes,
  children?: React.ReactNode,
  i18n?: { reverseButtonCaption: string },
  className?: string,
  title?: string,
}

const default_style = { 'display': 'flex', 'justifyContent': 'center' };

const ReverseButton = (props:Props)=>{
  const { children, i18n, className, title: propTitle } = props;
  const title = propTitle || (children && children.toString()) || i18n.reverseButtonCaption;

  const setAnimateReverse = ()=>{
    props.actions.setAnimateReverse(true);
  }

  return (
    <button onClick={setAnimateReverse} className={className} title={title}>
      {children === undefined ?
        <span style={default_style}>
        <Icon icon={icReplay} />&nbsp;{i18n.reverseButtonCaption}</span> :
        <span>{children}</span>
      }
    </button>
  );
}
ReverseButton.defaultProps = {
  i18n: {
    reverseButtonCaption: 'REVERSE'
  },
  className: 'harmovis_button'
}
export default ReverseButton
