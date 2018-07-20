// @flow

import React, { Component, PropTypes } from 'react';
import type { InputEvent, I18n } from '../types';
import typeof { setDepotsBase } from '../actions';

type Props = {
  actions: {
    setDepotsBase: setDepotsBase
  },
  i18n: I18n
}

export default class DepotsInput extends Component<Props> {
  static defaultProps = {
    i18n: {
      formatError: 'バス停データ形式不正'
    }
  }

  onSelect(e: InputEvent) {
    const { i18n } = this.props;
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
        const { longitude, latitude, position } = readdata[0];
        if ((longitude && latitude) || position) {
          actions.setDepotsBase(readdata);
          return;
        }
        window.alert(i18n.formatError);
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
