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

const NavigationButton = (props:Props)=>{
  const { buttonType, viewport, className, title: propTitle } = props;

  const setViewport = (argument: Viewport)=>{
    props.actions.setViewport(argument);
  }

  const setDefaultViewport = ()=>{
    props.actions.setDefaultViewport();
  }

  switch (buttonType) {
    case 'zoom-in': {
      const title = propTitle || buttonType;
      const zoom = min(viewport.zoom + 0.5, viewport.maxZoom);
      return (
        <button
          onClick={()=>setViewport({ zoom })}
          className={className} title={title}
        >＋</button>
      );
    }
    case 'zoom-out': {
      const title = propTitle || buttonType;
      const zoom = max(viewport.zoom - 0.5, viewport.minZoom);
      return (
        <button
          onClick={()=>setViewport({ zoom })}
          className={className} title={title}
        >－</button>
      );
    }
    case 'compass': {
      const title = propTitle || 'Viewpoint reset';
      const iconStyle = { transform: `rotate(${-viewport.bearing}deg)` };
      return (
        <button
          onClick={setDefaultViewport}
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
NavigationButton.defaultProps = {
  className: 'harmovis_button'
}
export default NavigationButton
