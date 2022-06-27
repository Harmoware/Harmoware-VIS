import * as React from 'react';
import { Viewport } from 'harmoware-vis';

interface Props {
  id?: string,
  className?: string,
  style?: React.CSSProperties,
  getViewport: (viewport:any)=>void
}

const ViewportInput = (props:Props)=>{
  const { id, className, style, getViewport } = props;

  const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    reader.readAsText(file);
    reader.onload = () => {
      let readdata:Viewport = {};
      try {
        readdata = JSON.parse(reader.result.toString());
      } catch (exception) {
        window.alert(exception);
        return;
      }
      getViewport(readdata);
    };
  },[getViewport])

  const onClick = (e: React.ChangeEvent<any>)=>{
    e.target.value = '';
  }

  const Result = React.useMemo(()=>
    <input type="file" accept=".json"
    id={id} className={className} style={style}
    onClick={onClick}
    onChange={onChange}
    />
  ,[props])

  return Result
}
export default ViewportInput
