import { LayerProps, CompositeLayer, LineLayer } from 'deck.gl';
import { LineData } from '../../types';

interface Props extends LayerProps {
  getSourcePosition?: (x: any) => number[],
  getTargetPosition?: (x: any) => number[],
  getColor?: (x: any) => number[],
  getWidth?: (x: any) => number,
  widthUnits?: string,
  widthMinPixels?: number,
}

export default class LineMapLayer extends CompositeLayer<Props> {

  static defaultProps = {
    id: 'LineMap',
    opacity: 1.0,
    pickable: true,
    getSourcePosition: (x: LineData) => x.sourcePosition,
    getTargetPosition: (x: LineData) => x.targetPosition,
    getWidth: (x: any) => x.strokeWidth || 1,
    getColor: (x: LineData) => x.color || [255,255,255,255], // white
    widthUnits: 'meters',
    widthMinPixels: 0.1,
};

  static layerName = 'LineMapLayer';

  renderLayers() {
    const { id, data, visible, opacity, pickable,
      getSourcePosition, getTargetPosition, getWidth, getColor,
      widthUnits, widthMinPixels } = this.props;

    if (!data || !visible) {
      return null;
    }

    return new LineLayer({
        id: id + '-LineMapLayer',
        data,
        visible,
        opacity,
        pickable,
        getSourcePosition,
        getTargetPosition,
        getColor,
        getWidth,
        widthUnits,
        widthMinPixels,
      });
  }
}
