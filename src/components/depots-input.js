// @flow

import React, { Component, PropTypes } from 'react';
import LoadingIcon from './loading-icon';
import type { InputEvent, I18n } from '../types';
import typeof { setDepotsBase } from '../actions';

type Props = {
  actions: {
    setDepotsBase: setDepotsBase
  },
  i18n: I18n,
  className: string
}

type State = {
  loading: boolean
}

export default class DepotsInput extends Component<Props, State> {
  static defaultProps = {
    i18n: {
      formatError: 'バス停データ形式不正'
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
    actions.setDepotsBase([]);
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
        const { longitude, latitude, position } = readdata[0];
        if ((longitude && latitude) || position) {
          this.setState({ loading: false });
          actions.setDepotsBase(readdata);
          return;
        }
        window.alert(i18n.formatError);
      }
      actions.setDepotsBase([]);
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
