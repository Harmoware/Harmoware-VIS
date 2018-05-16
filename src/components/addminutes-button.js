// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import typeof { addMinutes as addMinutesType } from '../actions';

type Props = {
  addMinutes: number,
  children?: Node,
  actions: {
    addMinutes: addMinutesType
  }
}

export default class AddMinutesButton extends Component<Props> {

  static defaultProps = {
    addMinutes: 10
  }

  addMinutes(minutes: number) {
    this.props.actions.addMinutes(minutes);
  }

  render() {
    const { addMinutes, children } = this.props;

    return (
      <button onClick={this.addMinutes.bind(this, addMinutes)}>{children}</button>
    );
  }
}
