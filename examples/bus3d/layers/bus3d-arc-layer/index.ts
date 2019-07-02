import { LayerProps, CompositeLayer, ArcLayer } from 'deck.gl';
import { Arcdata } from '../../types';
import { settings } from 'harmoware-vis';
const { COLOR1 } = settings;

interface Props extends LayerProps {
    data: Arcdata[],
    visible?: boolean,
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
    getSourcePosition: (x: Arcdata) => x.sourcePosition,
    getTargetPosition: (x: Arcdata) => x.targetPosition,
    getSourceColor: (x: Arcdata) => x.sourceColor || x.color || COLOR1,
    getTargetColor: (x: Arcdata) => x.targetColor || x.color || COLOR1,
    getStrokeWidth: (x: Arcdata) => x.strokeWidth || 1,
    onClick: () => {}
  };

  static layerName = 'MovesLayer';

  getPickingInfo(pickParams: any) {
    this.props.onClick(pickParams);
  }

  renderLayers() {
    const { data, visible,
        getSourcePosition, getTargetPosition, getSourceColor, getTargetColor, getStrokeWidth
    } = this.props;

    const { distanceScales: { pixelsPerMeter } } = this.context.viewport;

    return [visible && data.length > 0 ?
      new ArcLayer({
        id: 'arch-layer',
        data,
        visible,
        pickable: true,
        getSourcePosition,
        getTargetPosition,
        getSourceColor,
        getTargetColor,
        getStrokeWidth: (x: any) => getStrokeWidth(x) * pixelsPerMeter[0]
      }): null
    ];
  }
}
