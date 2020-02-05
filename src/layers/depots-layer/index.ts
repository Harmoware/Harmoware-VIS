import { LayerProps, CompositeLayer, ScatterplotLayer, SimpleMeshLayer } from 'deck.gl';
import { IcoSphereGeometry } from 'luma.gl'
import CubeGraphLayer from '../cubegraph-layer';
import { COLOR4 } from '../../constants/settings';
import { DepotsData } from '../../types';

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
  optionCentering?: boolean,
  getColor?: (x: DepotsData) => number[],
  getRadius?: (x: DepotsData) => number,
  getCubeColor?: (x: DepotsData) => number[][],
  getCubeElevation?: (x: DepotsData) => number[],
  mesh?: any,
  meshSizeScale?: number,
  getOrientation?: (x: DepotsData) => number[],
  getScale?: (x: DepotsData) => number[],
  getTranslation?: (x: DepotsData) => number[],
}

const defaultmesh = new IcoSphereGeometry();

export default class DepotsLayer extends CompositeLayer<Props> {
  constructor(props: Props) {
    super(props);
  };

  static layerName = 'DepotsLayer';
  static defaultProps = {
    id: 'DepotsLayer',
    iconChange: true,
    layerRadiusScale: 1,
    layerOpacity: 0.5,
    optionVisible: true,
    optionChange: false,
    optionOpacity: 0.25,
    optionCellSize: 20,
    optionElevationScale: 1,
    optionCentering: false,
    pickable: true,
    getColor: (x: DepotsData) => x.color || COLOR4,
    getRadius: (x: DepotsData) => x.radius || 30,
    getCubeColor: (x: DepotsData) => x.optColor || [x.color] || [COLOR4],
    getCubeElevation: (x: DepotsData) => x.optElevation || [0],
    mesh: defaultmesh,
    meshSizeScale: 40,
    getOrientation: [0,0,0],
    getScale: [1,1,1],
    getTranslation: [0,0,0],
  };

  renderLayers() {
    const { id, iconChange, layerRadiusScale, layerOpacity, depotsData, getColor,
      getRadius, optionElevationScale, optionVisible, optionChange, pickable,
      optionOpacity, optionCellSize, getCubeColor, getCubeElevation,
      mesh, meshSizeScale, getOrientation, getScale, getTranslation,
      optionCentering
    } = this.props;

    if (!depotsData) {
      return null;
    }

    const stacking2 = optionVisible && optionChange;

    const getPosition = (x: DepotsData) => x.position;

    return [
      !iconChange ? new ScatterplotLayer({
        id: id + '-depots1',
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
        id: id + '-depots2',
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
        id: id + '-depots-opt-cube',
        data: depotsData,
        visible: optionVisible,
        optionCentering,
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
