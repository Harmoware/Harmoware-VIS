// @flow

import React, { Component, PropTypes } from 'react';
import type { InputEvent } from '../types';
import typeof { setLinemapData } from '../actions';

type Props = {
  actions: {
    setLinemapData: setLinemapData
  }
}

export default class LinemapInput extends Component<Props> {

  onSelect(e: InputEvent) {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    reader.readAsText(file);
    reader.onload = () => {
      const { actions } = this.props;
      let readdata = '';
      try {
        readdata = JSON.parse(reader.result.toString());
      } catch (exception) {
        window.alert(exception);
        return;
      }
      if (readdata.length > 0) {
        const { sourcePosition, targetPosition } = readdata[0];
        if (sourcePosition && targetPosition) {
          actions.setLinemapData(readdata);
          return;
        }
        window.alert('ラインマップデータ形式不正');
      }
      actions.setLinemapData([]);
    };
  }

  render() {
    return (
      <input type="file" accept=".json" onChange={this.onSelect.bind(this)} />
    );
  }
}
