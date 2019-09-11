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

  setViewport(argument: Viewport) {
    this.props.actions.setViewport(argument);
  }

  render() {
    const { buttonType, viewport, className } = this.props;
    switch (buttonType) {
      case 'zoom-in': {
        const zoom = Math.min(viewport.zoom + 0.5, viewport.maxZoom);
        return (
          <button
            onClick={this.setViewport.bind(this, { zoom })}
            className={className}
          >＋</button>
        );
      }
      case 'zoom-out': {
        const zoom = Math.max(viewport.zoom - 0.5, viewport.minZoom);
        return (
          <button
            onClick={this.setViewport.bind(this, { zoom })}
            className={className}
          >－</button>
        );
      }
      case 'compass': {
        const iconStyle = { transform: `rotate(${viewport.bearing * -1}deg)` };
        return (
          <button
            onClick={this.setViewport.bind(this,
              { bearing: 0, pitch: 30 })}
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
