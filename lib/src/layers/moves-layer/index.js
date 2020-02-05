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
import { CompositeLayer, ScatterplotLayer, SimpleMeshLayer, ScenegraphLayer, LineLayer, ArcLayer } from 'deck.gl';
import { CubeGeometry } from 'luma.gl';
import CubeGraphLayer from '../cubegraph-layer';
import { onHoverClick, checkClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
import { registerLoaders } from '@loaders.gl/core';
import { GLTFScenegraphLoader } from '@luma.gl/addons';
registerLoaders([GLTFScenegraphLoader]);
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
        var _a = this.props, getRouteColor = _a.getRouteColor, getRouteWidth = _a.getRouteWidth;
        onHoverClick(pickParams, getRouteColor, getRouteWidth);
    };
    MovesLayer.prototype.getIconLayer = function () {
        var _a = this.props, id = _a.id, layerRadiusScale = _a.layerRadiusScale, layerOpacity = _a.layerOpacity, movedData = _a.movedData, getColor = _a.getColor, getRadius = _a.getRadius, iconChange = _a.iconChange, iconCubeType = _a.iconCubeType, visible = _a.visible, scenegraph = _a.scenegraph, mesh = _a.mesh, sizeScale = _a.sizeScale, getOrientation = _a.getOrientation, getScale = _a.getScale, getTranslation = _a.getTranslation, iconDesignations = _a.iconDesignations;
        var getPosition = function (x) { return x.position; };
        if (iconDesignations && iconDesignations.length > 0) {
            return iconDesignations.map(function (iconDesignation, idx) {
                var type = iconDesignation.type, layer = iconDesignation.layer, overradiusScale = iconDesignation.radiusScale, overgetColor = iconDesignation.getColor, overgetOrientation = iconDesignation.getOrientation, overgetScale = iconDesignation.getScale, overgetTranslation = iconDesignation.getTranslation, overgetRadius = iconDesignation.getRadius, oversizeScale = iconDesignation.sizeScale, overmesh = iconDesignation.mesh, overscenegraph = iconDesignation.scenegraph;
                var getTypePosition = function (x) { return !x.type || (x.type && x.type === type) ? x.position : null; };
                if (layer && layer === 'Scatterplot') {
                    return new ScatterplotLayer({
                        id: id + '-moves-flex-' + String(idx),
                        data: movedData,
                        radiusScale: overradiusScale || layerRadiusScale,
                        getPosition: getTypePosition,
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
                        id: id + '-moves-flex-' + String(idx),
                        data: movedData,
                        mesh: overmesh || mesh,
                        sizeScale: oversizeScale || sizeScale,
                        getPosition: getTypePosition,
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
                        id: id + '-moves-flex-' + String(idx),
                        data: movedData,
                        scenegraph: overscenegraph || scenegraph,
                        sizeScale: oversizeScale || sizeScale,
                        getPosition: getTypePosition,
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
        }
        else {
            if (!iconChange) {
                return [
                    new ScatterplotLayer({
                        id: id + '-moves1',
                        data: movedData,
                        radiusScale: layerRadiusScale,
                        getPosition: getPosition,
                        getFillColor: getColor,
                        getRadius: getRadius,
                        visible: visible,
                        opacity: layerOpacity,
                        pickable: true,
                        radiusMinPixels: 1
                    })
                ];
            }
            else if (iconCubeType === 0) {
                return [
                    new SimpleMeshLayer({
                        id: id + '-moves2',
                        data: movedData,
                        mesh: mesh,
                        sizeScale: sizeScale,
                        getPosition: getPosition,
                        getColor: getColor,
                        getOrientation: getOrientation,
                        getScale: getScale,
                        getTranslation: getTranslation,
                        visible: visible,
                        opacity: layerOpacity,
                        pickable: true,
                    })
                ];
            }
            else if (iconCubeType === 1) {
                return [
                    new ScenegraphLayer({
                        id: id + '-moves3',
                        data: movedData,
                        scenegraph: scenegraph,
                        sizeScale: sizeScale,
                        getPosition: getPosition,
                        getColor: getColor,
                        getOrientation: getOrientation,
                        getScale: getScale,
                        getTranslation: getTranslation,
                        visible: visible,
                        opacity: layerOpacity,
                        pickable: true,
                    })
                ];
            }
            else {
                return null;
            }
        }
    };
    MovesLayer.prototype.renderLayers = function () {
        var _a = this.props, id = _a.id, routePaths = _a.routePaths, layerOpacity = _a.layerOpacity, movedData = _a.movedData, clickedObject = _a.clickedObject, actions = _a.actions, optionElevationScale = _a.optionElevationScale, optionOpacity = _a.optionOpacity, optionCellSize = _a.optionCellSize, optionDisplayPosition = _a.optionDisplayPosition, optionVisible = _a.optionVisible, optionChange = _a.optionChange, iconChange = _a.iconChange, visible = _a.visible, getCubeColor = _a.getCubeColor, getCubeElevation = _a.getCubeElevation, getArchWidth = _a.getArchWidth, optionCentering = _a.optionCentering;
        if (typeof clickedObject === 'undefined' ||
            !movedData || movedData.length === 0) {
            return null;
        }
        var getPosition = function (x) { return x.position; };
        var optionMovedData = movedData;
        var stacking1 = visible && optionVisible && optionChange;
        var optPlacement = visible && iconChange ? function () { return optionDisplayPosition; } : function () { return 0; };
        checkClickedObjectToBeRemoved(movedData, clickedObject, routePaths, actions);
        var iconLayers = this.getIconLayer();
        return [
            iconLayers,
            visible ? new LineLayer({
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
                    data: optionMovedData.concat([{}]),
                    visible: optionVisible,
                    optionCentering: optionCentering,
                    stacking1: stacking1,
                    getPosition: getPosition,
                    getColor: getCubeColor,
                    getElevation: getCubeElevation,
                    getRadius: optPlacement,
                    opacity: optionOpacity,
                    pickable: false,
                    cellSize: optionCellSize,
                    elevationScale: optionElevationScale,
                }) : null,
            optionVisible ?
                new ArcLayer({
                    id: id + '-moves-opt-arc',
                    data: movedData,
                    visible: optionVisible,
                    pickable: true,
                    widthUnits: 'meters',
                    widthMinPixels: 0.1,
                    getSourcePosition: function (x) { return x.sourcePosition || getPosition(x); },
                    getTargetPosition: function (x) { return x.targetPosition || getPosition(x); },
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
        getColor: function (x) { return x.color || COLOR1; },
        getRouteColor: function (x) { return x.routeColor || x.color || COLOR1; },
        getRouteWidth: function (x) { return x.routeWidth || 10; },
        getRadius: function (x) { return x.radius || 20; },
        getCubeColor: function (x) { return x.optColor || [x.color] || [COLOR1]; },
        getCubeElevation: function (x) { return x.optElevation || [0]; },
        getArchWidth: function (x) { return x.archWidth || 10; },
        scenegraph: defaultScenegraph,
        mesh: defaultmesh,
        sizeScale: 20,
        getOrientation: function (x) { return x.direction ? [0, (x.direction * -1), 90] : [0, 0, 90]; },
        getScale: [1, 1, 1],
        getTranslation: [0, 0, 0],
    };
    MovesLayer.layerName = 'MovesLayer';
    return MovesLayer;
}(CompositeLayer));
export default MovesLayer;
//# sourceMappingURL=index.js.map