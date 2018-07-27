// @flow

import React, { Component, PropTypes } from 'react';
import type { InputEvent, I18n } from '../types';
import typeof { setLinemapData } from '../actions';

type Props = {
  actions: {
    setLinemapData: setLinemapData
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
        const { sourcePosition, targetPosition } = readdata[0];
        if (sourcePosition && targetPosition) {
          actions.setLinemapData(readdata);
          return;
        }
        window.alert(i18n.formatError);
      }
      actions.setLinemapData([]);
    };
  }

  render() {
    const { className } = this.props;

    return (
      <input type="file" accept=".json" onChange={this.onSelect.bind(this)} className={className} />
    );
  }
}
