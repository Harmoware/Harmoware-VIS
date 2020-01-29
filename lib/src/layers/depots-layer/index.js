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
import { CompositeLayer, ScatterplotLayer, SimpleMeshLayer } from 'deck.gl';
import { IcoSphereGeometry } from 'luma.gl';
import CubeGraphLayer from '../cubegraph-layer';
import { COLOR4 } from '../../constants/settings';
var defaultmesh = new IcoSphereGeometry();
var DepotsLayer = /** @class */ (function (_super) {
    __extends(DepotsLayer, _super);
    function DepotsLayer(props) {
        return _super.call(this, props) || this;
    }
    ;
    DepotsLayer.prototype.renderLayers = function () {
        var _a = this.props, id = _a.id, iconChange = _a.iconChange, layerRadiusScale = _a.layerRadiusScale, layerOpacity = _a.layerOpacity, depotsData = _a.depotsData, getColor = _a.getColor, getRadius = _a.getRadius, optionElevationScale = _a.optionElevationScale, optionVisible = _a.optionVisible, optionChange = _a.optionChange, pickable = _a.pickable, optionOpacity = _a.optionOpacity, optionCellSize = _a.optionCellSize, getCubeColor = _a.getCubeColor, getCubeElevation = _a.getCubeElevation, mesh = _a.mesh, meshSizeScale = _a.meshSizeScale, getOrientation = _a.getOrientation, getScale = _a.getScale, getTranslation = _a.getTranslation, optionCentering = _a.optionCentering;
        if (!depotsData) {
            return null;
        }
        var stacking2 = optionVisible && optionChange;
        var getPosition = function (x) { return x.position; };
        return [
            !iconChange ? new ScatterplotLayer({
                id: id + '-depots1',
                data: depotsData,
                radiusScale: layerRadiusScale,
                getPosition: getPosition,
                getFillColor: getColor,
                getRadius: getRadius,
                opacity: layerOpacity,
                pickable: pickable,
                radiusMinPixels: 1
            }) :
                new SimpleMeshLayer({
                    id: id + '-depots2',
                    data: depotsData,
                    mesh: mesh,
                    sizeScale: meshSizeScale,
                    getPosition: getPosition,
                    getColor: getColor,
                    getOrientation: getOrientation,
                    getScale: getScale,
                    getTranslation: getTranslation,
                    opacity: layerOpacity,
                    pickable: pickable,
                }),
            optionVisible ?
                new CubeGraphLayer({
                    id: id + '-depots-opt-cube',
                    data: depotsData,
                    visible: optionVisible,
                    optionCentering: optionCentering,
                    stacking2: stacking2,
                    getPosition: getPosition,
                    getRadius: getRadius,
                    getColor: getCubeColor,
                    getElevation: getCubeElevation,
                    opacity: optionOpacity,
                    pickable: pickable,
                    cellSize: optionCellSize,
                    elevationScale: optionElevationScale,
                }) : null,
        ];
    };
    DepotsLayer.layerName = 'DepotsLayer';
    DepotsLayer.defaultProps = {
        id: 'DepotsLayer',
        iconChange: true,
        layerRadiusScale: 1,
        layerOpacity: 0.5,
        optionVisible: true,
        optionChange: false,
        optionOpacity: 0.25,
        optionCellSize: 20,
        optionElevationScale: 1,
        optionCentering: false,
        pickable: true,
        getColor: function (x) { return x.color || COLOR4; },
        getRadius: function (x) { return x.radius || 30; },
        getCubeColor: function (x) { return x.optColor || [x.color] || [COLOR4]; },
        getCubeElevation: function (x) { return x.optElevation || [0]; },
        mesh: defaultmesh,
        meshSizeScale: 40,
        getOrientation: [0, 0, 0],
        getScale: [1, 1, 1],
        getTranslation: [0, 0, 0],
    };
    return DepotsLayer;
}(CompositeLayer));
export default DepotsLayer;
//# sourceMappingURL=index.js.map