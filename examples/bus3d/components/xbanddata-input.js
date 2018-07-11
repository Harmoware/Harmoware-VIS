import React, { Component, PropTypes } from 'react';
import { InputEvent } from 'harmoware-vis';

export default class XbandDataInput extends Component {

  static propTypes = {
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
  }

  onSelect(e: InputEvent) {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    reader.readAsText(file);
    reader.onload = () => {
      const { actions } = this.props;
      let readdata: Array<{ position: number, elevation: number, color: Array<number> }> | string = '';
      try {
        readdata = JSON.parse(reader.result.toString());
      } catch (exception) {
        window.alert(exception);
        return;
      }
      if (readdata.length > 0) {
        const { position, elevation, color } = readdata[0];
        if (position && (elevation || color)) {
          actions.setRainfall(readdata);
          return;
        }
        window.alert('雨量データ形式不正');
      }
      actions.setRainfall([]);
    };
  }

  render() {
    return (
      <input type="file" accept=".json" onChange={this.onSelect.bind(this)} />
    );
  }
}
