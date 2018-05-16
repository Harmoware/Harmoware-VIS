// @flow

import React, { Component, PropTypes } from 'react';
import type { InputEvent } from '../types';
import typeof { setDepotsBase } from '../actions';

type Props = {
  actions: {
    setDepotsBase: setDepotsBase
  }
}

export default class DepotsInput extends Component<Props> {

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
        const { longitude, latitude } = readdata[0];
        if (longitude && latitude) {
          actions.setDepotsBase(readdata);
          return;
        }
        window.alert('バス停データ形式不正');
      }
      actions.setDepotsBase([]);
    };
  }

  render() {
    return (
      <input type="file" accept=".json" onChange={this.onSelect.bind(this)} />
    );
  }
}
