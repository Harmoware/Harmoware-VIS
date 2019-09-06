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
import { CompositeLayer, ScatterplotLayer, LineLayer, ArcLayer } from 'deck.gl';
import CubeiconLayer from '../cubeicon-layer';
import CubeGraphLayer from '../cubegraph-layer';
import PolygonIconLayer from '../polygon-icon-layer';
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
        var _a = this.props, routePaths = _a.routePaths, layerRadiusScale = _a.layerRadiusScale, layerOpacity = _a.layerOpacity, movedData = _a.movedData, clickedObject = _a.clickedObject, actions = _a.actions, optionElevationScale = _a.optionElevationScale, optionOpacity = _a.optionOpacity, optionCellSize = _a.optionCellSize, optionVisible = _a.optionVisible, optionChange = _a.optionChange, lightSettings = _a.lightSettings, getColor = _a.getColor, getRadius = _a.getRadius, iconChange = _a.iconChange, iconCubeType = _a.iconCubeType, iconCubeSize = _a.iconCubeSize, visible = _a.visible, getCubeColor = _a.getCubeColor, getCubeElevation = _a.getCubeElevation, getStrokeWidth = _a.getStrokeWidth;
        if (typeof clickedObject === 'undefined' || (optionVisible && !lightSettings)) {
            return null;
        }
        var distanceScales = this.context.viewport.distanceScales;
        var degreesPerPixel = distanceScales.degreesPerPixel, pixelsPerMeter = distanceScales.pixelsPerMeter;
        var degreesMeterLng = degreesPerPixel[0] * pixelsPerMeter[0];
        var degreesMeterLat = degreesPerPixel[1] * pixelsPerMeter[1];
        var optionShiftLng = (degreesMeterLng * optionCellSize) / 2;
        var optionShiftLat = (degreesMeterLat * optionCellSize) / 2;
        var getPosition = function (x) { return x.position; };
        var optionMovedData = movedData;
        var stacking1 = visible && optionVisible && optionChange;
        var optPlacement = visible && !iconChange ? function () { return 0; } :
            visible && iconChange && iconCubeType === 0 ? function () { return iconCubeSize / 4; } : function () { return iconCubeSize / 2; };
        checkClickedObjectToBeRemoved(movedData, clickedObject, routePaths, actions);
        return [
            visible && !iconChange ? new ScatterplotLayer({
                id: 'moves1',
                data: movedData,
                radiusScale: layerRadiusScale,
                getPosition: getPosition,
                getFillColor: getColor,
                getRadius: getRadius,
                visible: visible,
                opacity: layerOpacity,
                pickable: true,
                radiusMinPixels: 1
            }) : null,
            visible && iconChange && iconCubeType === 0 ? new PolygonIconLayer({
                id: 'moves2',
                data: movedData,
                getPosition: getPosition,
                getColor: getColor,
                visible: visible,
                opacity: layerOpacity,
                pickable: true,
                cellSize: iconCubeSize,
                lightSettings: lightSettings
            }) : null,
            visible && iconChange && iconCubeType === 1 ? new CubeiconLayer({
                id: 'moves3',
                data: movedData,
                getPosition: getPosition,
                getColor: getColor,
                getHeight: function (x) { return x.height || 40; },
                opacity: layerOpacity,
                pickable: true,
                cellSize: iconCubeSize,
                lightSettings: lightSettings
            }) : null,
            visible ? new LineLayer({
                id: 'route-paths',
                data: routePaths,
                getStrokeWidth: Math.max(pixelsPerMeter[0] * 10, 1),
                getColor: getColor,
                visible: visible,
                fp64: false,
                pickable: false
            }) : null,
            visible && optionVisible ?
                new CubeGraphLayer({
                    id: 'moves-opt-cube',
                    data: optionMovedData.concat([{}]),
                    visible: visible && optionVisible,
                    stacking1: stacking1,
                    optionShiftLng: optionShiftLng,
                    optionShiftLat: optionShiftLat,
                    degreesMeterLng: degreesMeterLng,
                    degreesMeterLat: degreesMeterLat,
                    getPosition: getPosition,
                    getColor: getCubeColor,
                    getElevation: getCubeElevation,
                    getRadius: optPlacement,
                    opacity: optionOpacity,
                    pickable: false,
                    cellSize: optionCellSize,
                    elevationScale: optionElevationScale,
                    lightSettings: lightSettings
                }) : null,
            visible && optionVisible ?
                new ArcLayer({
                    id: 'moves-opt-arc',
                    data: movedData,
                    visible: visible && optionVisible,
                    pickable: true,
                    getSourceColor: function (x) { return x.sourceColor || x.color || COLOR1; },
                    getTargetColor: function (x) { return x.targetColor || x.color || COLOR1; },
                    getStrokeWidth: function (x) { return Math.max(getStrokeWidth(x) * pixelsPerMeter[0], 1); },
                    opacity: layerOpacity
                }) : null,
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
        iconChange: true,
        iconCubeType: 0,
        iconCubeSize: 50,
        getColor: function (x) { return x.color || COLOR1; },
        getRadius: function (x) { return x.radius || 20; },
        getCubeColor: function (x) { return x.optColor || [x.color] || [COLOR1]; },
        getCubeElevation: function (x) { return x.optElevation || [0]; },
        getStrokeWidth: function (x) { return x.strokeWidth || 1; },
    };
    MovesLayer.layerName = 'MovesLayer';
    return MovesLayer;
}(CompositeLayer));
export default MovesLayer;
//# sourceMappingURL=index.js.map