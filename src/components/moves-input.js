// @flow

import React, { Component, PropTypes } from 'react';
import type { InputEvent } from '../types';
import typeof { setMovesBase, setRoutePaths, setClicked, setAnimatePause, setAnimateReverse } from '../actions';

type Props = {
  actions: {
    setMovesBase: setMovesBase,
    setRoutePaths: setRoutePaths,
    setClicked: setClicked,
    setAnimatePause: setAnimatePause,
    setAnimateReverse: setAnimateReverse,
  }
}

export default class MovesInput extends Component<Props> {

  // static propTypes = {
  //   actions: PropTypes.objectOf(PropTypes.func).isRequired,
  // }

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
      if (!Array.isArray(readdata)) { // Not Array?
        const { movesbase } = readdata;
        if (!movesbase) {
          window.alert('運行データ形式不正');
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
    return (
      <input type="file" accept=".json" onChange={this.onSelect.bind(this)} />
    );
  }
}
