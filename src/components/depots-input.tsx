import * as React from 'react';
import { ActionTypes } from '../types';

interface Props {
  actions: ActionTypes,
  i18n?: { formatError: string },
  id?: string,
  className?: string,
  style?: React.CSSProperties
}

const DepotsInput = (props:Props)=>{
  const { actions, id, className, style, i18n } = props;

  const onClick = React.useCallback((e: React.ChangeEvent<any>)=>{
    actions.setInputFilename({ depotsFileName: null });
    actions.setDepotsBase([]);
    e.target.value = '';
  },[])

  const onSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    actions.setLoading(true);
    actions.setDepotsBase([]);
    reader.readAsText(file);
    const file_name: string = file.name;
    reader.onload = () => {
      let readdata = [];
      try {
        readdata = JSON.parse(reader.result.toString());
      } catch (exception) {
        actions.setLoading(false);
        window.alert(exception);
        return;
      }
      if (readdata.length > 0) {
        const { longitude, latitude, position } = readdata[0];
        if ((longitude && latitude) || position) {
          actions.setInputFilename({ depotsFileName: file_name });
          actions.setLoading(false);
          actions.setDepotsBase(readdata);
          return;
        }
        window.alert(i18n.formatError);
      }
      actions.setInputFilename({ depotsFileName: null });
      actions.setDepotsBase([]);
      actions.setLoading(false);
    };
  },[i18n])

  const Result = React.useMemo(()=>
    <input type="file" accept=".json" 
    id={id} className={className} style={style}
    onClick={onClick}
    onChange={onSelect}
    />
  ,[props])

  return Result
}
DepotsInput.defaultProps = {
  i18n: {
    formatError: 'データ形式不正'
  }
}
export default DepotsInput
