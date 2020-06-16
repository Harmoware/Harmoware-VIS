var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { CompositeLayer, LineLayer, PathLayer, PolygonLayer } from 'deck.gl';
import { COLOR2 } from '../../constants/settings';
var LineMapLayer = /** @class */ (function (_super) {
    __extends(LineMapLayer, _super);
    function LineMapLayer(props) {
        return _super.call(this, props) || this;
    }
    ;
    LineMapLayer.prototype.renderLayers = function () {
        var _a = this.props, id = _a.id, data = _a.data, visible = _a.visible, pickable = _a.pickable, getSourcePosition = _a.getSourcePosition, getTargetPosition = _a.getTargetPosition, getPath = _a.getPath, getPolygon = _a.getPolygon, getCoordinates = _a.getCoordinates, getElevation = _a.getElevation, getWidth = _a.getWidth, getColor = _a.getColor, getDashArray = _a.getDashArray, widthUnits = _a.widthUnits, widthMinPixels = _a.widthMinPixels, polygonOpacity = _a.polygonOpacity, lineOpacity = _a.lineOpacity;
        if (!data || data.length === 0 || !visible) {
            return null;
        }
        var coordinatesData = data.filter(function (x) { return getCoordinates(x); });
        var pathData = data.filter(function (x) { return getPath(x); });
        var sourcePositionData = data.filter(function (x) { return getSourcePosition(x); });
        var polygonData = data.filter(function (x) { return getPolygon(x); });
        return [
            coordinatesData.length > 0 ?
                new PolygonLayer({
                    id: id + '-PolygonLayer-2D',
                    data: coordinatesData,
                    visible: visible,
                    opacity: polygonOpacity,
                    pickable: pickable,
                    extruded: false,
                    wireframe: true,
                    getPolygon: getCoordinates,
                    getFillColor: getColor,
                    getLineColor: null,
                    getElevation: getElevation
                }) : null,
            pathData.length > 0 ?
                new PathLayer({
                    id: id + '-PathLayer',
                    data: pathData,
                    visible: visible,
                    opacity: lineOpacity,
                    pickable: pickable,
                    widthUnits: widthUnits,
                    widthMinPixels: widthMinPixels,
                    rounded: true,
                    getPath: getPath,
                    getColor: getColor,
                    getWidth: getWidth,
                    getDashArray: getDashArray
                }) : null,
            sourcePositionData.length > 0 ?
                new LineLayer({
                    id: id + '-LineLayer',
                    data: sourcePositionData,
                    visible: visible,
                    opacity: lineOpacity,
                    pickable: pickable,
                    getSourcePosition: getSourcePosition,
                    getTargetPosition: getTargetPosition,
                    getColor: getColor,
                    getWidth: getWidth,
                    widthUnits: widthUnits,
                    widthMinPixels: widthMinPixels
                }) : null,
            polygonData.length > 0 ?
                new PolygonLayer({
                    id: id + '-PolygonLayer-3D',
                    data: polygonData,
                    visible: visible,
                    opacity: polygonOpacity,
                    pickable: pickable,
                    extruded: true,
                    wireframe: true,
                    getPolygon: getPolygon,
                    getFillColor: getColor,
                    getLineColor: getColor,
                    getElevation: getElevation
                }) : null,
        ];
    };
    LineMapLayer.defaultProps = {
        id: 'LineMapLayer',
        pickable: true,
        getSourcePosition: function (x) { return x.sourcePosition; },
        getTargetPosition: function (x) { return x.targetPosition; },
        getPath: function (x) { return x.path; },
        getPolygon: function (x) { return x.polygon; },
        getCoordinates: function (x) { return x.coordinates; },
        getElevation: function (x) { return x.elevation || 3; },
        getWidth: function (x) { return x.strokeWidth || 1; },
        getColor: function (x) { return x.color || COLOR2; },
        getDashArray: function (x) { return x.dash || [0, 0]; },
        widthUnits: 'meters',
        widthMinPixels: 0.1,
        polygonOpacity: 0.5,
        lineOpacity: 1.0,
    };
    LineMapLayer.layerName = 'LineMapLayer';
    return LineMapLayer;
}(CompositeLayer));
export default LineMapLayer;
//# sourceMappingURL=index.js.map