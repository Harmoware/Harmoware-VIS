// @flow

import { GridCellLayer, CompositeLayer } from 'deck.gl';
import type { LightSettings } from 'harmoware-vis';

type Props = {
  rainfall: Array<any>,
  layerOpacity: number,
  layerCellSize: number,
  layerElevationScale: number,
  lightSettings: LightSettings,
  getElevation: (x: any) => number,
  getColor: (x: any) => Array<number>,
  getRainfallColor: (x: number) => Array<number>,
  defaultColor: Array<number>
}

export default class XbandmeshLayer extends CompositeLayer<Props> {

  props: Props;

  static defaultProps = {
    layerOpacity: 0.2,
    layerCellSize: 100,
    layerElevationScale: 20,
    getElevation: (x: any) => x.elevation || 0,
    getColor: (x: any) => x.color,
    getRainfallColor: (x: number) => {
      if (x < 3) { // 0:白 => 3:水色
        return [255.0 - ((x / 3.0) * 255.0), 255.0, 255.0];
      } else
      if (x < 12) { // 3:水色 => 12:青
        return [0.0, 255.0 - (((x - 3.0) / 9.0) * 255.0), 255.0];
      } else
      if (x < 25) { // 12:青 => 25:黄
        return [(((x - 12.0) / 13.0) * 255.0), (((x - 12.0) / 13.0) * 255.0),
          255.0 - (((x - 12.0) / 13.0) * 255.0)];
      } else
      if (x < 40) { // 25:黄 => 40:赤
        return [255.0, 255.0 - (((x - 25.0) / 15.0) * 255.0), 0.0];
      } else
      if (x < 80) { // 40:赤 => 80:紫
        return [255.0 - (((x - 40.0) / 40.0) * 127.0), 0.0, (((x - 40.0) / 40.0) * 255.0)];
      }
      return [127.0, 0.0, 255.0]; // 80～:紫
    },
    defaultColor: [0, 255, 255]
  };

  static layerName = 'XbandmeshLayer';

  renderLayers() {
    const { rainfall, layerOpacity, layerCellSize, layerElevationScale,
      lightSettings, getElevation, getColor, getRainfallColor, defaultColor } = this.props;

    if (!lightSettings) {
      alert('XbandmeshLayer: props 指定エラー');
      return null;
    }
    if (!rainfall || rainfall.length === 0) {
      return null;
    }

    const getCellColor =
      x => getColor(x) || getRainfallColor(getElevation(x)) || defaultColor;

    return [
      new GridCellLayer({
        id: 'xband-mesh-layer',
        data: rainfall,
        getElevation,
        getColor: getCellColor,
        opacity: layerOpacity,
        cellSize: layerCellSize,
        elevationScale: layerElevationScale,
        lightSettings,
        pickable: true
      })
    ];
  }
}
