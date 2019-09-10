import { LayerProps, CompositeLayer, ScatterplotLayer, LineLayer, ArcLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import CubeGraphLayer from '../cubegraph-layer';
import PolygonIconLayer from '../polygon-icon-layer';
import { onHoverClick, pickParams, checkClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
import { RoutePaths, MovedData, Movesbase, ClickedObject, LightSettings,
  Position, Radius, DataOption, Viewport } from '../../types';
import * as Actions from '../../actions';

interface Props extends LayerProps {
  viewport: Viewport,
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
  lightSettings: LightSettings,
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
    getStrokeWidth: (x: any) => x.strokeWidth || 1,
  };

  static layerName = 'MovesLayer';

  getPickingInfo(pickParams: pickParams) {
    onHoverClick(pickParams);
  }

  renderLayers() {
    const { routePaths, layerRadiusScale, layerOpacity, movedData,
      clickedObject, actions, optionElevationScale, optionOpacity, optionCellSize,
      optionVisible, optionChange, lightSettings, getColor, getRadius,
      iconChange, iconCubeType, iconCubeSize, visible,
      getCubeColor, getCubeElevation, getStrokeWidth
    } = this.props;

    if (typeof clickedObject === 'undefined' || (optionVisible && !lightSettings)) {
      return null;
    }

    const { distanceScales } = this.context.viewport;
    const { degreesPerPixel, pixelsPerMeter } = distanceScales;
    const degreesMeterLng = Math.abs(degreesPerPixel[0]) * Math.abs(pixelsPerMeter[0]);
    const degreesMeterLat = Math.abs(degreesPerPixel[1]) * Math.abs(pixelsPerMeter[1]);
    const optionShiftLng = (degreesMeterLng * optionCellSize) / 2;
    const optionShiftLat = (degreesMeterLat * optionCellSize) / 2;

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
        lightSettings
      }) : null,
      visible && iconChange && iconCubeType === 1 ? new CubeiconLayer({
        id: 'moves3',
        data: movedData,
        getPosition,
        getColor,
        getHeight: (x: any) => x.height || 40,
        opacity: layerOpacity,
        pickable: true,
        cellSize: iconCubeSize,
        lightSettings
      }) : null,
      visible ? new LineLayer({
        id: 'route-paths',
        data: routePaths,
        getStrokeWidth: Math.max(pixelsPerMeter[0] * 10, 1),
        getColor,
        visible,
        fp64: false,
        pickable: false
      }) : null,
      visible && optionVisible ?
      new CubeGraphLayer({
        id: 'moves-opt-cube',
        data: optionMovedData.concat([{}]),
        visible: visible && optionVisible,
        stacking1,
        optionShiftLng,
        optionShiftLat,
        degreesMeterLng,
        degreesMeterLat,
        getPosition,
        getColor: getCubeColor,
        getElevation: getCubeElevation,
        getRadius: optPlacement,
        opacity: optionOpacity,
        pickable: false,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings
      }) : null,
      visible && optionVisible ?
      new ArcLayer({
        id: 'moves-opt-arc',
        data: movedData as any[],
        visible: visible && optionVisible,
        pickable: true,
        getSourcePosition: (x: MovedData) => x.sourcePosition || getPosition(x),
        getTargetPosition: (x: MovedData) => x.targetPosition || getPosition(x),
        getSourceColor: (x: MovedData) => x.sourceColor || x.color || COLOR1,
        getTargetColor: (x: MovedData) => x.targetColor || x.color || COLOR1,
        getStrokeWidth: (x: any) => Math.max(getStrokeWidth(x) * pixelsPerMeter[0], 1),
        opacity: layerOpacity
      }) : null,
    ];
  }
}
