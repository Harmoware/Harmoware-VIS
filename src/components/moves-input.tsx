

import * as React from 'react';
import { InputEvent, Movesbase, MovesbaseFile } from '../types';
import { setMovesBase, setRoutePaths, setClicked, setAnimatePause, setAnimateReverse, setLoading, setInputFilename } from '../actions';

interface Props {
  actions: {
    setMovesBase: typeof setMovesBase,
    setRoutePaths: typeof setRoutePaths,
    setClicked: typeof setClicked,
    setAnimatePause: typeof setAnimatePause,
    setAnimateReverse: typeof setAnimateReverse,
    setLoading: typeof setLoading,
    setInputFilename: typeof setInputFilename
  },
  i18n: { formatError: string },
  id: string,
  className: string,
  style: Object
}

export default class MovesInput extends React.Component<Props> {
  static defaultProps = {
    i18n: {
      formatError: 'ラインマップデータ形式不正'
    }
  }

  onSelect(e: InputEvent) {
    const { i18n, actions } = this.props;
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
      let readdata: Array<Movesbase> | MovesbaseFile = null;
      try {
        readdata = JSON.parse(reader.result.toString());
      } catch (exception) {
        actions.setLoading(false);
        window.alert(exception);
        return;
      }
      if (!Array.isArray(readdata)) { // Not Array?
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
  }

  render() {
    const { id, className, style } = this.props;

    return (
      <input type="file" accept=".json" onChange={this.onSelect.bind(this)} id={id} className={className} style={style} />
    );
  }
}
