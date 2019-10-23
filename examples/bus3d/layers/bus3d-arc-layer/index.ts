import { LayerProps, CompositeLayer, ArcLayer } from 'deck.gl';
import { Arcdata } from '../../types';
import { settings } from 'harmoware-vis';
const { COLOR1 } = settings;

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
    onClick?: (x: any) => void,
}

export default class Bus3dArcLayer extends CompositeLayer<Props> {
  static defaultProps = {
    visible: true,
    widthUnits: 'meters',
    widthScale: 1,
    widthMinPixels: 0.1,
    getSourcePosition: (x: Arcdata) => x.sourcePosition,
    getTargetPosition: (x: Arcdata) => x.targetPosition,
    getSourceColor: (x: Arcdata) => x.sourceColor || x.color || COLOR1,
    getTargetColor: (x: Arcdata) => x.targetColor || x.color || COLOR1,
    getStrokeWidth: (x: Arcdata) => x.strokeWidth || 1,
    onClick: () => {}
  };

  static layerName = 'Bus3dArcLayer';

  getPickingInfo(pickParams: any) {
    this.props.onClick(pickParams);
  }

  renderLayers() {
    const { data, visible, widthUnits, widthMinPixels,
        getSourcePosition, getTargetPosition, getSourceColor, getTargetColor, getStrokeWidth
    } = this.props;

    if (!data || data.length === 0 || !visible) {
      return null;
    }

    return new ArcLayer({
        id: 'arch-layer',
        data,
        visible,
        widthUnits,
        widthMinPixels,
        pickable: true,
        getSourcePosition,
        getTargetPosition,
        getSourceColor,
        getTargetColor,
        getWidth: (x: any) => getStrokeWidth(x)
      });
  }
}
