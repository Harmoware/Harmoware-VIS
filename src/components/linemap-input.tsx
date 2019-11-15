import * as React from 'react';
import { ActionTypes } from '../types';

interface Props {
  actions: ActionTypes,
  i18n?: { formatError: string },
  id?: string,
  className?: string,
  style?: React.CSSProperties
}

export default class LinemapInput extends React.Component<Props> {
  static defaultProps = {
    i18n: {
      formatError: 'データ形式不正'
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
    actions.setLinemapData([]);
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
        const { sourcePosition, targetPosition } = readdata[0];
        if (sourcePosition && targetPosition) {
          actions.setInputFilename({ linemapFileName: file_name });
          actions.setLoading(false);
          actions.setLinemapData(readdata);
          return;
        }
        window.alert(i18n.formatError);
      }
      actions.setInputFilename({ linemapFileName: null });
      actions.setLinemapData([]);
      actions.setLoading(false);
    };
  }

  onClick(e: React.ChangeEvent<HTMLInputElement>) {
    const { actions } = this.props;
    actions.setInputFilename({ linemapFileName: null });
    actions.setLinemapData([]);
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
