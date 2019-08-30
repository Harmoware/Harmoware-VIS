import { LayerProps, CompositeLayer, PolygonLayer } from 'deck.gl';
import { COLOR1 } from '../../constants/settings';
import { LightSettings } from '../../types';

interface Props extends LayerProps {
  filled?: boolean,
  stroked?: boolean,
  extruded?: boolean,
  wireframe?: boolean,
  elevationScale?: number,
  lineWidthMinPixels?: number,
  cellSize?: number,
  getPosition?: (x: any) => number[],
  getElevation?: (x: any) => number | number,
  getColor?: (x: any) => number[] | number[],
  getLineWidth?: (x: any) => number | number,
  getVertexAngle?: (x: any) => number,
  lightSettings: LightSettings,
}
const rightAngleRange = (v:number) => v < 0 ? 0 : v >= 90 ? 89 : v;

export default class PolygonIconLayer extends CompositeLayer<Props> {

  constructor(props: Props) {
    super(props);
  }

  static defaultProps = {
    filled: true,
    stroked: false,
    pickable: false,
    extruded: true,
    wireframe: true,
    lineWidthMinPixels: 1,
    cellSize: 50,
    getPosition: (x: any) => x.position,
    getElevation: 20,
    getColor: COLOR1,
    getLineWidth: 1,
    getVertexAngle: () => 25,
    lightSettings: {}
  };

  static layerName = 'PolygonIconLayer';

  renderLayers() {
    const { id, data, pickable, stroked, extruded, filled, wireframe, opacity, lineWidthMinPixels, cellSize,
      getPosition, getElevation, getColor, getLineWidth, getVertexAngle,
      lightSettings } = this.props;

    if (!data || data.length === 0) {
      return null;
    }

    const { distanceScales: { degreesPerPixel, pixelsPerMeter } } = this.context.viewport;
    const degreesMeter = [degreesPerPixel[0] * pixelsPerMeter[0], degreesPerPixel[1] * pixelsPerMeter[1]];
    const radius = degreesMeter[0] * (cellSize / 2);
    const radMulti = Math.PI / 180;

    const polygonData = data.map((item)=>{
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
        id,
        data: polygonData,
        pickable,
        stroked,
        extruded,
        filled,
        wireframe,
        opacity,
        lineWidthMinPixels,
        getPolygon,
        getElevation,
        getFillColor: getColor,
        getLineColor: getColor,
        getLineWidth,
        lightSettings,
      }),
    ];
  }
}
