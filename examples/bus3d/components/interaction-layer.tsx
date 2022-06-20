import * as React from 'react';
import { Viewport } from 'harmoware-vis';
import { Bus3dEventInfo } from '../types';

interface Props {
  viewport: Viewport,
  hovered: Bus3dEventInfo
};
interface ElementInfo {
  movesbaseidx: number,
  code: string,
  name: string,
  memo: string,
};
const InteractionLayer = ({ viewport, hovered }: Props) => {
  // set flags used below to determine if SVG highlight elements should be rendered.
  // if truthy, each flag is replaced with the corresponding element to render.
  const elementInfo: { hovered: { movesbaseidx?: number, code?: string, } | JSX.Element } = {
    hovered: hovered && hovered.object,
  };

  // render additional info about the focused elements (only nodes, not links)
  Object.keys(elementInfo).forEach((k) => {
    const el: ElementInfo = elementInfo[k];
    if (el && el.code && k === 'hovered') {
      elementInfo[k] = (<text
        x={hovered.x + 10}
        y={hovered.y + 0}
      >{el.code}:{el.name} {el.memo}</text>);
    } else
    if (el && el.memo && k === 'hovered') {
      elementInfo[k] = (<text
        x={hovered.x + 10}
        y={hovered.y + 0}
      >{el.memo}</text>);
    } else {
      elementInfo[k] = null;
    }
  });

  // Note: node.x/y, calculated by d3 layout,
  // is measured from the center of the layout (of the viewport).
  // Therefore, we offset the <g> container to align.
  return (
    <svg width={viewport.width} height={viewport.height} className="harmovis_overlay">
      <g fill="white" fontSize="12">
        {elementInfo.hovered}
      </g>
    </svg>
  );
};
export default InteractionLayer