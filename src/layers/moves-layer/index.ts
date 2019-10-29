import { LayerProps, CompositeLayer, ScatterplotLayer, LineLayer, ArcLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import CubeGraphLayer from '../cubegraph-layer';
import PolygonIconLayer from '../polygon-icon-layer';
import { onHoverClick, pickParams, checkClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
import { RoutePaths, MovedData, Movesbase, ClickedObject,
  Position, Radius, DataOption } from '../../types';
import * as Actions from '../../actions';

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
  iconChange?: boolean,
  iconCubeType?: number,
  iconCubeSize?: number,
  getColor?: (x: DataOption) => number[],
  getRadius?: (x: Radius) => number,
  getCubeColor?: (x: DataOption) => number[][],
  getCubeElevation?: (x: DataOption) => number[],
  getStrokeWidth?: any
}

export default class MovesLayer extends CompositeLayer<Props> {
  constructor(props: Props) {
    super(props);
  };

  static defaultProps = {
    layerRadiusScale: 1,
    layerOpacity: 0.75,
    optionVisible: true,
    optionChange: false,
    optionOpacity: 0.25,
    optionCellSize: 12,
    optionElevationScale: 1,
    visible: true,
    iconChange: true,
    iconCubeType: 0,
    iconCubeSize: 50,
    getColor: (x: DataOption) => x.color || COLOR1,
    getRadius: (x: Radius) => x.radius || 20,
    getCubeColor: (x: DataOption) => x.optColor || [x.color] || [COLOR1],
    getCubeElevation: (x: DataOption) => x.optElevation || [0],
    getStrokeWidth: (x: any) => x.strokeWidth || 10,
  };

  static layerName = 'MovesLayer';

  getPickingInfo(pickParams: pickParams) {
    onHoverClick(pickParams);
  }

  renderLayers() {
    const { routePaths, layerRadiusScale, layerOpacity, movedData,
      clickedObject, actions, optionElevationScale, optionOpacity, optionCellSize,
      optionVisible, optionChange, getColor, getRadius,
      iconChange, iconCubeType, iconCubeSize, visible,
      getCubeColor, getCubeElevation, getStrokeWidth
    } = this.props;

    if (typeof clickedObject === 'undefined' ||
      !movedData || movedData.length === 0) {
      return null;
    }

    const getPosition = (x: Position) => x.position;
    const optionMovedData: any[] = movedData;
    const stacking1 = visible && optionVisible && optionChange;
    const optPlacement = visible && !iconChange ? ()=>0 :
      visible && iconChange && iconCubeType === 0 ? ()=>iconCubeSize/4 : ()=>iconCubeSize/2;

    checkClickedObjectToBeRemoved(movedData, clickedObject, routePaths, actions);

    return [
      visible && !iconChange ? new ScatterplotLayer({
        id: 'moves1',
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
      visible && iconChange && iconCubeType === 0 ? new PolygonIconLayer({
        id: 'moves2',
        data: movedData,
        getPosition,
        getColor,
        visible,
        opacity: layerOpacity,
        pickable: true,
        cellSize: iconCubeSize,
      }) : null,
      visible && iconChange && iconCubeType === 1 ? new CubeiconLayer({
        id: 'moves3',
        data: movedData,
        getPosition,
        getColor,
        visible,
        getHeight: (x: any) => x.height || iconCubeSize,
        opacity: layerOpacity,
        pickable: true,
        cellSize: iconCubeSize
      }) : null,
      visible ? new LineLayer({
        id: 'route-paths',
        data: routePaths,
        widthUnits: 'meters',
        getWidth: (x: any) => x.strokeWidth || 10,
        widthMinPixels: 0.1,
        getColor,
        visible,
        pickable: false
      }) : null,
      optionVisible ?
      new CubeGraphLayer({
        id: 'moves-opt-cube',
        data: optionMovedData.concat([{}]),
        visible: optionVisible,
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
        id: 'moves-opt-arc',
        data: movedData as any[],
        visible: optionVisible,
        pickable: true,
        widthUnits: 'meters',
        widthMinPixels: 0.1,
        getSourcePosition: (x: MovedData) => x.sourcePosition || getPosition(x),
        getTargetPosition: (x: MovedData) => x.targetPosition || getPosition(x),
        getSourceColor: (x: MovedData) => x.sourceColor || x.color || COLOR1,
        getTargetColor: (x: MovedData) => x.targetColor || x.color || COLOR1,
        getWidth: (x: any) => getStrokeWidth(x),
        opacity: layerOpacity
      }) : null,
    ];
  }
}
