// @flow

import React, { Component } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_navigation as icNavigation } from 'react-icons-kit/md';
import typeof { setViewport as setViewportType } from '../actions';


type Props = {
  buttonType: string,
  actions: {
    setViewport: setViewportType
  },
  viewport: {
    zoom: number,
    minZoom: number,
    maxZoom: number,
    distance: number,
    minDistance: number,
    maxDistance: number,
    bearing: number,
  },
  className: string
}

export default class NavigationButton extends Component<Props> {
  static defaultProps = {
    className: 'harmovis_button'
  }

  setViewport(argument: Object) {
    this.props.actions.setViewport(argument);
  }

  render() {
    const { buttonType, viewport, className } = this.props;
    switch (buttonType) {
      case 'zoom-in': {
        const value1 = Math.min(viewport.zoom + 0.5, viewport.maxZoom);
        const value2 = Math.max(viewport.distance - 4, viewport.minDistance);
        return (
          <button
            onClick={this.setViewport.bind(this, { zoom: value1, distance: value2 })}
            className={className}
          >＋</button>
        );
      }
      case 'zoom-out': {
        const value1 = Math.max(viewport.zoom - 0.5, viewport.minZoom);
        const value2 = Math.min(viewport.distance + 4, viewport.maxDistance);
        return (
          <button
            onClick={this.setViewport.bind(this, { zoom: value1, distance: value2 })}
            className={className}
          >－</button>
        );
      }
      case 'compass': {
        const iconStyle = { transform: `rotate(${viewport.bearing * -1}deg)` };
        return (
          <button
            onClick={this.setViewport.bind(this,
              { bearing: 0, pitch: 30, rotationX: 60, rotationY: 0, lookAt: [0, 0, 0] })}
            className={className}
          >
            <div style={iconStyle}><Icon icon={icNavigation} /></div>
          </button>
        );
      }
      default:
        return null;
    }
  }
}
