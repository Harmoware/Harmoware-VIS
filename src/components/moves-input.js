// @flow

import React, { Component, PropTypes } from 'react';
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

export default class MovesInput extends Component<Props> {
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
      if (!Array.isArray(readdata)) { // Not Array?
        const { movesbase } = readdata;
        if (!movesbase) {
          window.alert(i18n.formatError);
          return;
        }
      }
      actions.setMovesBase(readdata);
      actions.setRoutePaths([]);
      actions.setClicked(null);
      actions.setAnimatePause(false);
      actions.setAnimateReverse(false);
    };
  }

  render() {
    const { className } = this.props;

    return (
      <input type="file" accept=".json" onChange={this.onSelect.bind(this)} className={className} />
    );
  }
}
