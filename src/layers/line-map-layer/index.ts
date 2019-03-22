import { LayerProps, CompositeLayer, LineLayer, COORDINATE_SYSTEM } from 'deck.gl';
import { COLOR2 } from '../../constants/settings';
import { LineMapData, LineData, EventInfo } from '../../types';

interface Props extends LayerProps {
  layerOpacity?: number,
  linemapData: LineMapData[],
  getStrokeWidth?: any,
  getColor?: (x: any) => number[],
}

export default class LineMapLayer extends CompositeLayer<Props> {

  static defaultProps = {
    layerOpacity: 1.0,
    getStrokeWidth: 100,
    getColor: (x: LineData) => x.color || COLOR2
  };

  static layerName = 'LineMapLayer';

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
