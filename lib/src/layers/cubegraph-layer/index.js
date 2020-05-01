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
import { GridCellLayer, CompositeLayer } from 'deck.gl';
var DEFAULT_COLOR = [255, 255, 255, 255];
var pm = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
var CubeGraphLayer = /** @class */ (function (_super) {
    __extends(CubeGraphLayer, _super);
    function CubeGraphLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CubeGraphLayer.prototype.renderLayers = function () {
        var _a = this.props, id = _a.id, optionData = _a.optionData, visible = _a.visible, pickable = _a.pickable, opacity = _a.opacity, cellSize = _a.cellSize, elevationScale = _a.elevationScale, getPosition = _a.getPosition, getCubeElevation = _a.getCubeElevation, getCubeColor = _a.getCubeColor, getRadius = _a.getRadius, stacking1 = _a.stacking1, stacking2 = _a.stacking2, optionCentering = _a.optionCentering;
        if (!optionData || optionData.length === 0 || !visible) {
            return null;
        }
        var _b = this.context.viewport.distanceScales, degreesPerUnit = _b.degreesPerUnit, unitsPerMeter = _b.unitsPerMeter;
        var degreesMeterLng = Math.abs(degreesPerUnit[0]) * Math.abs(unitsPerMeter[0]);
        var degreesMeterLat = Math.abs(degreesPerUnit[1]) * Math.abs(unitsPerMeter[1]);
        var halfcellSize = cellSize / 2;
        var setdata = [];
        for (var i = 0; i < optionData.length; i = (i + 1) | 0) {
            var item = optionData[i];
            var position = getPosition(item);
            if (!Array.isArray(position) || position.length < 2)
                continue;
            var height = position[2] || 0;
            var elevation = getCubeElevation(item) || [0];
            var color = getCubeColor(item) || [DEFAULT_COLOR];
            var radius = optionCentering ? 0 : getRadius(item) || cellSize;
            var shiftLng = degreesMeterLng * (radius + halfcellSize);
            var shiftLat = degreesMeterLat * (radius + halfcellSize);
            for (var j = 0; j < elevation.length; j = (j + 1) | 0) {
                if (elevation[j] === 0)
                    continue;
                var elevationValue = elevation[j] * elevationScale;
                var setcolor = color[j] || DEFAULT_COLOR;
                var setposition = [];
                if (stacking1) {
                    setposition = [position[0], position[1], height];
                    height = height + elevationValue;
                }
                else if (stacking2) {
                    if (j === 2)
                        height = position[2] || 0;
                    setposition = [
                        position[0] + (pm[j][0] * shiftLng),
                        position[1],
                        height
                    ];
                    height = height + elevationValue;
                }
                else {
                    setposition = [
                        position[0] + (pm[j][0] * shiftLng),
                        position[1] + (pm[j][1] * shiftLat),
                        height
                    ];
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
        optionData: [],
        visible: true,
        cellSize: 12,
        coverage: 1,
        elevationScale: 1,
        opacity: 0.25,
        extruded: true,
        // position:[longitude,latitude,[elevation]]
        getPosition: function (x) { return x.position; },
        // cubeElevation:[値-1,値-2,,,値-n]
        getCubeElevation: function (x) { return x.optElevation || [0]; },
        // cubeColor:[[rgba-1],[rgba-2],,,[rgba-n]]
        getCubeColor: function (x) { return x.optColor || [DEFAULT_COLOR]; },
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