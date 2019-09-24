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
import { CompositeLayer, LineLayer } from 'deck.gl';
var LineMapLayer = /** @class */ (function (_super) {
    __extends(LineMapLayer, _super);
    function LineMapLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineMapLayer.prototype.shouldUpdateState = function (_a) {
        var viewportChanged = _a.changeFlags.viewportChanged;
        return viewportChanged;
    };
    LineMapLayer.prototype.renderLayers = function () {
        var _a = this.props, viewport = _a.viewport, linemapData = _a.linemapData, visible = _a.visible, opacity = _a.opacity, pickable = _a.pickable, getSourcePosition = _a.getSourcePosition, getTargetPosition = _a.getTargetPosition, getStrokeWidth = _a.getStrokeWidth, getColor = _a.getColor;
        if (!linemapData) {
            return null;
        }
        var pixelsPerMeter = this.context.viewport.distanceScales.pixelsPerMeter;
        var average = (Math.abs(pixelsPerMeter[0]) + Math.abs(pixelsPerMeter[1])) / 2.0;
        var setStrokeWidth = function (x) { return average * getStrokeWidth(x); };
        return [
            visible ? new LineLayer({
                id: 'line-map-layer',
                data: linemapData,
                visible: visible,
                opacity: opacity,
                pickable: pickable,
                getSourcePosition: getSourcePosition,
                getTargetPosition: getTargetPosition,
                getColor: getColor,
                getStrokeWidth: setStrokeWidth,
                updateTriggers: { getStrokeWidth: viewport }
            }) : null,
        ];
    };
    LineMapLayer.defaultProps = {
        opacity: 1.0,
        pickable: true,
        getSourcePosition: function (x) { return x.sourcePosition; },
        getTargetPosition: function (x) { return x.targetPosition; },
        getStrokeWidth: function (x) { return x.strokeWidth || 1; },
        getColor: function (x) { return x.color || [255, 255, 255, 255]; },
    };
    LineMapLayer.layerName = 'LineMapLayer';
    return LineMapLayer;
}(CompositeLayer));
export default LineMapLayer;
//# sourceMappingURL=index.js.map