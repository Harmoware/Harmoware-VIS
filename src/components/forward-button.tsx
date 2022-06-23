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
    [children,i18n.forwardButtonCaption]);

  const defaultCaption = React.useMemo(
    ()=><span style={default_style}>
    <Icon icon={icForward} />{` ${i18n.forwardButtonCaption}`}</span>,
    [i18n.forwardButtonCaption])
  
  const caption = React.useMemo(
    ()=>children === undefined ? <>{defaultCaption}</> : <span>{children}</span>,
    [children,i18n.forwardButtonCaption])

  const setAnimateReverse = ()=>{
    props.actions.setAnimateReverse(false);
  }

  const Result = React.useMemo(()=>
    <button onClick={setAnimateReverse} className={className} title={title}>
      {caption}</button>,[children,i18n.forwardButtonCaption])

  return Result
}
ForwardButton.defaultProps = {
  i18n: {
    forwardButtonCaption: 'FORWARD'
  },
  className: 'harmovis_button'
}
export default ForwardButton
