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

const ForwardButton = (props:Props)=>{
  const { children, i18n, className, title: propTitle } = props;
  const title = React.useMemo(
    ()=>propTitle || (children && children.toString()) || i18n.forwardButtonCaption,
    [propTitle,children,i18n.forwardButtonCaption]);

  const setAnimateReverse = ()=>{
    props.actions.setAnimateReverse(false);
  }

  return (
    <button onClick={setAnimateReverse} className={className} title={title}>
      {children === undefined ?
        <span style={default_style}>
        <Icon icon={icForward} />&nbsp;{i18n.forwardButtonCaption}</span> :
        <span>{children}</span>
      }
    </button>
  );
}
ForwardButton.defaultProps = {
  i18n: {
    forwardButtonCaption: 'FORWARD'
  },
  className: 'harmovis_button'
}
export default ForwardButton
