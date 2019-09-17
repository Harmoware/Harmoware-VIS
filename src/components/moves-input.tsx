import * as React from 'react';
import { ActionTypes, Movesbase, MovesbaseFile } from '../types';

interface Props {
  actions: ActionTypes,
  i18n?: { formatError: string },
  id?: string,
  className?: string,
  style?: React.CSSProperties
}

export default class MovesInput extends React.Component<Props> {
  static defaultProps = {
    i18n: {
      formatError: 'ラインマップデータ形式不正'
    }
  }

  onSelect(e: React.ChangeEvent<HTMLInputElement>) {
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
      let readdata: Movesbase[] | MovesbaseFile = null;
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
      actions.setDefaultViewport();
      actions.setRoutePaths([]);
      actions.setClicked(null);
      actions.setAnimatePause(false);
      actions.setAnimateReverse(false);
      actions.setLoading(false);
    };
  }

  onClick(e: React.ChangeEvent<HTMLInputElement>) {
    const { actions } = this.props;
    actions.setInputFilename({ movesFileName: null });
    actions.setMovesBase([]);
    e.target.value = '';
  }

  render() {
    const { id, className, style } = this.props;

    return (
      <input type="file" accept=".json"
      id={id} className={className} style={style}
      onClick={this.onClick.bind(this)}
      onChange={this.onSelect.bind(this)}
      />
    );
  }
}
