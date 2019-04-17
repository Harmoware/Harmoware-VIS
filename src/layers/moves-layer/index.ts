import { LayerProps, CompositeLayer, ScatterplotLayer, GridCellLayer, LineLayer, ArcLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import { onHoverClick, pickParams, checkClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
import { RoutePaths, MovedData, Movesbase, ClickedObject, LightSettings,
  Position, Radius, DataOption, EventInfo } from '../../types';
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
  lightSettings: LightSettings,
  getColor?: (x: DataOption) => number[],
  getRadius?: (x: Radius) => number,
  getColor1?: (x: DataOption) => number[],
  getColor2?: (x: DataOption) => number[],
  getColor3?: (x: DataOption) => number[],
  getColor4?: (x: DataOption) => number[],
  getElevation1?: (x: DataOption) => number,
  getElevation2?: (x: DataOption) => number,
  getElevation3?: (x: DataOption) => number,
  getElevation4?: (x: DataOption) => number,
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
    getRadius: (x: Radius) => x.radius || 20,
    getColor: (x: DataOption) => x.color || COLOR1,
    getColor1: (x: DataOption) => (x.optColor && x.optColor[0]) || x.color || COLOR1,
    getColor2: (x: DataOption) => (x.optColor && x.optColor[1]) || x.color || COLOR1,
    getColor3: (x: DataOption) => (x.optColor && x.optColor[2]) || x.color || COLOR1,
    getColor4: (x: DataOption) => (x.optColor && x.optColor[3]) || x.color || COLOR1,
    getElevation1: (x: DataOption) => (x.optElevation && x.optElevation[0]) || 0,
    getElevation2: (x: DataOption) => (x.optElevation && x.optElevation[1]) || 0,
    getElevation3: (x: DataOption) => (x.optElevation && x.optElevation[2]) || 0,
    getElevation4: (x: DataOption) => (x.optElevation && x.optElevation[3]) || 0,
    getCubeColor: (x: DataOption) => x.optColor || [x.color] || [COLOR1],
    getCubeElevation: (x: DataOption) => x.optElevation || [0],
    getStrokeWidth: (x: any) => x.strokeWidth || 1,
  };

  static layerName = 'MovesLayer';

  getPickingInfo(pickParams: pickParams) {
    onHoverClick(pickParams);
  }

  renderLayers() {
    const { routePaths, layerRadiusScale, layerOpacity, movedData, movesbase,
      clickedObject, actions, optionElevationScale, optionOpacity, optionCellSize,
      optionVisible, optionChange, lightSettings, getColor, getRadius,
      visible, getColor1, getColor2, getColor3, getColor4,
      getElevation1, getElevation2, getElevation3, getElevation4,
      getCubeColor, getCubeElevation, getStrokeWidth
    } = this.props;

    if (!routePaths || !movesbase || !actions ||
      typeof clickedObject === 'undefined' || (optionVisible && !lightSettings)) {
      return null;
    }
    if (!movedData) {
      return null;
    }

    const { distanceScales } = this.context.viewport;
    const { degreesPerPixel, pixelsPerMeter } = distanceScales;
    const degreesMeterLng = degreesPerPixel[0] * pixelsPerMeter[0];
    const degreesMeterLat = degreesPerPixel[1] * pixelsPerMeter[1];
    const optionMedianLng = (degreesMeterLng * optionCellSize) / 2;
    const optionMedianLat = (degreesMeterLat * optionCellSize) / 2;
    const optionShiftLng = (degreesMeterLng * optionCellSize) / 2;
    const optionShiftLat = (degreesMeterLat * optionCellSize) / 2;

    const getPosition = (x: Position) => x.position;

    const getOptPosition = (x: Position) => {
      const pos = getPosition(x);
      return [pos[0] - optionMedianLng, pos[1] - optionMedianLat, pos[2]];
    };

    const getPosition1 = (x: Position) => {
      const pos = getOptPosition(x);
      return [pos[0] + optionShiftLng, pos[1] + optionShiftLat, pos[2]];
    };
    const getPosition2 = (x: Position) => {
      const pos = getOptPosition(x);
      return [pos[0] + optionShiftLng, pos[1] - optionShiftLat, pos[2]];
    };
    const getPosition3 = (x: Position) => {
      const pos = getOptPosition(x);
      return [pos[0] - optionShiftLng, pos[1] + optionShiftLat, pos[2]];
    };
    const getPosition4 = (x: Position) => {
      const pos = getOptPosition(x);
      return [pos[0] - optionShiftLng, pos[1] - optionShiftLat, pos[2]];
    };

    checkClickedObjectToBeRemoved(movedData, clickedObject, routePaths, actions);

    return [
      new ScatterplotLayer({
        id: 'moves',
        data: movedData,
        radiusScale: layerRadiusScale,
        getPosition,
        getColor,
        getRadius,
        visible,
        opacity: layerOpacity,
        pickable: true,
        radiusMinPixels: 1
      }),
      new LineLayer({
        id: 'route-paths',
        data: routePaths,
        getStrokeWidth: Math.max(pixelsPerMeter[0] * 10, 1),
        getColor,
        visible,
        fp64: false,
        pickable: false
      }),
      new GridCellLayer({
        id: 'moves-opt1',
        data: movedData,
        visible: visible && optionVisible && !optionChange,
        getPosition: getPosition1,
        getColor: getColor1,
        getElevation: getElevation1,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings
      }),
      new GridCellLayer({
        id: 'moves-opt2',
        data: movedData,
        visible: visible && optionVisible && !optionChange,
        getPosition: getPosition2,
        getColor: getColor2,
        getElevation: getElevation2,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings
      }),
      new GridCellLayer({
        id: 'moves-opt3',
        data: movedData,
        visible: visible && optionVisible && !optionChange,
        getPosition: getPosition3,
        getColor: getColor3,
        getElevation: getElevation3,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings
      }),
      new GridCellLayer({
        id: 'moves-opt4',
        data: movedData,
        visible: visible && optionVisible && !optionChange,
        getPosition: getPosition4,
        getColor: getColor4,
        getElevation: getElevation4,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings
      }),
      new CubeiconLayer({
        id: 'moves-opt-cube',
        data: movedData as any[],
        visible: visible && optionVisible && optionChange,
        getPosition,
        getColor: getCubeColor,
        getElevation: getCubeElevation,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings
      }),
      new ArcLayer({
        id: 'moves-opt-arc',
        data: movedData as any[],
        visible: visible && optionVisible,
        pickable: true,
        getSourceColor: (x: MovedData) => x.sourceColor || x.color || COLOR1,
        getTargetColor: (x: MovedData) => x.targetColor || x.color || COLOR1,
        getStrokeWidth: (x: any) => Math.max(getStrokeWidth(x) * pixelsPerMeter[0], 1),
        opacity: layerOpacity
      }),
    ];
  }
}
