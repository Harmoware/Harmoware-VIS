// @flow

import React, { Component, PropTypes } from 'react';
import LoadingIcon from './loading-icon';
import type { InputEvent, I18n } from '../types';
import typeof { setLinemapData } from '../actions';

type Props = {
  actions: {
    setLinemapData: setLinemapData
  },
  i18n: I18n,
  className: string
}

type State = {
  loading: boolean
}

export default class LinemapInput extends Component<Props, State> {
  static defaultProps = {
    i18n: {
      formatError: 'ラインマップデータ形式不正'
    },
    className: ''
  }

  constructor() {
    super();
    this.state = {
      loading: false
    };
  }

  onSelect(e: InputEvent) {
    const { i18n, actions } = this.props;
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    this.setState({ loading: true });
    actions.setLinemapData([]);
    reader.readAsText(file);
    reader.onload = () => {
      let readdata = '';
      try {
        readdata = JSON.parse(reader.result.toString());
      } catch (exception) {
        this.setState({ loading: false });
        window.alert(exception);
        return;
      }
      if (readdata.length > 0) {
        const { sourcePosition, targetPosition } = readdata[0];
        if (sourcePosition && targetPosition) {
          this.setState({ loading: false });
          actions.setLinemapData(readdata);
          return;
        }
        window.alert(i18n.formatError);
      }
      actions.setLinemapData([]);
      this.setState({ loading: false });
    };
  }

  render() {
    const { className } = this.props;
    const { loading } = this.state;

    return (
      <dev>
        <input type="file" accept=".json" onChange={this.onSelect.bind(this)} className={className} />
        <LoadingIcon loading={loading} />
      </dev>
    );
  }
}
