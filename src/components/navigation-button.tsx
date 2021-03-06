import * as React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_navigation as icNavigation } from 'react-icons-kit/md';
import { ActionTypes, Viewport } from '../types';
const {max,min} = Math;

interface Props {
  buttonType: string,
  actions: ActionTypes,
  viewport: Viewport,
  className?: string,
  title?: string,
}

export default class NavigationButton extends React.Component<Props> {
  static defaultProps = {
    className: 'harmovis_button'
  }

  setViewport(argument: Viewport) {
    this.props.actions.setViewport(argument);
  }
  setDefaultViewport(){
    this.props.actions.setDefaultViewport();
  }

  render() {
    const { buttonType, viewport, className, title: propTitle } = this.props;
    switch (buttonType) {
      case 'zoom-in': {
        const title = propTitle || buttonType;
        const zoom = min(viewport.zoom + 0.5, viewport.maxZoom);
        return (
          <button
            onClick={this.setViewport.bind(this, { zoom })}
            className={className} title={title}
          >＋</button>
        );
      }
      case 'zoom-out': {
        const title = propTitle || buttonType;
        const zoom = max(viewport.zoom - 0.5, viewport.minZoom);
        return (
          <button
            onClick={this.setViewport.bind(this, { zoom })}
            className={className} title={title}
          >－</button>
        );
      }
      case 'compass': {
        const title = propTitle || 'Viewpoint reset';
        const iconStyle = { transform: `rotate(${-viewport.bearing}deg)` };
        return (
          <button
            onClick={this.setDefaultViewport.bind(this)}
            className={className} title={title}
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
