import { CompositeLayer, LineLayer, COORDINATE_SYSTEM } from 'deck.gl';
import { COLOR2 } from '../../constants/settings';
import { LineMapData, LineData } from 'harmoware-vis';

interface Props {
  layerOpacity?: number,
  linemapData: Array<LineMapData>,
  strokeWidth?: number,
  getColor?: (x) => Array<number>,
  onHover?: (event: React.MouseEvent<HTMLButtonElement>) => void,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

export default class LineMapLayer extends CompositeLayer<Props> {

  static defaultProps = {
    layerOpacity: 1.0,
    strokeWidth: 20,
    getColor: (x: LineData) => x.color || COLOR2
  };

  static layerName = 'LineMapLayer';

  renderLayers() {
    const { layerOpacity, linemapData, strokeWidth, getColor } = this.props;

    if (!linemapData) {
      return null;
    }

    const getSourcePosition = (x: LineData) => x.sourcePosition;
    const getTargetPosition = (x: LineData) => x.targetPosition;

    return [
      new LineLayer({
        id: 'line-map-layer',
        data: linemapData,
        projectionMode: COORDINATE_SYSTEM.IDENTITY,
        getSourcePosition,
        getTargetPosition,
        getColor,
        opacity: layerOpacity,
        pickable: true,
        strokeWidth
      }),
    ];
  }
}
