// @flow

import { CompositeLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import type { LightSettings, Position, Context } from '../../types';

type Props = {
  id: string,
  getOptColor: Function,
  getOptElevation: Function,
  shiftByMeter: Array<number>,
  optionVisible: boolean,
  optionCellSize: number,
  optionOpacity: number,
  optionElevationScale: number,
  lightSettings: LightSettings,
  optionData: Array<any>
}

export default class CubeGraphLayer extends CompositeLayer<Props> {

  props: Props;
  context: Context;

  static defaultProps = {
    id: 'CubeiconLayer',
    getOptColor: (x : {optColor: string, color: string}) =>
    x.optColor || [x.color] || [[255, 255, 255]],
    getOptElevation: (x : {optElevation: number}) => x.optElevation || [0],
    shiftByMeter: [0, 0, 0]
  };

  static layerName = 'CubeGraphLayer';

  renderLayers() {
    const { optionData, optionVisible, optionCellSize, optionOpacity, optionElevationScale,
      lightSettings, getOptElevation, getOptColor, shiftByMeter, id } = this.props;

    if (!optionVisible) {
      return null;
    }
    if (!lightSettings) {
      alert('CubeGraphLayer: props 指定エラー');
      return null;
    }
    if (!optionData || optionData.length === 0) {
      return null;
    }

    const { distanceScales } = this.context.viewport;
    const { degreesPerPixel, pixelsPerMeter } = distanceScales;
    const shiftLng = degreesPerPixel[0] * pixelsPerMeter[0] * shiftByMeter[0];
    const shiftLat = degreesPerPixel[1] * pixelsPerMeter[1] * shiftByMeter[1];

    const getPosition = (x: Position) => x.position;

    const getOptPosition = (x: Position) => {
      const pos: Array<number> = getPosition(x);
      return [pos[0] + shiftLng, pos[1] + shiftLat, pos[2]];
    };

    const setProps = {};
    setProps.id = id;
    setProps.data = optionData;
    setProps.visible = optionVisible;
    if (optionCellSize) {
      setProps.cellSize = optionCellSize;
    }
    if (optionOpacity) {
      setProps.opacity = optionOpacity;
    }
    if (optionElevationScale) {
      setProps.elevationScale = optionElevationScale;
    }
    setProps.getPosition = getOptPosition;
    setProps.getElevation = getOptElevation;
    setProps.getColor = getOptColor;
    setProps.lightSettings = lightSettings;

    return [
      new CubeiconLayer(setProps)
    ];
  }
}
