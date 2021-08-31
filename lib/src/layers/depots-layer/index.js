import { ScatterplotLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import { IcoSphereGeometry } from '@luma.gl/engine';
import CubeGraphLayer from '../cubegraph-layer';
import { COLOR4 } from '../../constants/settings';
const defaultmesh = new IcoSphereGeometry();
export default class DepotsLayer extends CompositeLayer {
    constructor(props) {
        super(props);
    }
    ;
    getIconLayer() {
        const { id, iconlayer, iconChange, layerRadiusScale, layerOpacity, depotsData, getColor, getRadius, pickable, visible, mesh, meshSizeScale, getOrientation, getScale, getTranslation, iconDesignations: propIconDesignations } = this.props;
        if (!visible)
            return null;
        const selectlayer = iconlayer || (iconChange ? 'SimpleMesh' : 'Scatterplot');
        const defaultIconDesignations = [{ 'type': undefined, 'layer': selectlayer }];
        const iconDesignations = propIconDesignations || defaultIconDesignations;
        return iconDesignations.map((iconDesignation, idx) => {
            const { type, layer, radiusScale: overradiusScale, getColor: overgetColor, getOrientation: overgetOrientation, getScale: overgetScale, getTranslation: overgetTranslation, getRadius: overgetRadius, sizeScale: oversizeScale, mesh: overmesh } = iconDesignation;
            const getPosition = (x) => !type || !x.type || (x.type && x.type === type) ? x.position : null;
            if (layer && layer === 'Scatterplot') {
                return [
                    new ScatterplotLayer({
                        id: id + '-depots-Scatterplot-' + String(idx),
                        data: depotsData,
                        radiusScale: overradiusScale || layerRadiusScale,
                        getPosition,
                        getFillColor: overgetColor || getColor,
                        getRadius: overgetRadius || getRadius,
                        opacity: layerOpacity,
                        pickable,
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
                        getPosition,
                        getColor: overgetColor || getColor,
                        getOrientation: overgetOrientation || getOrientation,
                        getScale: overgetScale || getScale,
                        getTranslation: overgetTranslation || getTranslation,
                        opacity: layerOpacity,
                        pickable,
                    })
                ];
            }
            else {
                console.log('iconDesignations layer undefined.');
                return null;
            }
        });
    }
    renderLayers() {
        const { id, depotsData, getRadius, optionElevationScale, optionVisible, optionChange, pickable, optionOpacity, optionCellSize, getCubeColor, getCubeElevation, optionCentering, iconChange, optionDisplayPosition } = this.props;
        if (!depotsData || depotsData.length === 0) {
            return null;
        }
        const stacking2 = optionVisible && optionChange;
        const optPlacement = optionVisible && iconChange ? () => optionDisplayPosition : getRadius;
        const iconLayers = this.getIconLayer();
        return [
            iconLayers,
            optionVisible ?
                new CubeGraphLayer({
                    id: id + '-depots-opt-cube',
                    optionData: depotsData,
                    visible: optionVisible,
                    optionCentering,
                    stacking2,
                    getRadius: optPlacement,
                    getCubeColor,
                    getCubeElevation,
                    opacity: optionOpacity,
                    pickable,
                    cellSize: optionCellSize,
                    elevationScale: optionElevationScale,
                }) : null,
        ];
    }
}
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
    getColor: (x) => x.color || COLOR4,
    getRadius: (x) => x.radius || 30,
    getCubeColor: (x) => x.optColor || [x.color] || [COLOR4],
    getCubeElevation: (x) => x.optElevation,
    mesh: defaultmesh,
    meshSizeScale: 40,
    getOrientation: [0, 0, 0],
    getScale: [1, 1, 1],
    getTranslation: [0, 0, 0],
};
//# sourceMappingURL=index.js.map