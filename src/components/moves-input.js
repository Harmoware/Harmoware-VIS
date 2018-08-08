// @flow

import React, { Component, PropTypes } from 'react';
import LoadingIcon from './loading-icon';
import type { InputEvent, I18n } from '../types';
import typeof { setMovesBase, setRoutePaths, setClicked, setAnimatePause, setAnimateReverse } from '../actions';

type Props = {
  actions: {
    setMovesBase: setMovesBase,
    setRoutePaths: setRoutePaths,
    setClicked: setClicked,
    setAnimatePause: setAnimatePause,
    setAnimateReverse: setAnimateReverse,
  },
  i18n: I18n,
  className: string
}

type State = {
  loading: boolean
}

export default class MovesInput extends Component<Props, State> {
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
    actions.setMovesBase([]);
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
      if (!Array.isArray(readdata)) { // Not Array?
        const { movesbase } = readdata;
        if (!movesbase) {
          this.setState({ loading: false });
          window.alert(i18n.formatError);
          return;
        }
      }
      actions.setMovesBase(readdata);
      actions.setRoutePaths([]);
      actions.setClicked(null);
      actions.setAnimatePause(false);
      actions.setAnimateReverse(false);
      this.setState({ loading: false });
    };
  }

  render() {
    const { className } = this.props;
    const { loading } = this.state;

    return (
      <dev>
        <input type="file" accept=".json" onChange={this.onSelect.bind(this)} className={className} />&nbsp;
        <LoadingIcon loading={loading} />
      </dev>
    );
  }
}
