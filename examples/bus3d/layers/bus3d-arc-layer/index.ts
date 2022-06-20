import { ArcLayer } from '@deck.gl/layers';
import { LayerProps } from '@deck.gl/core';
import { Arcdata } from '../../types';
import { settings } from 'harmoware-vis';
const assign = Object.assign;

interface Props extends LayerProps {
    data: Arcdata[],
    visible?: boolean,
    widthUnits?: string,
    widthScale?: number,
    widthMinPixels?: number,
    getSourcePosition?: (x: Arcdata) => number[],
    getTargetPosition?: (x: Arcdata) => number[],
    getSourceColor?: (x: Arcdata) => number[],
    getTargetColor?: (x: Arcdata) => number[],
    getStrokeWidth?: (x: Arcdata) => number,
    getWidth?: (x: Arcdata) => number,
}

class Bus3dArcLayer extends ArcLayer<Props> {

  constructor(props: Props) {
    const setProps = assign({}, Bus3dArcLayer.defaultProps, props);
    const { getWidth, getStrokeWidth, ...otherProps } = setProps;
    super(assign({}, otherProps, { getWidth: getWidth || getStrokeWidth }));
  }

  static defaultProps = {
    visible: true,
    widthUnits: 'meters',
    widthScale: 1,
    widthMinPixels: 0.1,
    getSourcePosition: (x: Arcdata) => x.sourcePosition,
    getTargetPosition: (x: Arcdata) => x.targetPosition,
    getSourceColor: (x: Arcdata) => x.sourceColor || x.color || settings.COLOR1,
    getTargetColor: (x: Arcdata) => x.targetColor || x.color || settings.COLOR1,
    getStrokeWidth: (x: Arcdata) => x.strokeWidth || 1,
  };

  static layerName = 'Bus3dArcLayer';
}
export default Bus3dArcLayer