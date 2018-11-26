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
import { CompositeLayer, ScatterplotLayer, GridCellLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import { COLOR4 } from '../../constants/settings';
var DepotsLayer = /** @class */ (function (_super) {
    __extends(DepotsLayer, _super);
    function DepotsLayer(props) {
        return _super.call(this, props) || this;
    }
    ;
    DepotsLayer.prototype.renderLayers = function () {
        var _a = this.props, layerRadiusScale = _a.layerRadiusScale, layerOpacity = _a.layerOpacity, depotsData = _a.depotsData, getColor = _a.getColor, propGetRadius = _a.getRadius, optionElevationScale = _a.optionElevationScale, optionVisible = _a.optionVisible, optionChange = _a.optionChange, optionOpacity = _a.optionOpacity, optionCellSize = _a.optionCellSize, lightSettings = _a.lightSettings, getColor1 = _a.getColor1, getColor2 = _a.getColor2, getColor3 = _a.getColor3, getColor4 = _a.getColor4, getElevation1 = _a.getElevation1, getElevation2 = _a.getElevation2, getElevation3 = _a.getElevation3, getElevation4 = _a.getElevation4, i18n = _a.i18n;
        if (optionVisible && !lightSettings) {
            return null;
        }
        if (!depotsData) {
            return null;
        }
        var distanceScales = this.context.viewport.distanceScales;
        var degreesPerPixel = distanceScales.degreesPerPixel, pixelsPerMeter = distanceScales.pixelsPerMeter;
        var degreesMeterLng = degreesPerPixel[0] * pixelsPerMeter[0];
        var degreesMeterLat = degreesPerPixel[1] * pixelsPerMeter[1];
        var optionMedianLng = (degreesMeterLng * optionCellSize) / 2;
        var optionMedianLat = (degreesMeterLat * optionCellSize) / 2;
        var optionShiftLng = function (rad) { return degreesMeterLng * ((rad + (optionCellSize / 2)) + 2); };
        var optionShiftLat = degreesMeterLat * ((optionCellSize / 2) + 2);
        var getPosition = function (x) { return x.position; };
        var getOptPosition = function (x) {
            var pos = getPosition(x);
            return [pos[0] - optionMedianLng, pos[1] - optionMedianLat, pos[2]];
        };
        var getRadius = propGetRadius || (function (x) { return (x.radius || 30); });
        var getPosition1 = function (x) {
            var pos = getOptPosition(x);
            var rad = getRadius(x);
            return [pos[0] + optionShiftLng(rad), pos[1] + optionShiftLat, pos[2]];
        };
        var getPosition2 = function (x) {
            var pos = getOptPosition(x);
            var rad = getRadius(x);
            return [pos[0] + optionShiftLng(rad), pos[1] - optionShiftLat, pos[2]];
        };
        var getPosition3 = function (x) {
            var pos = getOptPosition(x);
            var rad = getRadius(x);
            return [pos[0] - optionShiftLng(rad), pos[1] + optionShiftLat, pos[2]];
        };
        var getPosition4 = function (x) {
            var pos = getOptPosition(x);
            var rad = getRadius(x);
            return [pos[0] - optionShiftLng(rad), pos[1] - optionShiftLat, pos[2]];
        };
        var getCubePosition1 = function (x) {
            var pos = getPosition(x);
            var rad = getRadius(x);
            return [pos[0] + optionShiftLng(rad), pos[1], pos[2]];
        };
        var getCubePosition2 = function (x) {
            var pos = getPosition(x);
            var rad = getRadius(x);
            return [pos[0] - optionShiftLng(rad), pos[1], pos[2]];
        };
        var getCubeColor1 = function (x) { return [
            (x.optColor && x.optColor[0]) || x.color || COLOR4,
            (x.optColor && x.optColor[1]) || x.color || COLOR4
        ]; };
        var getCubeColor2 = function (x) { return [
            (x.optColor && x.optColor[2]) || x.color || COLOR4,
            (x.optColor && x.optColor[3]) || x.color || COLOR4
        ]; };
        var getCubeElevation1 = function (x) { return [
            (x.optElevation && x.optElevation[0]) || 0,
            (x.optElevation && x.optElevation[1]) || 0
        ]; };
        var getCubeElevation2 = function (x) { return [
            (x.optElevation && x.optElevation[2]) || 0,
            (x.optElevation && x.optElevation[3]) || 0
        ]; };
        return [
            new ScatterplotLayer({
                id: 'depots',
                data: depotsData,
                radiusScale: layerRadiusScale,
                getPosition: getPosition,
                getColor: getColor,
                getRadius: getRadius,
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
                lightSettings: lightSettings
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
                lightSettings: lightSettings
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
                lightSettings: lightSettings
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
                lightSettings: lightSettings
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
                lightSettings: lightSettings
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
                lightSettings: lightSettings
            }),
        ];
    };
    DepotsLayer.layerName = 'DepotsLayer';
    DepotsLayer.defaultProps = {
        layerRadiusScale: 1,
        layerOpacity: 0.5,
        optionVisible: true,
        optionChange: false,
        optionOpacity: 0.25,
        optionCellSize: 20,
        optionElevationScale: 1,
        getColor: function (x) { return x.color || COLOR4; },
        getColor1: function (x) {
            return (x.optColor && x.optColor[0]) || x.color || COLOR4;
        },
        getColor2: function (x) { return (x.optColor && x.optColor[1]) || x.color || COLOR4; },
        getColor3: function (x) { return (x.optColor && x.optColor[2]) || x.color || COLOR4; },
        getColor4: function (x) { return (x.optColor && x.optColor[3]) || x.color || COLOR4; },
        getElevation1: function (x) { return (x.optElevation && x.optElevation[0]) || 0; },
        getElevation2: function (x) { return (x.optElevation && x.optElevation[1]) || 0; },
        getElevation3: function (x) { return (x.optElevation && x.optElevation[2]) || 0; },
        getElevation4: function (x) { return (x.optElevation && x.optElevation[3]) || 0; },
        i18n: {
            error: 'DepotsLayer: props 指定エラー'
        }
    };
    return DepotsLayer;
}(CompositeLayer));
export default DepotsLayer;
//# sourceMappingURL=index.js.map