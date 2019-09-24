var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { CompositeLayer, PolygonLayer } from 'deck.gl';
import { COLOR1 } from '../../constants/settings';
var rightAngleRange = function (v) { return v < 0 ? 0 : v >= 90 ? 89 : v; };
var PolygonIconLayer = /** @class */ (function (_super) {
    __extends(PolygonIconLayer, _super);
    function PolygonIconLayer(props) {
        return _super.call(this, props) || this;
    }
    PolygonIconLayer.prototype.renderLayers = function () {
        var _a = this.props, data = _a.data, visible = _a.visible, opacity = _a.opacity, pickable = _a.pickable, filled = _a.filled, stroked = _a.stroked, extruded = _a.extruded, wireframe = _a.wireframe, elevationScale = _a.elevationScale, lineWidthScale = _a.lineWidthScale, lineWidthMinPixels = _a.lineWidthMinPixels, lineWidthMaxPixels = _a.lineWidthMaxPixels, lineJointRounded = _a.lineJointRounded, lineMiterLimit = _a.lineMiterLimit, lineDashJustified = _a.lineDashJustified, lightSettings = _a.lightSettings, propGetPolygon = _a.getPolygon, getFillColor = _a.getFillColor, getLineColor = _a.getLineColor, getLineWidth = _a.getLineWidth, getElevation = _a.getElevation, cellSize = _a.cellSize, getPosition = _a.getPosition, getColor = _a.getColor, getVertexAngle = _a.getVertexAngle;
        if (!data || data.length === 0) {
            return null;
        }
        var _b = this.context.viewport.distanceScales, degreesPerPixel = _b.degreesPerPixel, pixelsPerMeter = _b.pixelsPerMeter;
        var degreesMeter = [Math.abs(degreesPerPixel[0]) * Math.abs(pixelsPerMeter[0]),
            Math.abs(degreesPerPixel[1]) * Math.abs(pixelsPerMeter[1])];
        var radius = degreesMeter[0] * (cellSize / 2);
        var radMulti = Math.PI / 180;
        var polygonData = propGetPolygon ? data : data.map(function (item) {
            var position = getPosition(item);
            var vertexAngle = rightAngleRange(getVertexAngle(item));
            var direction = item.direction >= 0 ? item.direction : (item.direction + 360);
            var radian = [(direction + vertexAngle) * radMulti,
                (direction + (180 - vertexAngle)) * radMulti];
            var shift1 = [
                radius * Math.sin(radian[0]), radius * Math.cos(radian[0])
            ];
            var shift2 = [
                radius * Math.sin(radian[1]), radius * Math.cos(radian[1])
            ];
            var frontRight = [
                position[0] + shift1[0], position[1] + shift1[1], position[2]
            ];
            var frontLeft = [
                position[0] - shift2[0], position[1] - shift2[1], position[2]
            ];
            var rearLeft = [
                position[0] - shift1[0], position[1] - shift1[1], position[2]
            ];
            var rearRight = [
                position[0] + shift2[0], position[1] + shift2[1], position[2]
            ];
            return Object.assign({}, item, { polygon: [frontRight, frontLeft, rearLeft, rearRight, frontRight] });
        });
        var getPolygon = function (x) { return x.polygon; };
        return [
            new PolygonLayer({
                id: 'polygon-layer',
                data: polygonData,
                visible: visible,
                opacity: opacity,
                pickable: pickable,
                filled: filled,
                stroked: stroked,
                extruded: extruded,
                wireframe: wireframe,
                elevationScale: elevationScale,
                lineWidthScale: lineWidthScale,
                lineWidthMinPixels: lineWidthMinPixels,
                lineWidthMaxPixels: lineWidthMaxPixels,
                lineJointRounded: lineJointRounded,
                lineMiterLimit: lineMiterLimit,
                lineDashJustified: lineDashJustified,
                lightSettings: lightSettings,
                getPolygon: propGetPolygon || getPolygon,
                getFillColor: getFillColor || getColor,
                getLineColor: getLineColor || getColor,
                getLineWidth: getLineWidth,
                getElevation: getElevation,
            }),
        ];
    };
    PolygonIconLayer.defaultProps = {
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
        getPosition: function (x) { return x.position; },
        getColor: COLOR1,
        getVertexAngle: function () { return 25; },
    };
    PolygonIconLayer.layerName = 'PolygonIconLayer';
    return PolygonIconLayer;
}(CompositeLayer));
export default PolygonIconLayer;
//# sourceMappingURL=index.js.map