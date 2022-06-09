import * as React from 'react';
import { ActionTypes, Movesbase, MovesbaseFile } from '../types';
const {isArray} = Array;

interface Props {
  actions: ActionTypes,
  i18n?: { formatError: string },
  id?: string,
  className?: string,
  style?: React.CSSProperties
}

const MovesInput = (props:Props)=>{
  const { actions, id, className, style, i18n } = props;

  const onClick = React.useCallback((e: React.ChangeEvent<any>)=>{
    actions.setInputFilename({ movesFileName: null });
    actions.setMovesBase([]);
    e.target.value = '';
  },[])

  const onSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    actions.setLoading(true);
    actions.setMovesBase([]);
    reader.readAsText(file);
    const file_name: string = file.name;
    reader.onload = () => {
      let readdata: Movesbase[] | MovesbaseFile = null;
      try {
        readdata = JSON.parse(reader.result.toString());
      } catch (exception) {
        actions.setLoading(false);
        window.alert(exception);
        return;
      }
      if (!isArray(readdata)) { // Not Array?
        const { movesbase } = readdata;
        if (!movesbase) {
          actions.setLoading(false);
          window.alert(i18n.formatError);
          return;
        }
      }
      actions.setInputFilename({ movesFileName: file_name });
      actions.setMovesBase(readdata);
      actions.setRoutePaths([]);
      actions.setClicked(null);
      actions.setAnimatePause(false);
      actions.setAnimateReverse(false);
      actions.setLoading(false);
    };
  },[i18n])

  return (
    <input type="file" accept=".json"
    id={id} className={className} style={style}
    onClick={onClick} onChange={onSelect}
    />
  );
}
MovesInput.defaultProps = {
  i18n: {
    formatError: 'データ形式不正'
  }
}
export default MovesInput