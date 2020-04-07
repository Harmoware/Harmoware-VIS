import * as React from 'react';
import { Viewport } from 'harmoware-vis';

const pinStyle = {
  cursor: 'pointer'
};

const RECT_HEIGHT = 24;
const RECT_WIDTH  = RECT_HEIGHT / 2;
const ZOOM_MAX = 18;
const ZOOM_MIN = 14;

interface Props {
  viewport: Viewport,
  maxsize?: number,
  minsize?: number,
  onMouseOver?: any,
  onMouseOut?: any,
  strokecolor?: number[],
  fillcolor?: number[],
  direction?: number
}

export default class SvgIcon extends React.PureComponent<Props> {

  static defaultProps = {
    maxsize: 52,
    minsize: 12,
    onMouseOver: ()=>{},
    onMouseOut: ()=>{},
    strokecolor: [0,134,178],
    fillcolor: [0,134,178],
    direction: 0
  };

  render() {
    const two = function(v) {return ('0' + v.toString(16)).slice(-2);}
    const {maxsize, minsize, onMouseOver ,onMouseOut , strokecolor, fillcolor, viewport, direction} = this.props;
    const calcheight = (((viewport.zoom - ZOOM_MIN)/(ZOOM_MAX - ZOOM_MIN))*(maxsize - minsize)) + minsize	;
    const viewheight = viewport.zoom > ZOOM_MAX ? maxsize : viewport.zoom < ZOOM_MIN ? minsize : calcheight;
    const translate_y = viewport.zoom < ZOOM_MIN ? (minsize/6)*10 : viewheight;
    const viewsize = Math.max(RECT_HEIGHT,RECT_WIDTH)*(4/3);
    const x = (viewsize-RECT_WIDTH)/2;
    const y = (viewsize-RECT_HEIGHT)/2;
    const cx = (viewsize/2)-x;
    const cy = (viewsize/2)-y;
    const mmsum = Math.max.apply(null, fillcolor) + Math.min.apply(null, fillcolor);
    const fillcolor_top = [mmsum - fillcolor[0], mmsum - fillcolor[1], mmsum - fillcolor[2]];
    const stroke = '#'+two(strokecolor[0])+two(strokecolor[1])+two(strokecolor[2]);
    const fill_body = '#'+two(fillcolor[0])+two(fillcolor[1])+two(fillcolor[2]);
    const fill_top = '#'+two(fillcolor_top[0])+two(fillcolor_top[1])+two(fillcolor_top[2]);
    return (
      <svg height={viewheight} viewBox={'0 0 '+viewsize+' '+viewsize}
        style={{...pinStyle, transform: `translate(${-viewheight/2}px,${-translate_y/2}px)`}}
        onMouseOver={onMouseOver} onMouseOut={onMouseOut} >
        <g transform={'translate('+x+' '+y+') rotate('+(direction-viewport.bearing)+' '+cx+' '+cy+')'}>
          <rect height={RECT_HEIGHT*0.2} width={RECT_WIDTH} stroke={stroke} fill={fill_top}></rect>
          <rect height={RECT_HEIGHT*0.8} width={RECT_WIDTH} y={RECT_HEIGHT*0.2} stroke={stroke} fill={fill_body}></rect>
        </g>
      </svg>
    );
  }
}
