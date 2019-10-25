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
import { CompositeLayer, LineLayer } from 'deck.gl';
var LineMapLayer = /** @class */ (function (_super) {
    __extends(LineMapLayer, _super);
    function LineMapLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineMapLayer.prototype.renderLayers = function () {
        var _a = this.props, id = _a.id, linemapData = _a.linemapData, visible = _a.visible, opacity = _a.opacity, pickable = _a.pickable, getSourcePosition = _a.getSourcePosition, getTargetPosition = _a.getTargetPosition, getWidth = _a.getWidth, getColor = _a.getColor;
        if (!linemapData || !visible) {
            return null;
        }
        return new LineLayer({
            id: id + '-LineMapLayer',
            data: linemapData,
            visible: visible,
            opacity: opacity,
            pickable: pickable,
            getSourcePosition: getSourcePosition,
            getTargetPosition: getTargetPosition,
            getColor: getColor,
            getWidth: getWidth,
            widthUnits: 'meters',
            widthMinPixels: 0.1,
        });
    };
    LineMapLayer.defaultProps = {
        opacity: 1.0,
        pickable: true,
        getSourcePosition: function (x) { return x.sourcePosition; },
        getTargetPosition: function (x) { return x.targetPosition; },
        getWidth: function (x) { return x.strokeWidth || 1; },
        getColor: function (x) { return x.color || [255, 255, 255, 255]; },
    };
    LineMapLayer.layerName = 'LineMapLayer';
    return LineMapLayer;
}(CompositeLayer));
export default LineMapLayer;
//# sourceMappingURL=index.js.map