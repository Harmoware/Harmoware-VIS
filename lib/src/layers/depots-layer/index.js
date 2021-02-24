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
import { ScatterplotLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import { IcoSphereGeometry } from '@luma.gl/engine';
import CubeGraphLayer from '../cubegraph-layer';
import { COLOR4 } from '../../constants/settings';
var defaultmesh = new IcoSphereGeometry();
var DepotsLayer = /** @class */ (function (_super) {
    __extends(DepotsLayer, _super);
    function DepotsLayer(props) {
        return _super.call(this, props) || this;
    }
    ;
    DepotsLayer.prototype.getIconLayer = function () {
        var _a = this.props, id = _a.id, iconlayer = _a.iconlayer, iconChange = _a.iconChange, layerRadiusScale = _a.layerRadiusScale, layerOpacity = _a.layerOpacity, depotsData = _a.depotsData, getColor = _a.getColor, getRadius = _a.getRadius, pickable = _a.pickable, visible = _a.visible, mesh = _a.mesh, meshSizeScale = _a.meshSizeScale, getOrientation = _a.getOrientation, getScale = _a.getScale, getTranslation = _a.getTranslation, propIconDesignations = _a.iconDesignations;
        if (!visible)
            return null;
        var selectlayer = iconlayer || (iconChange ? 'SimpleMesh' : 'Scatterplot');
        var defaultIconDesignations = [{ 'type': undefined, 'layer': selectlayer }];
        var iconDesignations = propIconDesignations || defaultIconDesignations;
        return iconDesignations.map(function (iconDesignation, idx) {
            var type = iconDesignation.type, layer = iconDesignation.layer, overradiusScale = iconDesignation.radiusScale, overgetColor = iconDesignation.getColor, overgetOrientation = iconDesignation.getOrientation, overgetScale = iconDesignation.getScale, overgetTranslation = iconDesignation.getTranslation, overgetRadius = iconDesignation.getRadius, oversizeScale = iconDesignation.sizeScale, overmesh = iconDesignation.mesh;
            var getPosition = function (x) { return !type || !x.type || (x.type && x.type === type) ? x.position : null; };
            if (layer && layer === 'Scatterplot') {
                return [
                    new ScatterplotLayer({
                        id: id + '-depots-Scatterplot-' + String(idx),
                        data: depotsData,
                        radiusScale: overradiusScale || layerRadiusScale,
                        getPosition: getPosition,
                        getFillColor: overgetColor || getColor,
                        getRadius: overgetRadius || getRadius,
                        opacity: layerOpacity,
                        pickable: pickable,
                        radiusMinPixels: 1
                    })
                ];
            }
            else if (layer && layer === 'SimpleMesh') {
                return [
                    new SimpleMeshLayer({
                        id: id + '-depots-SimpleMesh-' + String(idx),
                        data: depotsData,
                        mesh: overmesh || mesh,
                        sizeScale: oversizeScale || meshSizeScale,
                        getPosition: getPosition,
                        getColor: overgetColor || getColor,
                        getOrientation: overgetOrientation || getOrientation,
                        getScale: overgetScale || getScale,
                        getTranslation: overgetTranslation || getTranslation,
                        opacity: layerOpacity,
                        pickable: pickable,
                    })
                ];
            }
            else {
                console.log('iconDesignations layer undefined.');
                return null;
            }
        });
    };
    DepotsLayer.prototype.renderLayers = function () {
        var _a = this.props, id = _a.id, depotsData = _a.depotsData, getRadius = _a.getRadius, optionElevationScale = _a.optionElevationScale, optionVisible = _a.optionVisible, optionChange = _a.optionChange, pickable = _a.pickable, optionOpacity = _a.optionOpacity, optionCellSize = _a.optionCellSize, getCubeColor = _a.getCubeColor, getCubeElevation = _a.getCubeElevation, optionCentering = _a.optionCentering, iconChange = _a.iconChange, optionDisplayPosition = _a.optionDisplayPosition;
        if (!depotsData || depotsData.length === 0) {
            return null;
        }
        var stacking2 = optionVisible && optionChange;
        var optPlacement = optionVisible && iconChange ? function () { return optionDisplayPosition; } : getRadius;
        var iconLayers = this.getIconLayer();
        return [
            iconLayers,
            optionVisible ?
                new CubeGraphLayer({
                    id: id + '-depots-opt-cube',
                    optionData: depotsData,
                    visible: optionVisible,
                    optionCentering: optionCentering,
                    stacking2: stacking2,
                    getRadius: optPlacement,
                    getCubeColor: getCubeColor,
                    getCubeElevation: getCubeElevation,
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
        optionDisplayPosition: 30,
        pickable: true,
        getColor: function (x) { return x.color || COLOR4; },
        getRadius: function (x) { return x.radius || 30; },
        getCubeColor: function (x) { return x.optColor || [x.color] || [COLOR4]; },
        getCubeElevation: function (x) { return x.optElevation; },
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