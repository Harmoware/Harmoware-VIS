import { LayerProps, CompositeLayer, LineLayer, PathLayer, PolygonLayer } from 'deck.gl';
import { LineMapData } from '../../types';
import { COLOR2 } from '../../constants/settings';

interface Props extends LayerProps {
  getSourcePosition?: (x: LineMapData) => number[],
  getTargetPosition?: (x: LineMapData) => number[],
  getPath?: (x: LineMapData) => number[],
  getPolygon?: (x: LineMapData) => number[],
  getCoordinates?: (x: LineMapData) => number[],
  getElevation?: (x: LineMapData) => number[],
  getColor?: (x: LineMapData) => number[],
  getWidth?: (x: LineMapData) => number,
  getDashArray?: (x: LineMapData) => number[],
  widthUnits?: string,
  widthMinPixels?: number,
  polygonOpacity?: number,
  lineOpacity?: number,
}

export default class LineMapLayer extends CompositeLayer<Props> {

  static defaultProps = {
    id: 'LineMapLayer',
    pickable: true,
    getSourcePosition: (x: LineMapData) => x.sourcePosition,
    getTargetPosition: (x: LineMapData) => x.targetPosition,
    getPath: (x: LineMapData) => x.path,
    getPolygon: (x: LineMapData) => x.polygon,
    getCoordinates: (x: LineMapData) => x.coordinates,
    getElevation: (x: LineMapData) => x.elevation || 3,
    getWidth: (x: LineMapData) => x.strokeWidth || 1,
    getColor: (x: LineMapData) => x.color || COLOR2, // white
    getDashArray: (x: LineMapData) => x.dash || [0,0],
    widthUnits: 'meters',
    widthMinPixels: 0.1,
    polygonOpacity: 0.5,
    lineOpacity: 1.0,
};

  static layerName = 'LineMapLayer';

  renderLayers() {
    const { id, data, visible, pickable,
      getSourcePosition, getTargetPosition, getPath, getPolygon,
      getCoordinates, getElevation, getWidth, getColor, getDashArray,
      widthUnits, widthMinPixels, polygonOpacity, lineOpacity } = this.props;

    if (!data || data.length === 0 || !visible) {
      return null;
    }
    const coordinatesData = data.filter(x=>getCoordinates(x));
    const pathData = data.filter(x=>getPath(x));
    const sourcePositionData = data.filter(x=>getSourcePosition(x));
    const polygonData = data.filter(x=>getPolygon(x));

    return [
      coordinatesData.length > 0 ?
      new PolygonLayer({
        id: id + '-PolygonLayer-2D',
        data: coordinatesData,
        visible,
        opacity: polygonOpacity,
        pickable,
        extruded: false,
        wireframe: true,
        getPolygon: getCoordinates,
        getFillColor: getColor,
        getLineColor: null,
        getElevation }):null,
      pathData.length > 0 ?
      new PathLayer({
        id: id + '-PathLayer',
        data: pathData,
        visible,
        opacity: lineOpacity,
        pickable,
        widthUnits,
        widthMinPixels,
        rounded: true,
        getPath,
        getColor,
        getWidth,
        getDashArray }):null,
      sourcePositionData.length > 0 ?
      new LineLayer({
        id: id + '-LineLayer',
        data: sourcePositionData,
        visible,
        opacity: lineOpacity,
        pickable,
        getSourcePosition,
        getTargetPosition,
        getColor,
        getWidth,
        widthUnits,
        widthMinPixels }):null,
      polygonData.length > 0 ?
      new PolygonLayer({
        id: id + '-PolygonLayer-3D',
        data: polygonData,
        visible,
        opacity: polygonOpacity,
        pickable,
        extruded: true,
        wireframe: true,
        getPolygon,
        getFillColor: getColor,
        getLineColor: getColor,
        getElevation }):null,
    ];
  }
}
