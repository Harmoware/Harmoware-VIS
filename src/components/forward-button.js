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

export default class ForwardButton extends Component<Props> {

  static defaultProps = {
    children: '▶️ FORWARD',
  }

  // static propTypes = {
  //   actions: PropTypes.objectOf(PropTypes.func).isRequired,
  //   children: PropTypes.node
  // }

  setAnimateReverse() {
    this.props.actions.setAnimateReverse(false);
  }

  render() {
    const { children } = this.props;

    return (
      <button onClick={this.setAnimateReverse.bind(this)}>{children}</button>
    );
  }
}
