// @flow

import React, { Component, PropTypes } from 'react';
import { Icon } from 'react-icons-kit';
import { spinner } from 'react-icons-kit/fa';
import type { I18n } from '../types';

type Props = {
  i18n: I18n,
  className: string,
  loading: boolean,
}

export default class LoadingIcon extends Component<Props> {
  static defaultProps = {
    i18n: {
      loadingCaption: 'Loading...'
    },
    className: '',
    loading: false,
  }

  render() {
    const { i18n, className, loading } = this.props;

    return (
      <dev>
        {loading ? <Icon icon={spinner} className={className} /> : null}
        &nbsp;
        {loading ? i18n.loadingCaption : null}
      </dev>
    );
  }
}
