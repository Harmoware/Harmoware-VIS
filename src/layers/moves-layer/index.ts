import { LayerProps, CompositeLayer, ScatterplotLayer, SimpleMeshLayer, ScenegraphLayer, LineLayer, ArcLayer } from 'deck.gl';
import { CubeGeometry } from 'luma.gl'
import CubeGraphLayer from '../cubegraph-layer';
import { onHoverClick, pickParams, checkClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
import { RoutePaths, MovedData, Movesbase, ClickedObject,
  Position, Radius, DataOption } from '../../types';
import * as Actions from '../../actions';
import {registerLoaders} from '@loaders.gl/core';
import {GLTFScenegraphLoader} from '@luma.gl/addons';

registerLoaders([GLTFScenegraphLoader]);

// prettier-ignore
const CUBE_POSITIONS = new Float32Array([
  -1,-1,2,1,-1,2,1,1,2,-1,1,2,
  -1,-1,-2,-1,1,-2,1,1,-2,1,-1,-2,
  -1,1,-2,-1,1,2,1,1,2,1,1,-2,
  -1,-1,-2,1,-1,-2,1,-1,2,-1,-1,2,
  1,-1,-2,1,1,-2,1,1,2,1,-1,2,
  -1,-1,-2,-1,-1,2,-1,1,2,-1,1,-2
  ]);

const ATTRIBUTES = {
  POSITION: {size: 3, value: new Float32Array(CUBE_POSITIONS)},
};

const defaultmesh = new CubeGeometry({attributes: ATTRIBUTES});

const defaultScenegraph = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/scenegraph-layer/airplane.glb';

interface Props extends LayerProps {
  routePaths: RoutePaths[],
  layerRadiusScale?: number,
  layerOpacity?: number,
  movedData: MovedData[],
  movesbase: Movesbase[],
  clickedObject: null | ClickedObject[],
  actions: typeof Actions,
  optionVisible?: boolean,
  optionChange?: boolean,
  optionOpacity?: number,
  optionCellSize?: number,
  optionElevationScale?: number,
  optionCentering?: boolean,
  optionDisplayPosition?: number,
  iconChange?: boolean,
  iconCubeType?: number,
  getColor?: (x: DataOption) => number[],
  getRouteColor?: (x: DataOption) => number[],
  getRouteWidth?: (x: any) => number,
  getRadius?: (x: Radius) => number,
  getCubeColor?: (x: DataOption) => number[][],
  getCubeElevation?: (x: DataOption) => number[],
  getArchWidth?: (x: any) => number,
  scenegraph?: any,
  mesh?: any,
  sizeScale?: number,
  getOrientation?: (x: DataOption) => number[],
  getScale?: (x: DataOption) => number[],
  getTranslation?: (x: DataOption) => number[],
}

export default class MovesLayer extends CompositeLayer<Props> {
  constructor(props: Props) {
    super(props);
  };

  static defaultProps = {
    id: 'MovesLayer',
    layerRadiusScale: 1,
    layerOpacity: 0.75,
    optionVisible: true,
    optionChange: false,
    optionOpacity: 0.25,
    optionCellSize: 12,
    optionElevationScale: 1,
    optionCentering: false,
    optionDisplayPosition: 30,
    visible: true,
    iconChange: true,
    iconCubeType: 0,
    getColor: (x: DataOption) => x.color || COLOR1,
    getRouteColor: (x: DataOption) => x.routeColor || x.color || COLOR1,
    getRouteWidth: (x: any) => x.routeWidth || 10,
    getRadius: (x: Radius) => x.radius || 20,
    getCubeColor: (x: DataOption) => x.optColor || [x.color] || [COLOR1],
    getCubeElevation: (x: DataOption) => x.optElevation || [0],
    getArchWidth: (x: any) => x.archWidth || 10,
    scenegraph: defaultScenegraph,
    mesh: defaultmesh,
    sizeScale: 20,
    getOrientation: (x: any) => x.direction ? [0,(x.direction * -1),90] : [0,0,90],
    getScale: [1,1,1],
    getTranslation: [0,0,0],
    };

  static layerName = 'MovesLayer';

  getPickingInfo(pickParams: pickParams) {
    const { getRouteColor, getRouteWidth } = this.props;
    onHoverClick(pickParams, getRouteColor, getRouteWidth);
  }

  renderLayers() {
    const { id, routePaths, layerRadiusScale, layerOpacity, movedData,
      clickedObject, actions, optionElevationScale, optionOpacity, optionCellSize,
      optionDisplayPosition, optionVisible, optionChange, getColor, getRadius,
      iconChange, iconCubeType, visible, getCubeColor, getCubeElevation, getArchWidth,
      scenegraph, mesh, sizeScale, getOrientation, getScale, getTranslation, optionCentering
    } = this.props;

    if (typeof clickedObject === 'undefined' ||
      !movedData || movedData.length === 0) {
      return null;
    }

    const getPosition = (x: Position) => x.position;
    const optionMovedData: any[] = movedData;
    const stacking1 = visible && optionVisible && optionChange;
    const optPlacement = visible && iconChange ? ()=>optionDisplayPosition : ()=>0;

    checkClickedObjectToBeRemoved(movedData, clickedObject, routePaths, actions);

    return [
      visible && !iconChange ? new ScatterplotLayer({
        id: id + '-moves1',
        data: movedData,
        radiusScale: layerRadiusScale,
        getPosition,
        getFillColor:getColor,
        getRadius,
        visible,
        opacity: layerOpacity,
        pickable: true,
        radiusMinPixels: 1
      }) : null,
      visible && iconChange && iconCubeType === 0 ? new SimpleMeshLayer({
        id: id + '-moves2',
        data: movedData,
        mesh,
        sizeScale,
        getPosition,
        getColor,
        getOrientation,
        getScale,
        getTranslation,
        visible,
        opacity: layerOpacity,
        pickable: true,
      }) : null,
      visible && iconChange && iconCubeType === 1 ? new ScenegraphLayer({
        id: id + '-moves3',
        data: movedData,
        scenegraph,
        sizeScale,
        getPosition,
        getColor,
        getOrientation,
        getScale,
        getTranslation,
        visible,
        opacity: layerOpacity,
        pickable: true,
      }) : null,
      visible ? new LineLayer({
        id: id + '-route-paths',
        data: routePaths,
        widthUnits: 'meters',
        getWidth: (x: any) => x.routeWidth,
        widthMinPixels: 0.1,
        getColor: (x: DataOption) => x.routeColor,
        visible,
        pickable: false
      }) : null,
      optionVisible ?
      new CubeGraphLayer({
        id: id + '-moves-opt-cube',
        data: optionMovedData.concat([{}]),
        visible: optionVisible,
        optionCentering,
        stacking1,
        getPosition,
        getColor: getCubeColor,
        getElevation: getCubeElevation,
        getRadius: optPlacement,
        opacity: optionOpacity,
        pickable: false,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
      }) : null,
      optionVisible ?
      new ArcLayer({
        id: id + '-moves-opt-arc',
        data: movedData as any[],
        visible: optionVisible,
        pickable: true,
        widthUnits: 'meters',
        widthMinPixels: 0.1,
        getSourcePosition: (x: MovedData) => x.sourcePosition || getPosition(x),
        getTargetPosition: (x: MovedData) => x.targetPosition || getPosition(x),
        getSourceColor: (x: MovedData) => x.sourceColor || x.color || COLOR1,
        getTargetColor: (x: MovedData) => x.targetColor || x.color || COLOR1,
        getWidth: getArchWidth,
        opacity: layerOpacity
      }) : null,
    ];
  }
}
