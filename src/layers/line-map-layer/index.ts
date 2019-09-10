import { LayerProps, CompositeLayer, LineLayer } from 'deck.gl';
import { LineMapData, LineData, Viewport } from '../../types';

interface Props extends LayerProps {
  viewport: Viewport,
  linemapData: LineMapData[],
  visible?: boolean,
  opacity?: number,
  pickable?: boolean,
  getSourcePosition?: (x: any) => number[],
  getTargetPosition?: (x: any) => number[],
  getColor?: (x: any) => number[],
  getStrokeWidth?: (x: any) => number,
}

export default class LineMapLayer extends CompositeLayer<Props> {

  static defaultProps = {
    opacity: 1.0,
    pickable: true,
    getSourcePosition: (x: LineData) => x.sourcePosition,
    getTargetPosition: (x: LineData) => x.targetPosition,
    getStrokeWidth: (x: any) => x.strokeWidth || 1,
    getColor: (x: LineData) => x.color || [255,255,255,255], // white
  };

  static layerName = 'LineMapLayer';

  renderLayers() {
    const { linemapData, visible, opacity, pickable,
      getSourcePosition, getTargetPosition, getStrokeWidth, getColor } = this.props;

    if (!linemapData) {
      return null;
    }

    const { distanceScales: { pixelsPerMeter } } = this.context.viewport;
    const average = (Math.abs(pixelsPerMeter[0]) + Math.abs(pixelsPerMeter[1])) / 2.0;
    const setStrokeWidth = (x:any) => average * getStrokeWidth(x);

    return [
      new LineLayer({
        id: 'line-map-layer',
        data: linemapData,
        visible,
        opacity,
        pickable,
        getSourcePosition,
        getTargetPosition,
        getColor,
        getStrokeWidth: setStrokeWidth,
        updateTriggers: { getStrokeWidth: average }
      }),
    ];
  }
}
