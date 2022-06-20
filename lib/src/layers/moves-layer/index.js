import { ScatterplotLayer, LineLayer, ArcLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
import { SimpleMeshLayer, ScenegraphLayer } from '@deck.gl/mesh-layers';
import { CubeGeometry } from '@luma.gl/engine';
import CubeGraphLayer from '../cubegraph-layer';
import { onDefaultClick, checkClickedObjectToBeRemoved } from '../../library';
import * as settings from '../../constants/settings';
import { registerLoaders } from '@loaders.gl/core';
import { GLTFLoader } from '@loaders.gl/gltf';
registerLoaders([GLTFLoader]);
// prettier-ignore
const CUBE_POSITIONS = new Float32Array([
    -1, -1, 2, 1, -1, 2, 1, 1, 2, -1, 1, 2,
    -1, -1, -2, -1, 1, -2, 1, 1, -2, 1, -1, -2,
    -1, 1, -2, -1, 1, 2, 1, 1, 2, 1, 1, -2,
    -1, -1, -2, 1, -1, -2, 1, -1, 2, -1, -1, 2,
    1, -1, -2, 1, 1, -2, 1, 1, 2, 1, -1, 2,
    -1, -1, -2, -1, -1, 2, -1, 1, 2, -1, 1, -2
]);
const ATTRIBUTES = {
    POSITION: { size: 3, value: new Float32Array(CUBE_POSITIONS) },
};
const defaultmesh = new CubeGeometry({ attributes: ATTRIBUTES });
const defaultScenegraph = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/scenegraph-layer/airplane.glb';
class MovesLayer extends CompositeLayer {
    constructor(props) {
        super(props);
    }
    ;
    onClick(event) {
        const { onClick } = this.props;
        if (onClick) {
            onClick(event);
        }
        else {
            onDefaultClick(event);
        }
    }
    getIconLayer(movedData) {
        const { id, layerRadiusScale, layerOpacity, pickable, getRadius, iconlayer, iconChange, iconCubeType, visible, scenegraph, mesh, sizeScale, getOrientation, getScale, getTranslation, iconDesignations: propIconDesignations } = this.props;
        const selectlayer = iconlayer || (!iconChange ? 'Scatterplot' :
            iconCubeType === 0 ? 'SimpleMesh' : iconCubeType === 1 ? 'Scenegraph' : 'Scatterplot');
        const defaultIconDesignations = [{ 'type': undefined, 'layer': selectlayer }];
        const iconDesignations = propIconDesignations || defaultIconDesignations;
        const getColor = (x) => x.color || settings.COLOR1;
        return iconDesignations.map((iconDesignation, idx) => {
            const { type, layer, radiusScale: overradiusScale, getColor: overgetColor, getOrientation: overgetOrientation, getScale: overgetScale, getTranslation: overgetTranslation, getRadius: overgetRadius, sizeScale: oversizeScale, mesh: overmesh, scenegraph: overscenegraph } = iconDesignation;
            if (layer && layer === 'Scatterplot') {
                return new ScatterplotLayer({
                    id: id + '-moves-Scatterplot-' + String(idx),
                    data: movedData,
                    radiusScale: overradiusScale || layerRadiusScale,
                    getPosition: (x) => !type || !x.type || (x.type && x.type === type) ? x.position : null,
                    getFillColor: overgetColor || getColor,
                    getRadius: overgetRadius || getRadius,
                    visible,
                    opacity: layerOpacity,
                    pickable,
                    radiusMinPixels: 1
                });
            }
            else if (layer && layer === 'SimpleMesh') {
                return new SimpleMeshLayer({
                    id: id + '-moves-SimpleMesh-' + String(idx),
                    data: movedData,
                    mesh: overmesh || mesh,
                    sizeScale: oversizeScale || sizeScale,
                    getPosition: (x) => !type || !x.type || (x.type && x.type === type) ? x.position : null,
                    getColor: overgetColor || getColor,
                    getOrientation: overgetOrientation || getOrientation,
                    getScale: overgetScale || getScale,
                    getTranslation: overgetTranslation || getTranslation,
                    visible,
                    opacity: layerOpacity,
                    pickable,
                });
            }
            else if (layer && layer === 'Scenegraph') {
                return new ScenegraphLayer({
                    id: id + '-moves-Scenegraph-' + String(idx),
                    data: movedData,
                    scenegraph: overscenegraph || scenegraph,
                    sizeScale: oversizeScale || sizeScale,
                    getPosition: (x) => !type || !x.type || (x.type && x.type === type) ? x.position : null,
                    getColor: overgetColor || getColor,
                    getOrientation: overgetOrientation || getOrientation,
                    getScale: overgetScale || getScale,
                    getTranslation: overgetTranslation || getTranslation,
                    visible,
                    opacity: layerOpacity,
                    pickable,
                });
            }
            else {
                console.log('iconDesignations layer undefined.');
                return null;
            }
        });
    }
    renderLayers() {
        const { id, routePaths, layerOpacity, movedData, pickable, clickedObject, actions, optionElevationScale, optionOpacity, optionCellSize, optionDisplayPosition, optionVisible, optionArcVisible, optionLineVisible, optionChange, iconChange, visible, getCubeColor, getCubeElevation, getArchWidth, getLinehWidth, optionCentering, } = this.props;
        if (!movedData || movedData.length === 0 || !visible) {
            return null;
        }
        const stacking1 = visible && optionVisible && optionChange;
        const optPlacement = visible && iconChange ? () => optionDisplayPosition : () => 0;
        const arcVisible = optionArcVisible !== undefined ? optionArcVisible : optionVisible;
        const lineVisible = optionLineVisible !== undefined ? optionLineVisible : optionVisible;
        const movedDataPosition = movedData.filter((x) => x.position);
        const arcData = movedData.filter((data) => data.sourcePosition);
        checkClickedObjectToBeRemoved(movedDataPosition, clickedObject, routePaths, actions);
        const iconLayers = this.getIconLayer(movedDataPosition);
        return [
            iconLayers,
            routePaths && routePaths.length > 0 ?
                new LineLayer({
                    id: id + '-route-paths',
                    data: routePaths,
                    widthUnits: 'meters',
                    getWidth: (x) => x.routeWidth,
                    widthMinPixels: 0.1,
                    getColor: (x) => x.routeColor,
                    visible,
                    pickable: false
                }) : null,
            optionVisible ?
                new CubeGraphLayer({
                    id: id + '-moves-opt-cube',
                    optionData: movedDataPosition,
                    visible: optionVisible,
                    optionCentering,
                    stacking1,
                    getCubeColor,
                    getCubeElevation,
                    getRadius: optPlacement,
                    opacity: optionOpacity,
                    pickable,
                    cellSize: optionCellSize,
                    elevationScale: optionElevationScale,
                }) : null,
            arcData.length > 0 && arcVisible ?
                new ArcLayer({
                    id: id + '-moves-opt-arc',
                    data: arcData,
                    visible: arcVisible,
                    pickable,
                    widthUnits: 'meters',
                    widthMinPixels: 0.1,
                    getSourcePosition: (x) => x.sourcePosition,
                    getTargetPosition: (x) => x.targetPosition,
                    getSourceColor: (x) => x.sourceColor || x.color || settings.COLOR1,
                    getTargetColor: (x) => x.targetColor || x.color || settings.COLOR1,
                    getWidth: getArchWidth,
                    opacity: layerOpacity
                }) : null,
            arcData.length > 0 && lineVisible ?
                new LineLayer({
                    id: id + '-moves-opt-line',
                    data: arcData,
                    visible: lineVisible,
                    pickable,
                    widthUnits: 'meters',
                    widthMinPixels: 0.1,
                    getSourcePosition: (x) => x.sourcePosition,
                    getTargetPosition: (x) => x.targetPosition,
                    getColor: (x) => x.sourceColor || x.color || settings.COLOR1,
                    getWidth: getLinehWidth,
                    opacity: layerOpacity
                }) : null,
        ];
    }
}
MovesLayer.defaultProps = {
    id: 'MovesLayer',
    layerRadiusScale: 1,
    layerOpacity: 0.75,
    optionVisible: true,
    optionLineVisible: false,
    optionChange: false,
    optionOpacity: 0.25,
    optionCellSize: 12,
    optionElevationScale: 1,
    optionCentering: false,
    optionDisplayPosition: 30,
    visible: true,
    iconChange: true,
    iconCubeType: 0,
    getRouteColor: (x) => x.routeColor || x.color || settings.COLOR1,
    getRouteWidth: (x) => x.routeWidth || 10,
    getRadius: (x) => x.radius || 20,
    getCubeColor: (x) => x.optColor || [x.color] || [settings.COLOR1],
    getCubeElevation: (x) => x.optElevation,
    getArchWidth: (x) => x.archWidth || 10,
    getLinehWidth: (x) => 10,
    scenegraph: defaultScenegraph,
    mesh: defaultmesh,
    sizeScale: 20,
    getOrientation: (x) => x.direction ? [0, -x.direction, 90] : [0, 0, 90],
    getScale: (x) => x.scale || [1, 1, 1],
    getTranslation: [0, 0, 0],
    pickable: true,
};
MovesLayer.layerName = 'MovesLayer';
export default MovesLayer;
//# sourceMappingURL=index.js.map