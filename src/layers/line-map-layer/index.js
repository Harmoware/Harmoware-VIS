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
import { CompositeLayer, LineLayer, COORDINATE_SYSTEM } from 'deck.gl';
import { COLOR2 } from '../../constants/settings';
var LineMapLayer = /** @class */ (function (_super) {
    __extends(LineMapLayer, _super);
    function LineMapLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LineMapLayer.prototype.renderLayers = function () {
        var _a = this.props, layerOpacity = _a.layerOpacity, linemapData = _a.linemapData, strokeWidth = _a.strokeWidth, getColor = _a.getColor;
        if (!linemapData) {
            return null;
        }
        var getSourcePosition = function (x) { return x.sourcePosition; };
        var getTargetPosition = function (x) { return x.targetPosition; };
        return [
            new LineLayer({
                id: 'line-map-layer',
                data: linemapData,
                projectionMode: COORDINATE_SYSTEM.IDENTITY,
                getSourcePosition: getSourcePosition,
                getTargetPosition: getTargetPosition,
                getColor: getColor,
                opacity: layerOpacity,
                pickable: true,
                strokeWidth: strokeWidth
            }),
        ];
    };
    LineMapLayer.defaultProps = {
        layerOpacity: 1.0,
        strokeWidth: 20,
        getColor: function (x) { return x.color || COLOR2; }
    };
    LineMapLayer.layerName = 'LineMapLayer';
    return LineMapLayer;
}(CompositeLayer));
export default LineMapLayer;
//# sourceMappingURL=index.js.map