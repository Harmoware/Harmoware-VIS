// @flow

import React, { Component } from 'react';
import { RingLoader } from 'react-spinners';

type Props = {
  loading: boolean,
  color: string
}

export default class LoadingIcon extends Component<Props> {
  static defaultProps = {
    loading: false,
    color: 'white'
  }

  render() {
    const { loading, color } = this.props;
    const devStyle = { position: 'fixed', zIndex: 200, top: 0, left: 0, width: '100%', height: '100%', display: 'flex' };
    const iconStyle = { margin: 'auto', display: 'flex' };

    if (loading) {
      return (
        <dev style={devStyle}>
          <dev style={iconStyle}>
            <RingLoader size={60} color={color} loading={loading} />
          </dev>
        </dev>
      );
    }
    return null;
  }
}
