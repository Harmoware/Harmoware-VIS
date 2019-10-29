import { LayerProps, CompositeLayer, ScatterplotLayer } from 'deck.gl';
import CubeGraphLayer from '../cubegraph-layer';
import { COLOR4 } from '../../constants/settings';
import { DepotsData, Position, Radius, DataOption } from '../../types';

interface Props extends LayerProps {
  layerRadiusScale?: number,
  layerOpacity?: number,
  depotsData: DepotsData[],
  optionVisible?: boolean,
  optionChange?: boolean,
  optionOpacity?: number,
  optionCellSize?: number,
  optionElevationScale?: number,
  getColor?: (x: any) => number[],
  getRadius?: (x: any) => number,
  getCubeColor?: (x: DataOption) => number[][],
  getCubeElevation?: (x: DataOption) => number[],
}

export default class DepotsLayer extends CompositeLayer<Props> {
  constructor(props: Props) {
    super(props);
  };

  static layerName = 'DepotsLayer';
  static defaultProps = {
    layerRadiusScale: 1,
    layerOpacity: 0.5,
    optionVisible: true,
    optionChange: false,
    optionOpacity: 0.25,
    optionCellSize: 20,
    optionElevationScale: 1,
    pickable: true,
    getColor: (x: DataOption) => x.color || COLOR4,
    getRadius: (x: Radius) => x.radius || 30,
    getCubeColor: (x: DataOption) => x.optColor || [x.color] || [COLOR4],
    getCubeElevation: (x: DataOption) => x.optElevation || [0],
  };

  renderLayers() {
    const { layerRadiusScale, layerOpacity, depotsData, getColor,
      getRadius, optionElevationScale, optionVisible, optionChange, pickable,
      optionOpacity, optionCellSize, getCubeColor, getCubeElevation
    } = this.props;

    if (!depotsData) {
      return null;
    }

    const stacking2 = optionVisible && optionChange;

    const getPosition = (x: Position) => x.position;

    return [
      new ScatterplotLayer({
        id: 'depots',
        data: depotsData,
        radiusScale: layerRadiusScale,
        getPosition,
        getFillColor:getColor,
        getRadius,
        opacity: layerOpacity,
        pickable,
        radiusMinPixels: 1
      }),
      optionVisible ?
      new CubeGraphLayer({
        id: 'depots-opt-cube',
        data: depotsData,
        visible: optionVisible,
        stacking2,
        getPosition,
        getRadius,
        getColor: getCubeColor,
        getElevation: getCubeElevation,
        opacity: optionOpacity,
        pickable,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
      }) : null,
    ];
  }
}
