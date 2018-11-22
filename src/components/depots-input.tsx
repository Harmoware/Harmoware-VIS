

import * as React from 'react';
import { ActionTypes, InputEvent } from '../types';

interface Props {
  actions: ActionTypes,
  i18n?: { formatError: string },
  id?: string,
  className?: string,
  style?: React.CSSProperties
}

export default class DepotsInput extends React.Component<Props> {
  static defaultProps = {
    i18n: {
      formatError: 'バス停データ形式不正'
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
      actions.setDepotsBase([]);
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
