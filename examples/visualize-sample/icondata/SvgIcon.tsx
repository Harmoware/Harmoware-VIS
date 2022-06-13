import * as React from 'react';
import { Viewport } from 'harmoware-vis';

const pinStyle = {
  cursor: 'pointer'
};

const RECT_HEIGHT = 24;
const RECT_WIDTH  = RECT_HEIGHT / 2;
const ZOOM_MAX = 18;
const ZOOM_MIN = 14;
const {max,min} = Math;
const two = function(v:number) {return ('0' + v.toString(16)).slice(-2);}
const viewsize = max(RECT_HEIGHT,RECT_WIDTH)*(4/3);
const x = (viewsize-RECT_WIDTH)/2;
const y = (viewsize-RECT_HEIGHT)/2;
const cx = (viewsize/2)-x;
const cy = (viewsize/2)-y;

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

const SvgIcon = (props:Props)=>{
  const {maxsize, minsize, onMouseOver ,onMouseOut , strokecolor, fillcolor, viewport, direction} = props;
  const calcheight = React.useMemo(
    ()=>(((viewport.zoom - ZOOM_MIN)/(ZOOM_MAX - ZOOM_MIN))*(maxsize - minsize)) + minsize,
    [viewport.zoom,maxsize,minsize]);
  const viewheight = React.useMemo(
    ()=>viewport.zoom > ZOOM_MAX ? maxsize : viewport.zoom < ZOOM_MIN ? minsize : calcheight,
    [calcheight,viewport.zoom,maxsize,minsize]);
  const translate_y = React.useMemo(
    ()=>viewport.zoom < ZOOM_MIN ? (minsize/6)*10 : viewheight,
    [viewheight,viewport.zoom,minsize]);
  const mmsum = React.useMemo(
    ()=>max.apply(null, fillcolor) + min.apply(null, fillcolor),[fillcolor]);
  const fillcolor_top = React.useMemo(
    ()=>[mmsum - fillcolor[0], mmsum - fillcolor[1], mmsum - fillcolor[2]],[mmsum,fillcolor]);
  const stroke = React.useMemo(
    ()=>'#'+two(strokecolor[0])+two(strokecolor[1])+two(strokecolor[2]),[strokecolor]);
  const fill_body = React.useMemo(
    ()=>'#'+two(fillcolor[0])+two(fillcolor[1])+two(fillcolor[2]),[fillcolor]);
  const fill_top = React.useMemo(
    ()=>'#'+two(fillcolor_top[0])+two(fillcolor_top[1])+two(fillcolor_top[2]),[fillcolor_top]);
  const rotate = React.useMemo(()=>direction-viewport.bearing,[direction,viewport.bearing])
  return (
    <svg height={viewheight} viewBox={'0 0 '+viewsize+' '+viewsize}
      style={{...pinStyle, transform: `translate(${-viewheight/2}px,${-translate_y/2}px)`}}
      onMouseOver={onMouseOver} onMouseOut={onMouseOut} >
      <g transform={'translate('+x+' '+y+') rotate('+rotate+' '+cx+' '+cy+')'}>
        <rect height={RECT_HEIGHT*0.2} width={RECT_WIDTH} stroke={stroke} fill={fill_top}></rect>
        <rect height={RECT_HEIGHT*0.8} width={RECT_WIDTH} y={RECT_HEIGHT*0.2} stroke={stroke} fill={fill_body}></rect>
      </g>
    </svg>
  );
}
SvgIcon.defaultProps = {
  maxsize: 52,
  minsize: 12,
  onMouseOver: ()=>{},
  onMouseOut: ()=>{},
  strokecolor: [0,134,178],
  fillcolor: [0,134,178],
  direction: 0
}
export default SvgIcon
