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
import { CompositeLayer, ScatterplotLayer, GridCellLayer, LineLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import EnhancedArcLayer from '../enhanced-arc-layer';
import { onHoverClick, checkClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
var MovesLayer = /** @class */ (function (_super) {
    __extends(MovesLayer, _super);
    function MovesLayer(props) {
        return _super.call(this, props) || this;
    }
    ;
    MovesLayer.prototype.getPickingInfo = function (pickParams) {
        onHoverClick(pickParams);
    };
    MovesLayer.prototype.renderLayers = function () {
        var _a = this.props, routePaths = _a.routePaths, layerRadiusScale = _a.layerRadiusScale, layerOpacity = _a.layerOpacity, movedData = _a.movedData, movesbase = _a.movesbase, clickedObject = _a.clickedObject, actions = _a.actions, optionElevationScale = _a.optionElevationScale, optionOpacity = _a.optionOpacity, optionCellSize = _a.optionCellSize, optionVisible = _a.optionVisible, optionChange = _a.optionChange, lightSettings = _a.lightSettings, getColor = _a.getColor, propGetRadius = _a.getRadius, visible = _a.visible, getColor1 = _a.getColor1, getColor2 = _a.getColor2, getColor3 = _a.getColor3, getColor4 = _a.getColor4, getElevation1 = _a.getElevation1, getElevation2 = _a.getElevation2, getElevation3 = _a.getElevation3, getElevation4 = _a.getElevation4, getCubeColor = _a.getCubeColor, getCubeElevation = _a.getCubeElevation, i18n = _a.i18n;
        if (!routePaths || !movesbase || !actions ||
            typeof clickedObject === 'undefined' || (optionVisible && !lightSettings)) {
            return null;
        }
        if (!movedData) {
            return null;
        }
        var distanceScales = this.context.viewport.distanceScales;
        var degreesPerPixel = distanceScales.degreesPerPixel, pixelsPerMeter = distanceScales.pixelsPerMeter;
        var degreesMeterLng = degreesPerPixel[0] * pixelsPerMeter[0];
        var degreesMeterLat = degreesPerPixel[1] * pixelsPerMeter[1];
        var optionMedianLng = (degreesMeterLng * optionCellSize) / 2;
        var optionMedianLat = (degreesMeterLat * optionCellSize) / 2;
        var optionShiftLng = (degreesMeterLng * optionCellSize) / 2;
        var optionShiftLat = (degreesMeterLat * optionCellSize) / 2;
        var getPosition = function (x) { return x.position; };
        var getOptPosition = function (x) {
            var pos = getPosition(x);
            return [pos[0] - optionMedianLng, pos[1] - optionMedianLat, pos[2]];
        };
        var getRadius = propGetRadius || (function (x) { return (x.radius || 20); });
        var getPosition1 = function (x) {
            var pos = getOptPosition(x);
            return [pos[0] + optionShiftLng, pos[1] + optionShiftLat, pos[2]];
        };
        var getPosition2 = function (x) {
            var pos = getOptPosition(x);
            return [pos[0] + optionShiftLng, pos[1] - optionShiftLat, pos[2]];
        };
        var getPosition3 = function (x) {
            var pos = getOptPosition(x);
            return [pos[0] - optionShiftLng, pos[1] + optionShiftLat, pos[2]];
        };
        var getPosition4 = function (x) {
            var pos = getOptPosition(x);
            return [pos[0] - optionShiftLng, pos[1] - optionShiftLat, pos[2]];
        };
        checkClickedObjectToBeRemoved(movedData, clickedObject, routePaths, actions);
        return [
            new ScatterplotLayer({
                id: 'moves',
                data: movedData,
                radiusScale: layerRadiusScale,
                getPosition: getPosition,
                getColor: getColor,
                getRadius: getRadius,
                visible: visible,
                opacity: layerOpacity,
                pickable: true,
                radiusMinPixels: 1
            }),
            new LineLayer({
                id: 'route-paths',
                data: routePaths,
                strokeWidth: Math.max(pixelsPerMeter[0] * 10, 1),
                visible: visible,
                fp64: false,
                pickable: false
            }),
            new GridCellLayer({
                id: 'moves-opt1',
                data: movedData,
                visible: visible && optionVisible && !optionChange,
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
                id: 'moves-opt2',
                data: movedData,
                visible: visible && optionVisible && !optionChange,
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
                id: 'moves-opt3',
                data: movedData,
                visible: visible && optionVisible && !optionChange,
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
                id: 'moves-opt4',
                data: movedData,
                visible: visible && optionVisible && !optionChange,
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
                id: 'moves-opt-cube',
                data: movedData,
                visible: visible && optionVisible && optionChange,
                getPosition: getPosition,
                getColor: getCubeColor,
                getElevation: getCubeElevation,
                opacity: optionOpacity,
                pickable: true,
                cellSize: optionCellSize,
                elevationScale: optionElevationScale,
                lightSettings: lightSettings
            }),
            new EnhancedArcLayer({
                id: 'moves-opt-arc',
                data: movedData,
                visible: visible && optionVisible,
                pickable: true,
                getStrokeWidths: function (x) { return Math.max(x.strokeWidth, pixelsPerMeter[0] * 10, 1); },
                opacity: layerOpacity
            }),
        ];
    };
    MovesLayer.defaultProps = {
        layerRadiusScale: 1,
        layerOpacity: 0.75,
        optionVisible: true,
        optionChange: false,
        optionOpacity: 0.25,
        optionCellSize: 12,
        optionElevationScale: 1,
        visible: true,
        getColor: function (x) { return x.color || COLOR1; },
        getColor1: function (x) { return (x.optColor && x.optColor[0]) || x.color || COLOR1; },
        getColor2: function (x) { return (x.optColor && x.optColor[1]) || x.color || COLOR1; },
        getColor3: function (x) { return (x.optColor && x.optColor[2]) || x.color || COLOR1; },
        getColor4: function (x) { return (x.optColor && x.optColor[3]) || x.color || COLOR1; },
        getElevation1: function (x) { return (x.optElevation && x.optElevation[0]) || 0; },
        getElevation2: function (x) { return (x.optElevation && x.optElevation[1]) || 0; },
        getElevation3: function (x) { return (x.optElevation && x.optElevation[2]) || 0; },
        getElevation4: function (x) { return (x.optElevation && x.optElevation[3]) || 0; },
        getCubeColor: function (x) { return x.optColor || [x.color] || [COLOR1]; },
        getCubeElevation: function (x) { return x.optElevation || [0]; },
        i18n: {
            error: 'MovesLayer: props 指定エラー'
        }
    };
    MovesLayer.layerName = 'MovesLayer';
    return MovesLayer;
}(CompositeLayer));
export default MovesLayer;
//# sourceMappingURL=index.js.map