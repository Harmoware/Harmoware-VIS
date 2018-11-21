

import * as React from 'react';
import { Bus3dActions } from '../types';
import { InputEvent } from 'harmoware-vis';

interface Props {
  actions: typeof Bus3dActions,
}

interface State {
  filename: string,
}

export default class XbandDataInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filename: '',
    };
  }

  onSelect(e: InputEvent) {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const { actions } = this.props;
    actions.setLoading(true);
    reader.readAsText(file);
    reader.onload = () => {
      let readdata: any = null;
      try {
        readdata = JSON.parse(reader.result.toString());
      } catch (exception) {
        actions.setLoading(false);
        window.alert(exception);
        return;
      }
      if (readdata.length > 0) {
        const { position, elevation, color } = readdata[0];
        if (position && (elevation || color)) {
          actions.setRainfall(readdata);
          this.setState({ filename: file.name });
          actions.setLoading(false);
          return;
        }
        actions.setLoading(false);
        window.alert('雨量データ形式不正');
      }
      actions.setRainfall([]);
      this.setState({ filename: '選択されていません' });
      actions.setLoading(false);
    };
  }

  render() {
    const nowrapstyle = { textAlign: 'center' as 'center', whiteSpace: 'nowrap' as 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
    return (
      <div className="input-group input-group-sm">
        <label htmlFor="XbandDataInput" className="harmovis_button">雨量データ選択
          <input type="file" accept=".json" onChange={this.onSelect.bind(this)} id="XbandDataInput" style={{ display: 'none' }} />
        </label>
        <div style={nowrapstyle}>{this.state.filename}</div>
      </div>
    );
  }
}
