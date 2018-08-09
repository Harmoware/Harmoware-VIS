// @flow

import React, { Component, PropTypes } from 'react';
import type { InputEvent, I18n } from '../types';
import typeof { setLinemapData, setLoading } from '../actions';

type Props = {
  actions: {
    setLinemapData: setLinemapData,
    setLoading: setLoading
  },
  i18n: I18n,
  className: string
}

export default class LinemapInput extends Component<Props> {
  static defaultProps = {
    i18n: {
      formatError: 'ラインマップデータ形式不正'
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
    actions.setLinemapData([]);
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
        const { sourcePosition, targetPosition } = readdata[0];
        if (sourcePosition && targetPosition) {
          actions.setLoading(false);
          actions.setLinemapData(readdata);
          return;
        }
        window.alert(i18n.formatError);
      }
      actions.setLinemapData([]);
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
