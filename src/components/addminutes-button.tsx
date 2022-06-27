import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_fast_forward as icFastForward, ic_fast_rewind as icFastRewind } from 'react-icons-kit/md';
import { ActionTypes } from '../types';

interface Props {
  addMinutes?: number,
  children?: React.ReactNode,
  actions: ActionTypes,
  i18n?: { minutesCaption: string },
  className?: string,
  title?: string,
}

const default_style = { 'display': 'flex', 'justifyContent': 'center' };

const AddMinutesButton = (props:Props)=>{
  const { addMinutes:prop_addMinutes, children, i18n, className, title: propTitle } = props;

  const defaultCaption = React.useMemo(()=>
    <span style={default_style}>
      {prop_addMinutes > 0 ? <Icon icon={icFastForward} /> : <Icon icon={icFastRewind} />}
      {` ${prop_addMinutes} ${i18n.minutesCaption}`}
    </span>,[i18n.minutesCaption])

  const func_addMinutes = (minutes: number)=>{
    props.actions.addMinutes(minutes);
  }

  const Result = React.useMemo(()=>
    <button onClick={()=>func_addMinutes(prop_addMinutes)} className={className}
      title={propTitle || (children && children.toString()) || `${prop_addMinutes} ${i18n.minutesCaption}`}>
      {children === undefined ? <>{defaultCaption}</> : <span>{children}</span>}
    </button>,[props])

  return Result;

}
AddMinutesButton.defaultProps = {
  addMinutes: 10,
  i18n: {
    minutesCaption: 'min'
  },
  className: 'harmovis_button'
}
export default AddMinutesButton
