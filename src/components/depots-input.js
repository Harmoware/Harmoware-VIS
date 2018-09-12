// @flow

import React, { Component } from 'react';
import type { InputEvent, I18n } from '../types';
import typeof { setDepotsBase, setLoading, setInputFilename } from '../actions';
import { displayNone } from '../styles';

type Props = {
  actions: {
    setDepotsBase: setDepotsBase,
    setLoading: setLoading,
    setInputFilename: setInputFilename
  },
  i18n: I18n,
  id: string,
  className: string,
  style: Object
}

export default class DepotsInput extends Component<Props> {
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
          actions.setInputFilename({ depotsFileName: (file.name: string) });
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
