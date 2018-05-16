// @flow

import React, { Component, PropTypes } from 'react';
import type { Node } from 'react';
import typeof { setAnimatePause } from '../actions';


type Props = {
  actions: {
    setAnimatePause: setAnimatePause
  },
  children: Node
}

export default class PlayButton extends Component<Props> {

  static defaultProps = {
    children: '⏯️ 開始　　',
  }

  // static propTypes = {
  //   actions: PropTypes.objectOf(PropTypes.func).isRequired,
  //   children: PropTypes.node
  // }

  setAnimatePause() {
    this.props.actions.setAnimatePause(false);
  }

  render() {
    const { children } = this.props;

    return (
      <button onClick={this.setAnimatePause.bind(this)}>{children}</button>
    );
  }
}
