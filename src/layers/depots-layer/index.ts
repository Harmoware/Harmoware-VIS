

import { CompositeLayer, ScatterplotLayer, GridCellLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import { COLOR4 } from '../../constants/settings';
import { DepotsData, LightSettings, Position, Radius, DataOption, Context } from '../../types';

interface Props {
  layerRadiusScale: number,
  layerOpacity: number,
  depotsData: Array<DepotsData>,
  optionVisible: boolean,
  optionChange: boolean,
  optionOpacity: number,
  optionCellSize: number,
  optionElevationScale: number,
  lightSettings: LightSettings,
  getColor: (x: any) => Array<number>,
  getRadius: (x: any) => number,
  getColor1: (x: any) => Array<number>,
  getColor2: (x: any) => Array<number>,
  getColor3: (x: any) => Array<number>,
  getColor4: (x: any) => Array<number>,
  getElevation1: (x: any) => number,
  getElevation2: (x: any) => number,
  getElevation3: (x: any) => number,
  getElevation4: (x: any) => number,
  i18n: { error: string }
}

interface CompositeLayerType<P, C> {
  props: P;
  context: C;
  constructor(p: P);
}

export default class DepotsLayer extends CompositeLayer {

  static layerName = 'DepotsLayer';
  static defaultProps = {
    layerRadiusScale: 1,
    layerOpacity: 0.5,
    optionVisible: true,
    optionChange: false,
    optionOpacity: 0.25,
    optionCellSize: 20,
    optionElevationScale: 1,
    getColor: (x: DataOption) => x.color || COLOR4,
    getColor1: (x: DataOption) =>
      (x.optColor && x.optColor[0]) || x.color || COLOR4,
    getColor2: (x: DataOption) => (x.optColor && x.optColor[1]) || x.color || COLOR4,
    getColor3: (x: DataOption) => (x.optColor && x.optColor[2]) || x.color || COLOR4,
    getColor4: (x: DataOption) => (x.optColor && x.optColor[3]) || x.color || COLOR4,
    getElevation1: (x: DataOption) => (x.optElevation && x.optElevation[0]) || 0,
    getElevation2: (x: DataOption) => (x.optElevation && x.optElevation[1]) || 0,
    getElevation3: (x: DataOption) => (x.optElevation && x.optElevation[2]) || 0,
    getElevation4: (x: DataOption) => (x.optElevation && x.optElevation[3]) || 0,
    i18n: {
      error: 'DepotsLayer: props 指定エラー'
    }
  };

  renderLayers() {
    const { layerRadiusScale, layerOpacity, depotsData, getColor,
      getRadius: propGetRadius, optionElevationScale, optionVisible, optionChange,
      optionOpacity, optionCellSize, lightSettings,
      getColor1, getColor2, getColor3, getColor4,
      getElevation1, getElevation2, getElevation3, getElevation4, i18n
    } = this.props;

    if (optionVisible && !lightSettings) {
      alert(i18n.error);
      return null;
    }
    if (!depotsData) {
      return null;
    }

    const { distanceScales } = this.context.viewport;
    const { degreesPerPixel, pixelsPerMeter } = distanceScales;
    const degreesMeterLng = degreesPerPixel[0] * pixelsPerMeter[0];
    const degreesMeterLat = degreesPerPixel[1] * pixelsPerMeter[1];
    const optionMedianLng = (degreesMeterLng * optionCellSize) / 2;
    const optionMedianLat = (degreesMeterLat * optionCellSize) / 2;
    const optionShiftLng = rad => degreesMeterLng * ((rad + (optionCellSize / 2)) + 2);
    const optionShiftLat = degreesMeterLat * ((optionCellSize / 2) + 2);

    const getPosition = (x: Position) => x.position;

    const getOptPosition = (x: Position) => {
      const pos: Array<number> = getPosition(x);
      return [pos[0] - optionMedianLng, pos[1] - optionMedianLat, pos[2]];
    };

    const getRadius = propGetRadius || ((x: Radius) => (x.radius || 30));
    const getPosition1 = (x: Position & Radius) => {
      const pos = getOptPosition(x);
      const rad = getRadius(x);
      return [pos[0] + optionShiftLng(rad), pos[1] + optionShiftLat, pos[2]];
    };
    const getPosition2 = (x: Position & Radius) => {
      const pos = getOptPosition(x);
      const rad = getRadius(x);
      return [pos[0] + optionShiftLng(rad), pos[1] - optionShiftLat, pos[2]];
    };
    const getPosition3 = (x: Position & Radius) => {
      const pos = getOptPosition(x);
      const rad = getRadius(x);
      return [pos[0] - optionShiftLng(rad), pos[1] + optionShiftLat, pos[2]];
    };
    const getPosition4 = (x: Position & Radius) => {
      const pos = getOptPosition(x);
      const rad = getRadius(x);
      return [pos[0] - optionShiftLng(rad), pos[1] - optionShiftLat, pos[2]];
    };

    const getCubePosition1 = (x: Position & Radius) => {
      const pos = getPosition(x);
      const rad = getRadius(x);
      return [pos[0] + optionShiftLng(rad), pos[1], pos[2]];
    };

    const getCubePosition2 = (x: Position & Radius) => {
      const pos = getPosition(x);
      const rad = getRadius(x);
      return [pos[0] - optionShiftLng(rad), pos[1], pos[2]];
    };

    const getCubeColor1 = (x: DataOption) => [
      (x.optColor && x.optColor[0]) || x.color || COLOR4,
      (x.optColor && x.optColor[1]) || x.color || COLOR4
    ];
    const getCubeColor2 = (x: DataOption) => [
      (x.optColor && x.optColor[2]) || x.color || COLOR4,
      (x.optColor && x.optColor[3]) || x.color || COLOR4
    ];
    const getCubeElevation1 = (x: DataOption) => [
      (x.optElevation && x.optElevation[0]) || 0,
      (x.optElevation && x.optElevation[1]) || 0
    ];
    const getCubeElevation2 = (x: DataOption) => [
      (x.optElevation && x.optElevation[2]) || 0,
      (x.optElevation && x.optElevation[3]) || 0
    ];

    return [
      new ScatterplotLayer({
        id: 'depots',
        data: depotsData,
        radiusScale: layerRadiusScale,
        getPosition,
        getColor,
        getRadius,
        opacity: layerOpacity,
        pickable: true,
        radiusMinPixels: 1
      }),
      new GridCellLayer({
        id: 'depots-opt1',
        data: depotsData,
        visible: optionVisible && !optionChange,
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
        id: 'depots-opt2',
        data: depotsData,
        visible: optionVisible && !optionChange,
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
        id: 'depots-opt3',
        data: depotsData,
        visible: optionVisible && !optionChange,
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
        id: 'depots-opt4',
        data: depotsData,
        visible: optionVisible && !optionChange,
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
        id: 'depots-opt-cube1',
        data: depotsData,
        visible: optionVisible && optionChange,
        getPosition: getCubePosition1,
        getColor: getCubeColor1,
        getElevation: getCubeElevation1,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings
      }),
      new CubeiconLayer({
        id: 'depots-opt-cube2',
        data: depotsData,
        visible: optionVisible && optionChange,
        getPosition: getCubePosition2,
        getColor: getCubeColor2,
        getElevation: getCubeElevation2,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings
      }),
    ];
  }
}
