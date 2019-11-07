import { LayerProps, CompositeLayer, ScatterplotLayer, SimpleMeshLayer } from 'deck.gl';
import { IcoSphereGeometry } from 'luma.gl'
import CubeGraphLayer from '../cubegraph-layer';
import { COLOR4 } from '../../constants/settings';
import { DepotsData, Position, Radius, DataOption } from '../../types';

interface Props extends LayerProps {
  iconChange?: boolean,
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
  mesh?: any,
  meshSizeScale?: number,
  getOrientation?: (x: DataOption) => number[],
  getScale?: (x: DataOption) => number[],
  getTranslation?: (x: DataOption) => number[],
}

const defaultmesh = new IcoSphereGeometry();

export default class DepotsLayer extends CompositeLayer<Props> {
  constructor(props: Props) {
    super(props);
  };

  static layerName = 'DepotsLayer';
  static defaultProps = {
    iconChange: true,
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
    mesh: defaultmesh,
    meshSizeScale: 40,
    getOrientation: [0,0,0],
    getScale: [1,1,1],
    getTranslation: [0,0,0],
  };

  renderLayers() {
    const { iconChange, layerRadiusScale, layerOpacity, depotsData, getColor,
      getRadius, optionElevationScale, optionVisible, optionChange, pickable,
      optionOpacity, optionCellSize, getCubeColor, getCubeElevation,
      mesh, meshSizeScale, getOrientation, getScale, getTranslation
    } = this.props;

    if (!depotsData) {
      return null;
    }

    const stacking2 = optionVisible && optionChange;

    const getPosition = (x: Position) => x.position;

    return [
      !iconChange ? new ScatterplotLayer({
        id: 'depots1',
        data: depotsData,
        radiusScale: layerRadiusScale,
        getPosition,
        getFillColor:getColor,
        getRadius,
        opacity: layerOpacity,
        pickable,
        radiusMinPixels: 1
      }) : 
      new SimpleMeshLayer({
        id: 'depots2',
        data: depotsData,
        mesh,
        sizeScale: meshSizeScale,
        getPosition,
        getColor,
        getOrientation,
        getScale,
        getTranslation,
        opacity: layerOpacity,
        pickable,
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
