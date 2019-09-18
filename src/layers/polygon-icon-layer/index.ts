import { LayerProps, CompositeLayer, PolygonLayer } from 'deck.gl';
import { COLOR1 } from '../../constants/settings';
import { LightSettings } from '../../types';

interface Props extends LayerProps {
  filled?: boolean,
  stroked?: boolean,
  extruded?: boolean,
  wireframe?: boolean,
  elevationScale?: number,
  lineWidthScale?: boolean,
  lineWidthMinPixels?: number,
  lineWidthMaxPixels?: number,
  lineJointRounded?: boolean,
  lineMiterLimit?: number,
  lineDashJustified?: boolean,
  lightSettings: LightSettings,
  getPolygon?: (x: any) => number[],
  getFillColor?: (x: any) => number[] | number[],
  getLineColor?: (x: any) => number[] | number[],
  getLineWidth?: (x: any) => number | number,
  getElevation?: (x: any) => number | number,
  cellSize?: number,
  getPosition?: (x: any) => number[],
  getColor?: (x: any) => number[] | number[],
  getVertexAngle?: (x: any) => number, //オブジェクトの正面から角への角度
}
const rightAngleRange = (v:number) => v < 0 ? 0 : v >= 90 ? 89 : v;

export default class PolygonIconLayer extends CompositeLayer<Props> {

  constructor(props: Props) {
    super(props);
  }

  static defaultProps = {
    visible: true,
    opacity: 1.0,
    pickable: false,
    filled: true,
    stroked: false,
    extruded: true,
    wireframe: true,
    elevationScale: 1,
    lineWidthScale: 1,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
    lineJointRounded: false,
    lineMiterLimit: 4,
    lineDashJustified: false,
    lightSettings: {},
    getLineWidth: 1,
    getElevation: 20,
    cellSize: 50,
    getPosition: (x: any) => x.position,
    getColor: COLOR1,
    getVertexAngle: () => 25,
  };

  static layerName = 'PolygonIconLayer';

  renderLayers() {
    const { data, visible, opacity, pickable,
      filled, stroked, extruded, wireframe, elevationScale,
      lineWidthScale, lineWidthMinPixels, lineWidthMaxPixels,
      lineJointRounded, lineMiterLimit, lineDashJustified, lightSettings,
      getPolygon: propGetPolygon, getFillColor, getLineColor, getLineWidth,
      getElevation, cellSize, getPosition, getColor, getVertexAngle } = this.props;

    if (!data || data.length === 0) {
      return null;
    }

    const { distanceScales: { degreesPerPixel, pixelsPerMeter } } = this.context.viewport;
    const degreesMeter = [Math.abs(degreesPerPixel[0]) * Math.abs(pixelsPerMeter[0]),
      Math.abs(degreesPerPixel[1]) * Math.abs(pixelsPerMeter[1])];
    const radius = degreesMeter[0] * (cellSize / 2);
    const radMulti = Math.PI / 180;

    const polygonData = propGetPolygon ? data : data.map((item)=>{
      const position = getPosition(item);
      const vertexAngle = rightAngleRange(getVertexAngle(item));
      const direction = item.direction >= 0 ? item.direction : (item.direction + 360);
      const radian = [(direction + vertexAngle) * radMulti,
        (direction + (180 - vertexAngle)) * radMulti];
      const shift1 = [
        radius * Math.sin(radian[0]), radius * Math.cos(radian[0])
      ];
      const shift2 = [
        radius * Math.sin(radian[1]), radius * Math.cos(radian[1])
      ];
      const frontRight = [
        position[0] + shift1[0], position[1] + shift1[1], position[2]
      ];
      const frontLeft = [
        position[0] - shift2[0], position[1] - shift2[1], position[2]
      ];
      const rearLeft = [
        position[0] - shift1[0], position[1] - shift1[1], position[2]
      ];
      const rearRight = [
        position[0] + shift2[0], position[1] + shift2[1], position[2]
      ];
      return Object.assign({},item,
        {polygon: [frontRight, frontLeft, rearLeft, rearRight, frontRight]});
    });

    const getPolygon = (x: any) => x.polygon;

    return [
      new PolygonLayer({
        id: 'polygon-layer',
        data: polygonData,
        visible,
        opacity,
        pickable,
        filled,
        stroked,
        extruded,
        wireframe,
        elevationScale,
        lineWidthScale,
        lineWidthMinPixels,
        lineWidthMaxPixels,
        lineJointRounded,
        lineMiterLimit,
        lineDashJustified,
        lightSettings,
        getPolygon: propGetPolygon || getPolygon,
        getFillColor: getFillColor || getColor,
        getLineColor: getLineColor || getColor,
        getLineWidth,
        getElevation,
      }),
    ];
  }
}
