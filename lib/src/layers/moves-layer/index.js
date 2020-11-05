var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ScatterplotLayer, LineLayer, ArcLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
import { SimpleMeshLayer, ScenegraphLayer } from '@deck.gl/mesh-layers';
import { CubeGeometry } from '@luma.gl/engine';
import CubeGraphLayer from '../cubegraph-layer';
import { onHoverClick, checkClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
import { registerLoaders } from '@loaders.gl/core';
import { GLTFLoader } from '@loaders.gl/gltf';
registerLoaders([GLTFLoader]);
// prettier-ignore
var CUBE_POSITIONS = new Float32Array([
    -1, -1, 2, 1, -1, 2, 1, 1, 2, -1, 1, 2,
    -1, -1, -2, -1, 1, -2, 1, 1, -2, 1, -1, -2,
    -1, 1, -2, -1, 1, 2, 1, 1, 2, 1, 1, -2,
    -1, -1, -2, 1, -1, -2, 1, -1, 2, -1, -1, 2,
    1, -1, -2, 1, 1, -2, 1, 1, 2, 1, -1, 2,
    -1, -1, -2, -1, -1, 2, -1, 1, 2, -1, 1, -2
]);
var ATTRIBUTES = {
    POSITION: { size: 3, value: new Float32Array(CUBE_POSITIONS) },
};
var defaultmesh = new CubeGeometry({ attributes: ATTRIBUTES });
var defaultScenegraph = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/scenegraph-layer/airplane.glb';
var MovesLayer = /** @class */ (function (_super) {
    __extends(MovesLayer, _super);
    function MovesLayer(props) {
        return _super.call(this, props) || this;
    }
    ;
    MovesLayer.prototype.getPickingInfo = function (pickParams) {
        var _a = this.props, getRouteColor = _a.getRouteColor, getRouteWidth = _a.getRouteWidth, iconDesignations = _a.iconDesignations;
        onHoverClick(pickParams, getRouteColor, getRouteWidth, iconDesignations);
    };
    MovesLayer.prototype.getIconLayer = function (movedData) {
        var _a = this.props, id = _a.id, layerRadiusScale = _a.layerRadiusScale, layerOpacity = _a.layerOpacity, getRadius = _a.getRadius, iconlayer = _a.iconlayer, iconChange = _a.iconChange, iconCubeType = _a.iconCubeType, visible = _a.visible, scenegraph = _a.scenegraph, mesh = _a.mesh, sizeScale = _a.sizeScale, getOrientation = _a.getOrientation, getScale = _a.getScale, getTranslation = _a.getTranslation, propIconDesignations = _a.iconDesignations;
        var selectlayer = iconlayer || (!iconChange ? 'Scatterplot' :
            iconCubeType === 0 ? 'SimpleMesh' : iconCubeType === 1 ? 'Scenegraph' : 'Scatterplot');
        var defaultIconDesignations = [{ 'type': undefined, 'layer': selectlayer }];
        var iconDesignations = propIconDesignations || defaultIconDesignations;
        var getColor = function (x) { return x.color || COLOR1; };
        return iconDesignations.map(function (iconDesignation, idx) {
            var type = iconDesignation.type, layer = iconDesignation.layer, overradiusScale = iconDesignation.radiusScale, overgetColor = iconDesignation.getColor, overgetOrientation = iconDesignation.getOrientation, overgetScale = iconDesignation.getScale, overgetTranslation = iconDesignation.getTranslation, overgetRadius = iconDesignation.getRadius, oversizeScale = iconDesignation.sizeScale, overmesh = iconDesignation.mesh, overscenegraph = iconDesignation.scenegraph;
            if (layer && layer === 'Scatterplot') {
                return new ScatterplotLayer({
                    id: id + '-moves-Scatterplot-' + String(idx),
                    data: movedData,
                    radiusScale: overradiusScale || layerRadiusScale,
                    getPosition: function (x) { return !type || !x.type || (x.type && x.type === type) ? x.position : null; },
                    getFillColor: overgetColor || getColor,
                    getRadius: overgetRadius || getRadius,
                    visible: visible,
                    opacity: layerOpacity,
                    pickable: true,
                    radiusMinPixels: 1
                });
            }
            else if (layer && layer === 'SimpleMesh') {
                return new SimpleMeshLayer({
                    id: id + '-moves-SimpleMesh-' + String(idx),
                    data: movedData,
                    mesh: overmesh || mesh,
                    sizeScale: oversizeScale || sizeScale,
                    getPosition: function (x) { return !type || !x.type || (x.type && x.type === type) ? x.position : null; },
                    getColor: overgetColor || getColor,
                    getOrientation: overgetOrientation || getOrientation,
                    getScale: overgetScale || getScale,
                    getTranslation: overgetTranslation || getTranslation,
                    visible: visible,
                    opacity: layerOpacity,
                    pickable: true,
                });
            }
            else if (layer && layer === 'Scenegraph') {
                return new ScenegraphLayer({
                    id: id + '-moves-Scenegraph-' + String(idx),
                    data: movedData,
                    scenegraph: overscenegraph || scenegraph,
                    sizeScale: oversizeScale || sizeScale,
                    getPosition: function (x) { return !type || !x.type || (x.type && x.type === type) ? x.position : null; },
                    getColor: overgetColor || getColor,
                    getOrientation: overgetOrientation || getOrientation,
                    getScale: overgetScale || getScale,
                    getTranslation: overgetTranslation || getTranslation,
                    visible: visible,
                    opacity: layerOpacity,
                    pickable: true,
                });
            }
            else {
                console.log('iconDesignations layer undefined.');
                return null;
            }
        });
    };
    MovesLayer.prototype.renderLayers = function () {
        var _a = this.props, id = _a.id, routePaths = _a.routePaths, layerOpacity = _a.layerOpacity, movedData = _a.movedData, clickedObject = _a.clickedObject, actions = _a.actions, optionElevationScale = _a.optionElevationScale, optionOpacity = _a.optionOpacity, optionCellSize = _a.optionCellSize, optionDisplayPosition = _a.optionDisplayPosition, optionVisible = _a.optionVisible, optionArcVisible = _a.optionArcVisible, optionChange = _a.optionChange, iconChange = _a.iconChange, visible = _a.visible, getCubeColor = _a.getCubeColor, getCubeElevation = _a.getCubeElevation, getArchWidth = _a.getArchWidth, optionCentering = _a.optionCentering;
        if (typeof clickedObject === 'undefined' ||
            !movedData || movedData.length === 0 || !visible) {
            return null;
        }
        var stacking1 = visible && optionVisible && optionChange;
        var optPlacement = visible && iconChange ? function () { return optionDisplayPosition; } : function () { return 0; };
        var arcVisible = optionArcVisible !== undefined ? optionArcVisible : optionVisible;
        var movedDataPosition = movedData.filter(function (x) { return x.position; });
        var arcData = movedData.filter(function (data) { return data.sourcePosition; });
        checkClickedObjectToBeRemoved(movedDataPosition, clickedObject, routePaths, actions);
        var iconLayers = this.getIconLayer(movedDataPosition);
        return [
            iconLayers,
            routePaths.length > 0 ?
                new LineLayer({
                    id: id + '-route-paths',
                    data: routePaths,
                    widthUnits: 'meters',
                    getWidth: function (x) { return x.routeWidth; },
                    widthMinPixels: 0.1,
                    getColor: function (x) { return x.routeColor; },
                    visible: visible,
                    pickable: false
                }) : null,
            optionVisible ?
                new CubeGraphLayer({
                    id: id + '-moves-opt-cube',
                    optionData: movedDataPosition,
                    visible: optionVisible,
                    optionCentering: optionCentering,
                    stacking1: stacking1,
                    getCubeColor: getCubeColor,
                    getCubeElevation: getCubeElevation,
                    getRadius: optPlacement,
                    opacity: optionOpacity,
                    pickable: true,
                    cellSize: optionCellSize,
                    elevationScale: optionElevationScale,
                }) : null,
            arcVisible ?
                new ArcLayer({
                    id: id + '-moves-opt-arc',
                    data: arcData,
                    visible: arcVisible,
                    pickable: true,
                    widthUnits: 'meters',
                    widthMinPixels: 0.1,
                    getSourcePosition: function (x) { return x.sourcePosition; },
                    getTargetPosition: function (x) { return x.targetPosition; },
                    getSourceColor: function (x) { return x.sourceColor || x.color || COLOR1; },
                    getTargetColor: function (x) { return x.targetColor || x.color || COLOR1; },
                    getWidth: getArchWidth,
                    opacity: layerOpacity
                }) : null,
        ];
    };
    MovesLayer.defaultProps = {
        id: 'MovesLayer',
        layerRadiusScale: 1,
        layerOpacity: 0.75,
        optionVisible: true,
        optionChange: false,
        optionOpacity: 0.25,
        optionCellSize: 12,
        optionElevationScale: 1,
        optionCentering: false,
        optionDisplayPosition: 30,
        visible: true,
        iconChange: true,
        iconCubeType: 0,
        getRouteColor: function (x) { return x.routeColor || x.color || COLOR1; },
        getRouteWidth: function (x) { return x.routeWidth || 10; },
        getRadius: function (x) { return x.radius || 20; },
        getCubeColor: function (x) { return x.optColor || [x.color] || [COLOR1]; },
        getCubeElevation: function (x) { return x.optElevation; },
        getArchWidth: function (x) { return x.archWidth || 10; },
        scenegraph: defaultScenegraph,
        mesh: defaultmesh,
        sizeScale: 20,
        getOrientation: function (x) { return x.direction ? [0, -x.direction, 90] : [0, 0, 90]; },
        getScale: function (x) { return x.scale || [1, 1, 1]; },
        getTranslation: [0, 0, 0],
    };
    MovesLayer.layerName = 'MovesLayer';
    return MovesLayer;
}(CompositeLayer));
export default MovesLayer;
//# sourceMappingURL=index.js.map