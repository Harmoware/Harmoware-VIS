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
import { CompositeLayer, COORDINATE_SYSTEM, LineLayer } from 'deck.gl';
import FrontScatterplotLayer from '../front-scatterplot-layer';
import { onHoverClick, checkClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
var MovesNonmapLayer = /** @class */ (function (_super) {
    __extends(MovesNonmapLayer, _super);
    function MovesNonmapLayer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MovesNonmapLayer.prototype.getPickingInfo = function (pickParams) {
        onHoverClick(pickParams);
    };
    MovesNonmapLayer.prototype.renderLayers = function () {
        var _a = this.props, layerOpacity = _a.layerOpacity, actions = _a.actions, clickedObject = _a.clickedObject, movedData = _a.movedData, getColor = _a.getColor, getRadius = _a.getRadius, routePaths = _a.routePaths;
        if (!movedData) {
            return null;
        }
        var getPosition = function (x) { return x.position; };
        checkClickedObjectToBeRemoved(movedData, clickedObject, routePaths, actions);
        return [
            new FrontScatterplotLayer({
                id: 'moves-nonmap',
                data: movedData,
                coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
                getPosition: getPosition,
                getColor: getColor,
                getRadius: getRadius,
                opacity: layerOpacity,
                pickable: true,
                radiusScale: 0.1
            }),
            new LineLayer({
                id: 'route-paths',
                data: routePaths,
                coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
                strokeWidth: 20,
                pickable: false
            }),
        ];
    };
    MovesNonmapLayer.defaultProps = {
        layerOpacity: 0.75,
        getColor: function (x) { return x.color || COLOR1; },
        getRadius: function (x) { return x.radius || 2; },
    };
    MovesNonmapLayer.layerName = 'MovesNonmapLayer';
    return MovesNonmapLayer;
}(CompositeLayer));
export default MovesNonmapLayer;
//# sourceMappingURL=index.js.map