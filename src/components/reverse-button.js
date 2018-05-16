// @flow

import React, { Component, PropTypes } from 'react';
import type { Node } from 'react';
import typeof { setAnimateReverse } from '../actions';

type Props = {
  actions: {
    setAnimateReverse: setAnimateReverse
  },
  children: Node
}

export default class ReverseButton extends Component<Props> {

  static defaultProps = {
    children: '◀️ 逆再生',
  }

  // static propTypes = {
  //   actions: PropTypes.objectOf(PropTypes.func).isRequired,
  //   children: PropTypes.node,
  // }

  setAnimateReverse() {
    this.props.actions.setAnimateReverse(true);
  }

  render() {
    const { children } = this.props;

    return (
      <button onClick={this.setAnimateReverse.bind(this)}>{children}</button>
    );
  }
}
