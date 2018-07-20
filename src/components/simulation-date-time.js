// @flow

import React, { Component, PropTypes } from 'react';

type Props = {
  timeBegin: number,
  settime: number,
  caption: string,
  locales: string,
  options: any
}

export default class SimulationDateTime extends Component<Props> {
  static defaultProps = {
    caption: '',
    locales: 'ja-JP',
    options: { year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'short' },
  }

  // static propTypes = {
  //   timeBegin: PropTypes.number.isRequired,
  //   settime: PropTypes.number.isRequired,
  //   caption: PropTypes.string,
  //   locales: PropTypes.string,
  //   options: PropTypes.objectOf(PropTypes.string),
  // }

  render() {
    const { timeBegin, settime, caption, locales, options } = this.props;

    const date = new Date((timeBegin + settime) * 1000);
    const nbsp = caption.length > 0 ? ' ' : '';

    return (
      <span>{caption}{nbsp}
        {date.toLocaleString(locales, options)}
      </span>
    );
  }
}
