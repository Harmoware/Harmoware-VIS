// @flow

import React, { Component, PropTypes } from 'react';
import type { Node } from 'react';
import typeof { setAnimatePause } from '../actions';

type Props = {
  children: Node,
  actions: {
    setAnimatePause: setAnimatePause
  }
}

export default class PauseButton extends Component<Props> {

  static defaultProps = {
    children: '⏯️ PAUSE',
  }

  // static propTypes = {
  //   actions: PropTypes.objectOf(PropTypes.func).isRequired,
  //   animatePause: PropTypes.bool.isRequired,
  //   children: PropTypes.string,
  // }

  setAnimatePause() {
    this.props.actions.setAnimatePause(true);
  }

  render() {
    const { children } = this.props;

    return (
      <button onClick={this.setAnimatePause.bind(this)}>{children}</button>
    );
  }
}
