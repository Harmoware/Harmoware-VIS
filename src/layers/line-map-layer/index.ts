import { LayerProps, CompositeLayer, LineLayer } from 'deck.gl';
import { LineMapData, LineData } from '../../types';

interface Props extends LayerProps {
  linemapData: LineMapData[],
  visible?: boolean,
  opacity?: number,
  pickable?: boolean,
  getSourcePosition?: (x: any) => number[],
  getTargetPosition?: (x: any) => number[],
  getColor?: (x: any) => number[],
  getWidth?: (x: any) => number,
}

export default class LineMapLayer extends CompositeLayer<Props> {

  static defaultProps = {
    opacity: 1.0,
    pickable: true,
    getSourcePosition: (x: LineData) => x.sourcePosition,
    getTargetPosition: (x: LineData) => x.targetPosition,
    getWidth: (x: any) => x.strokeWidth || 1,
    getColor: (x: LineData) => x.color || [255,255,255,255], // white
  };

  static layerName = 'LineMapLayer';

  renderLayers() {
    const { id, linemapData, visible, opacity, pickable,
      getSourcePosition, getTargetPosition, getWidth, getColor } = this.props;

    if (!linemapData || !visible) {
      return null;
    }

    return new LineLayer({
        id: id + '-LineMapLayer',
        data: linemapData,
        visible,
        opacity,
        pickable,
        getSourcePosition,
        getTargetPosition,
        getColor,
        getWidth,
        widthUnits: 'meters',
        widthMinPixels: 0.1,
      });
  }
}
