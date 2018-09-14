// @flow

import React, { Component } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_navigation as icNavigation } from 'react-icons-kit/md';
import type { Viewport } from '../types';
import typeof { setViewport as setViewportType } from '../actions';


type Props = {
  buttonType: string,
  actions: {
    setViewport: setViewportType
  },
  viewport: Viewport,
  className: string
}

export default class NavigationButton extends Component<Props> {
  setViewport(argument: Object) {
    this.props.actions.setViewport(argument);
  }

  render() {
    const { buttonType, viewport, className } = this.props;
    switch (buttonType) {
      case 'zoom-in': {
        const value = Math.min(viewport.zoom + 1, viewport.maxZoom);
        return (
          <button
            onClick={this.setViewport.bind(this, { zoom: value })}
            className={className}
          >＋</button>
        );
      }
      case 'zoom-out': {
        const value = Math.max(viewport.zoom - 1, viewport.minZoom);
        return (
          <button
            onClick={this.setViewport.bind(this, { zoom: value })}
            className={className}
          >－</button>
        );
      }
      case 'compass': {
        const iconStyle = { transform: `rotate(${viewport.bearing * -1}deg)` };
        return (
          <button
            onClick={this.setViewport.bind(this, { bearing: 0, pitch: 30 })}
            className={className}
          >
            <span style={iconStyle}><Icon icon={icNavigation} /></span>
          </button>
        );
      }
      default:
        return null;
    }
  }
}
