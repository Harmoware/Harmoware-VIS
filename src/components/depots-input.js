// @flow

import React, { Component } from 'react';
import type { InputEvent, I18n } from '../types';
import typeof { setDepotsBase, setLoading } from '../actions';

type Props = {
  actions: {
    setDepotsBase: setDepotsBase,
    setLoading: setLoading
  },
  i18n: I18n,
  className: string
}

export default class DepotsInput extends Component<Props> {
  static defaultProps = {
    i18n: {
      formatError: 'バス停データ形式不正'
    },
    className: ''
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
    reader.onload = () => {
      let readdata = '';
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
    const { className } = this.props;

    return (
      <dev>
        <input type="file" accept=".json" onChange={this.onSelect.bind(this)} className={className} />
      </dev>
    );
  }
}
