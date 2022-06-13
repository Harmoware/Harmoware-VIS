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
  const title = React.useMemo(
    ()=>propTitle || (children && children.toString()) || `${prop_addMinutes} ${i18n.minutesCaption}`,
    [propTitle,children,prop_addMinutes,i18n.minutesCaption]);

  const func_addMinutes = (minutes: number)=>{
    props.actions.addMinutes(minutes);
  }

  return (
    <button onClick={()=>func_addMinutes(prop_addMinutes)} className={className} title={title}>
      {children === undefined ?
        <span style={default_style}>{prop_addMinutes > 0 ?
          <Icon icon={icFastForward} /> : <Icon icon={icFastRewind} />
        }&nbsp;{prop_addMinutes}&nbsp;{i18n.minutesCaption}</span> :
        <span>{children}</span>
      }
    </button>
  );

}
AddMinutesButton.defaultProps = {
  addMinutes: 10,
  i18n: {
    minutesCaption: 'min'
  },
  className: 'harmovis_button'
}
export default AddMinutesButton
