import { LineLayer, PathLayer, PolygonLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
import { PathStyleExtension } from '@deck.gl/extensions';
import { COLOR2 } from '../../constants/settings';
const extensions = [new PathStyleExtension({ dash: true })];
export default class LineMapLayer extends CompositeLayer {
    constructor(props) {
        super(props);
    }
    ;
    renderLayers() {
        const { id, data, visible, pickable, getSourcePosition, getTargetPosition, getPath, getPolygon, getCoordinates, getElevation, getWidth, getColor, getDashArray, widthUnits, widthMinPixels, polygonOpacity, lineOpacity } = this.props;
        if (!data || data.length === 0 || !visible) {
            return null;
        }
        const coordinatesData = data.filter(x => getCoordinates(x));
        const pathData = data.filter(x => getPath(x));
        const sourcePositionData = data.filter(x => getSourcePosition(x));
        const polygonData = data.filter(x => getPolygon(x));
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
                    getElevation
                }) : null,
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
                    getDashArray,
                    extensions
                }) : null,
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
                    widthMinPixels
                }) : null,
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
                    getElevation
                }) : null,
        ];
    }
}
LineMapLayer.defaultProps = {
    id: 'LineMapLayer',
    pickable: true,
    getSourcePosition: (x) => x.sourcePosition,
    getTargetPosition: (x) => x.targetPosition,
    getPath: (x) => x.path,
    getPolygon: (x) => x.polygon,
    getCoordinates: (x) => x.coordinates,
    getElevation: (x) => x.elevation || 3,
    getWidth: (x) => x.strokeWidth || 1,
    getColor: (x) => x.color || COLOR2,
    getDashArray: (x) => x.dash || [0, 0],
    widthUnits: 'meters',
    widthMinPixels: 0.1,
    polygonOpacity: 0.5,
    lineOpacity: 1.0,
};
LineMapLayer.layerName = 'LineMapLayer';
//# sourceMappingURL=index.js.map