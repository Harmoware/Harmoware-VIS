import { LayerProps, CompositeLayer, LineLayer, PathLayer, PolygonLayer } from 'deck.gl';
import { LineData } from '../../types';
import { COLOR2 } from '../../constants/settings';

interface Props extends LayerProps {
  getSourcePosition?: (x: any) => number[],
  getTargetPosition?: (x: any) => number[],
  getPath?: (x: any) => number[],
  getPolygon?: (x: any) => number[],
  getCoordinates?: (x: any) => number[],
  getElevation?: (x: any) => number[],
  getColor?: (x: any) => number[],
  getWidth?: (x: any) => number,
  getDashArray?: (x: any) => number[],
  widthUnits?: string,
  widthMinPixels?: number,
  polygonOpacity?: number,
  lineOpacity?: number,
}

export default class LineMapLayer extends CompositeLayer<Props> {

  static defaultProps = {
    id: 'LineMapLayer',
    pickable: true,
    getSourcePosition: (x: LineData) => x.sourcePosition,
    getTargetPosition: (x: LineData) => x.targetPosition,
    getPath: (x: any) => x.path || [],
    getPolygon: (x: any) => x.polygon || [],
    getCoordinates: (x: any) => x.coordinates || [],
    getElevation: (x: any) => x.elevation || 3,
    getWidth: (x: any) => x.strokeWidth || 1,
    getColor: (x: LineData) => x.color || COLOR2, // white
    getDashArray: (x: any) => x.dash || [0,0],
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

    if (!data || !visible) {
      return null;
    }

    return [
      new PolygonLayer({
        id: id + '-PolygonLayer-2D',
        data,
        visible,
        opacity: polygonOpacity,
        pickable,
        extruded: false,
        wireframe: true,
        getPolygon: getCoordinates,
        getFillColor: getColor,
        getLineColor: null,
        getElevation }),
      new PathLayer({
        id: id + '-PathLayer',
        data,
        visible,
        opacity: lineOpacity,
        pickable,
        widthUnits,
        widthMinPixels,
        rounded: true,
        getPath,
        getColor,
        getWidth,
        getDashArray }),
      new LineLayer({
        id: id + '-LineLayer',
        data,
        visible,
        opacity: lineOpacity,
        pickable,
        getSourcePosition,
        getTargetPosition,
        getColor,
        getWidth,
        widthUnits,
        widthMinPixels }),
      new PolygonLayer({
        id: id + '-PolygonLayer-3D',
        data,
        visible,
        opacity: polygonOpacity,
        pickable,
        extruded: true,
        wireframe: true,
        getPolygon,
        getFillColor: getColor,
        getLineColor: getColor,
        getElevation }),
    ];
  }
}
