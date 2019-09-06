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
import { CompositeLayer, ScatterplotLayer } from 'deck.gl';
import CubeGraphLayer from '../cubegraph-layer';
import { COLOR4 } from '../../constants/settings';
var DepotsLayer = /** @class */ (function (_super) {
    __extends(DepotsLayer, _super);
    function DepotsLayer(props) {
        return _super.call(this, props) || this;
    }
    ;
    DepotsLayer.prototype.renderLayers = function () {
        var _a = this.props, layerRadiusScale = _a.layerRadiusScale, layerOpacity = _a.layerOpacity, depotsData = _a.depotsData, getColor = _a.getColor, getRadius = _a.getRadius, optionElevationScale = _a.optionElevationScale, optionVisible = _a.optionVisible, optionChange = _a.optionChange, optionOpacity = _a.optionOpacity, optionCellSize = _a.optionCellSize, lightSettings = _a.lightSettings, getCubeColor = _a.getCubeColor, getCubeElevation = _a.getCubeElevation;
        if (optionVisible && !lightSettings) {
            return null;
        }
        if (!depotsData) {
            return null;
        }
        var stacking2 = optionVisible && optionChange;
        var _b = this.context.viewport.distanceScales, degreesPerPixel = _b.degreesPerPixel, pixelsPerMeter = _b.pixelsPerMeter;
        var degreesMeterLng = degreesPerPixel[0] * pixelsPerMeter[0];
        var degreesMeterLat = degreesPerPixel[1] * pixelsPerMeter[1];
        var optionShiftLng = degreesMeterLng * ((optionCellSize / 2) + 2);
        var optionShiftLat = stacking2 ? 0 : degreesMeterLat * ((optionCellSize / 2) + 2);
        var getPosition = function (x) { return x.position; };
        var optionDepotsData = depotsData;
        return [
            new ScatterplotLayer({
                id: 'depots',
                data: depotsData,
                radiusScale: layerRadiusScale,
                getPosition: getPosition,
                getFillColor: getColor,
                getRadius: getRadius,
                opacity: layerOpacity,
                pickable: true,
                radiusMinPixels: 1
            }),
            optionVisible ?
                new CubeGraphLayer({
                    id: 'depots-opt-cube',
                    data: optionDepotsData.concat([{}]),
                    visible: optionVisible,
                    stacking2: stacking2,
                    optionShiftLng: optionShiftLng,
                    optionShiftLat: optionShiftLat,
                    degreesMeterLng: degreesMeterLng,
                    getPosition: getPosition,
                    getRadius: getRadius,
                    getColor: getCubeColor,
                    getElevation: getCubeElevation,
                    opacity: optionOpacity,
                    pickable: false,
                    cellSize: optionCellSize,
                    elevationScale: optionElevationScale,
                    lightSettings: lightSettings
                }) : null,
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
        getRadius: function (x) { return x.radius || 30; },
        getCubeColor: function (x) { return x.optColor || [x.color] || [COLOR4]; },
        getCubeElevation: function (x) { return x.optElevation || [0]; },
    };
    return DepotsLayer;
}(CompositeLayer));
export default DepotsLayer;
//# sourceMappingURL=index.js.map