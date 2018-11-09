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
import { CompositeLayer, COORDINATE_SYSTEM } from 'deck.gl';
import FrontScatterplotLayer from '../front-scatterplot-layer';
import { COLOR4 } from '../../constants/settings';
var FixedPointLayer = /** @class */ (function (_super) {
    __extends(FixedPointLayer, _super);
    function FixedPointLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FixedPointLayer.prototype.renderLayers = function () {
        var _a = this.props, layerOpacity = _a.layerOpacity, depotsData = _a.depotsData, getColor = _a.getColor, propGetRadius = _a.getRadius;
        if (!depotsData) {
            return null;
        }
        var getPosition = function (x) { return x.position; };
        var getRadius = propGetRadius || (function (x) { return (x.radius || 2); });
        return [
            new FrontScatterplotLayer({
                id: 'fixed-point',
                data: depotsData,
                projectionMode: COORDINATE_SYSTEM.IDENTITY,
                getPosition: getPosition,
                getColor: getColor,
                getRadius: getRadius,
                opacity: layerOpacity,
                pickable: true,
                radiusScale: 0.1
            }),
        ];
    };
    FixedPointLayer.defaultProps = {
        layerOpacity: 0.75,
        getColor: function (x) { return x.color || COLOR4; }
    };
    FixedPointLayer.layerName = 'FixedPointLayer';
    return FixedPointLayer;
}(CompositeLayer));
export default FixedPointLayer;
//# sourceMappingURL=index.js.map