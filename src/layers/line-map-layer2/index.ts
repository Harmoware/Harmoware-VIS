import { LayerProps, CompositeLayer, LineLayer, COORDINATE_SYSTEM } from 'deck.gl';
import { COLOR2 } from '../../constants/settings';
import { LineMapData, LineData } from '../../types';

interface Props extends LayerProps {
  layerOpacity?: number,
  linemapData: LineMapData[],
  getStrokeWidth?: any,
  getColor?: (x: any) => number[],
}

export default class LineMapLayer2 extends CompositeLayer<Props> {

  static defaultProps = {
    layerOpacity: 1.0,
    getStrokeWidth: (x: any) => x.strokeWidth || 100,
    getColor: (x: LineData) => x.color || COLOR2
  };

  static layerName = 'LineMapLayer2';

  renderLayers() {
    const { layerOpacity, linemapData, getStrokeWidth, getColor } = this.props;

    if (!linemapData) {
      return null;
    }

    const getSourcePosition = (x: LineData) => x.sourcePosition;
    const getTargetPosition = (x: LineData) => x.targetPosition;

    return [
      new LineLayer({
        id: 'line-map-layer',
        data: linemapData,
        coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
        getSourcePosition,
        getTargetPosition,
        getColor,
        opacity: layerOpacity,
        pickable: true,
        getStrokeWidth
      }),
    ];
  }
}
