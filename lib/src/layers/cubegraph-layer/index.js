var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { GridCellLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
var abs = Math.abs;
var DEFAULT_COLOR = [255, 255, 255, 255];
var pm = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
// position:[longitude,latitude,[elevation]]
var getPosition = function (x) { return x.position; };
var CubeGraphLayer = /** @class */ (function (_super) {
    __extends(CubeGraphLayer, _super);
    function CubeGraphLayer(props) {
        return _super.call(this, props) || this;
    }
    ;
    CubeGraphLayer.prototype.renderLayers = function () {
        var _a = this.props, id = _a.id, optionData = _a.optionData, visible = _a.visible, pickable = _a.pickable, opacity = _a.opacity, cellSize = _a.cellSize, elevationScale = _a.elevationScale, getCubeElevation = _a.getCubeElevation, getCubeColor = _a.getCubeColor, getRadius = _a.getRadius, stacking1 = _a.stacking1, stacking2 = _a.stacking2, optionCentering = _a.optionCentering;
        if (!optionData || optionData.length === 0 || !visible) {
            return null;
        }
        var _b = this.context.viewport.distanceScales, degreesPerUnit = _b.degreesPerUnit, unitsPerMeter = _b.unitsPerMeter;
        var degreesMeterLng = abs(degreesPerUnit[0]) * abs(unitsPerMeter[0]);
        var degreesMeterLat = abs(degreesPerUnit[1]) * abs(unitsPerMeter[1]);
        var halfcellSize = cellSize >> 1;
        var setdata = [];
        var selectOptionData = optionData.filter(function (x) { return x.position && getCubeElevation(x); });
        for (var _i = 0, selectOptionData_1 = selectOptionData; _i < selectOptionData_1.length; _i++) {
            var item = selectOptionData_1[_i];
            var position = item.position;
            var height = position[2] || 0;
            var elevation = getCubeElevation(item);
            var color = getCubeColor(item) || [DEFAULT_COLOR];
            var radius = (optionCentering ? 0 : getRadius(item) || cellSize) + halfcellSize;
            var shiftLng = degreesMeterLng * radius;
            var shiftLat = degreesMeterLat * radius;
            for (var j = 0; j < elevation.length; j = (j + 1) | 0) {
                if (elevation[j] === 0)
                    continue;
                var elevationValue = elevation[j] * elevationScale;
                var setcolor = color[j] || DEFAULT_COLOR;
                var setposition = [0, 0, 0];
                if (stacking1) {
                    setposition[0] = position[0];
                    setposition[1] = position[1];
                    setposition[2] = height;
                    height = height + elevationValue;
                }
                else if (stacking2) {
                    if (j === 2)
                        height = position[2] || 0;
                    setposition[0] = position[0] + (pm[j][0] * shiftLng);
                    setposition[1] = position[1];
                    setposition[2] = height;
                    height = height + elevationValue;
                }
                else {
                    setposition[0] = position[0] + (pm[j][0] * shiftLng);
                    setposition[1] = position[1] + (pm[j][1] * shiftLat);
                    setposition[2] = height;
                }
                setdata.push({
                    position: setposition,
                    elevation: elevation[j],
                    color: setcolor,
                });
            }
        }
        return setdata.length > 0 ? new GridCellLayer({
            id: id + '-GridCellLayer',
            data: setdata,
            pickable: pickable,
            opacity: opacity,
            cellSize: cellSize,
            elevationScale: elevationScale,
            getPosition: function (x) { return x.position || null; },
            getElevation: function (x) { return x.elevation; },
            getFillColor: function (x) { return x.color; },
            offset: [0, 0],
        }) : null;
    };
    CubeGraphLayer.defaultProps = {
        id: 'CubeGraphLayer',
        visible: true,
        cellSize: 12,
        coverage: 1,
        elevationScale: 1,
        opacity: 0.25,
        extruded: true,
        getRadius: function (x) { return x.radius; },
        stacking1: false,
        stacking2: false,
        optionCentering: false,
    };
    CubeGraphLayer.layerName = 'CubeGraphLayer';
    return CubeGraphLayer;
}(CompositeLayer));
export default CubeGraphLayer;
//# sourceMappingURL=index.js.map