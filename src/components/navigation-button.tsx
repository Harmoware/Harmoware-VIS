import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_navigation as icNavigation } from 'react-icons-kit/md';
import { ActionTypes, Viewport } from '../types';


interface Props {
  buttonType: string,
  actions: ActionTypes,
  viewport: Viewport,
  className?: string
}

export default class NavigationButton extends React.Component<Props> {
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
        const zoom = Math.min(viewport.zoom + 0.5, viewport.maxZoom);
        const distance = Math.max(viewport.distance - 4, viewport.minDistance);
        return (
          <button
            onClick={this.setViewport.bind(this, { zoom, distance })}
            className={className}
          >＋</button>
        );
      }
      case 'zoom-out': {
        const zoom = Math.max(viewport.zoom - 0.5, viewport.minZoom);
        const distance = Math.min(viewport.distance + 4, viewport.maxDistance);
        return (
          <button
            onClick={this.setViewport.bind(this, { zoom, distance })}
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
