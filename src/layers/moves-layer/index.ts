import { LayerProps, CompositeLayer, ScatterplotLayer, SimpleMeshLayer, ScenegraphLayer, LineLayer, ArcLayer } from 'deck.gl';
import { CubeGeometry } from 'luma.gl'
import CubeGraphLayer from '../cubegraph-layer';
import { onHoverClick, pickParams, checkClickedObjectToBeRemoved } from '../../library';
import { COLOR1 } from '../../constants/settings';
import { RoutePaths, MovedData, Movesbase, ClickedObject, IconDesignation } from '../../types';
import * as Actions from '../../actions';
import {registerLoaders} from '@loaders.gl/core';
import {GLTFScenegraphLoader} from '@luma.gl/addons';

registerLoaders([GLTFScenegraphLoader]);

// prettier-ignore
const CUBE_POSITIONS = new Float32Array([
  -1,-1,2,1,-1,2,1,1,2,-1,1,2,
  -1,-1,-2,-1,1,-2,1,1,-2,1,-1,-2,
  -1,1,-2,-1,1,2,1,1,2,1,1,-2,
  -1,-1,-2,1,-1,-2,1,-1,2,-1,-1,2,
  1,-1,-2,1,1,-2,1,1,2,1,-1,2,
  -1,-1,-2,-1,-1,2,-1,1,2,-1,1,-2
  ]);

const ATTRIBUTES = {
  POSITION: {size: 3, value: new Float32Array(CUBE_POSITIONS)},
};

const defaultmesh = new CubeGeometry({attributes: ATTRIBUTES});

const defaultScenegraph = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/scenegraph-layer/airplane.glb';

interface Props extends LayerProps {
  routePaths: RoutePaths[],
  layerRadiusScale?: number,
  layerOpacity?: number,
  movedData: MovedData[],
  movesbase: Movesbase[],
  clickedObject: null | ClickedObject[],
  actions: typeof Actions,
  optionVisible?: boolean,
  optionChange?: boolean,
  optionOpacity?: number,
  optionCellSize?: number,
  optionElevationScale?: number,
  optionCentering?: boolean,
  optionDisplayPosition?: number,
  iconChange?: boolean, // Invalid if there is iconDesignations definition
  iconCubeType?: number, // Invalid if there is iconDesignations definition
  iconDesignations?: IconDesignation[],
  getColor?: (x: MovedData) => number[],
  getRouteColor?: (x: MovedData) => number[],
  getRouteWidth?: (x: MovedData) => number,
  getRadius?: (x: MovedData) => number,
  getCubeColor?: (x: MovedData) => number[][],
  getCubeElevation?: (x: MovedData) => number[],
  getArchWidth?: (x: MovedData) => number,
  scenegraph?: any,
  mesh?: any,
  sizeScale?: number,
  getOrientation?: (x: MovedData) => number[],
  getScale?: (x: MovedData) => number[],
  getTranslation?: (x: MovedData) => number[],
}

export default class MovesLayer extends CompositeLayer<Props> {
  constructor(props: Props) {
    super(props);
  };

  static defaultProps = {
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
    getColor: (x: MovedData) => x.color || COLOR1,
    getRouteColor: (x: MovedData) => x.routeColor || x.color || COLOR1,
    getRouteWidth: (x: MovedData) => x.routeWidth || 10,
    getRadius: (x: MovedData) => x.radius || 20,
    getCubeColor: (x: MovedData) => x.optColor || [x.color] || [COLOR1],
    getCubeElevation: (x: MovedData) => x.optElevation || [0],
    getArchWidth: (x: MovedData) => x.archWidth || 10,
    scenegraph: defaultScenegraph,
    mesh: defaultmesh,
    sizeScale: 20,
    getOrientation: (x: MovedData) => x.direction ? [0,(x.direction * -1),90] : [0,0,90],
    getScale: [1,1,1],
    getTranslation: [0,0,0],
    };

  static layerName = 'MovesLayer';

  getPickingInfo(pickParams: pickParams):void {
    const { getRouteColor, getRouteWidth } = this.props;
    onHoverClick(pickParams, getRouteColor, getRouteWidth);
  }

  getIconLayer():any[] {
    const { id, layerRadiusScale, layerOpacity, movedData,
      getColor, getRadius, iconChange, iconCubeType, visible,
      scenegraph, mesh, sizeScale, getOrientation, getScale, getTranslation,
      iconDesignations:propIconDesignations
    } = this.props;

    const selectlayer = !iconChange ? 'Scatterplot':
      iconCubeType === 0 ? 'SimpleMesh':iconCubeType === 1 ? 'Scenegraph':'Scatterplot';
    const defaultIconDesignations = [{'type':undefined,'layer':selectlayer}];
    const iconDesignations = propIconDesignations || defaultIconDesignations;

    return iconDesignations.map((iconDesignation:IconDesignation, idx:Number)=>{
      const {type, layer,
        radiusScale:overradiusScale, getColor:overgetColor, getOrientation:overgetOrientation,
        getScale:overgetScale, getTranslation:overgetTranslation, getRadius:overgetRadius,
        sizeScale:oversizeScale, mesh:overmesh, scenegraph:overscenegraph} = iconDesignation;
      const getPosition = (x: MovedData) => !type || !x.type || (x.type && x.type === type) ? x.position : null;
      if(layer && layer === 'Scatterplot'){
        return new ScatterplotLayer({
          id: id + '-moves-Scatterplot-' + String(idx),
          data: movedData,
          radiusScale: overradiusScale || layerRadiusScale,
          getPosition,
          getFillColor: overgetColor || getColor,
          getRadius: overgetRadius || getRadius,
          visible,
          opacity: layerOpacity,
          pickable: true,
          radiusMinPixels: 1
        });
      }else
      if(layer && layer === 'SimpleMesh'){
        return new SimpleMeshLayer({
          id: id + '-moves-SimpleMesh-' + String(idx),
          data: movedData,
          mesh: overmesh || mesh,
          sizeScale: oversizeScale || sizeScale,
          getPosition,
          getColor: overgetColor || getColor,
          getOrientation: overgetOrientation || getOrientation,
          getScale: overgetScale || getScale,
          getTranslation: overgetTranslation || getTranslation,
          visible,
          opacity: layerOpacity,
          pickable: true,
        });
      }else
      if(layer && layer === 'Scenegraph'){
        return new ScenegraphLayer({
          id: id + '-moves-Scenegraph-' + String(idx),
          data: movedData,
          scenegraph: overscenegraph || scenegraph,
          sizeScale: oversizeScale || sizeScale,
          getPosition,
          getColor: overgetColor || getColor,
          getOrientation: overgetOrientation || getOrientation,
          getScale: overgetScale || getScale,
          getTranslation: overgetTranslation || getTranslation,
          visible,
          opacity: layerOpacity,
          pickable: true,
        });
      }else{
        console.log('iconDesignations layer undefined.');
        return null;
      }
    });
  }

  renderLayers():any[] {
    const { id, routePaths, layerOpacity, movedData,
      clickedObject, actions, optionElevationScale, optionOpacity, optionCellSize,
      optionDisplayPosition, optionVisible, optionChange,
      iconChange, visible, getCubeColor, getCubeElevation, getArchWidth, optionCentering,
    } = this.props;

    if (typeof clickedObject === 'undefined' ||
      !movedData || movedData.length === 0 || !visible) {
      return null;
    }

    const getPosition = (x: MovedData) => x.position;
    const optionMovedData: any[] = movedData;
    const stacking1 = visible && optionVisible && optionChange;
    const optPlacement = visible && iconChange ? ()=>optionDisplayPosition : ()=>0;

    checkClickedObjectToBeRemoved(movedData, clickedObject, routePaths, actions);
    const iconLayers = this.getIconLayer();

    return [
      iconLayers,
      new LineLayer({
        id: id + '-route-paths',
        data: routePaths,
        widthUnits: 'meters',
        getWidth: (x: any) => x.routeWidth,
        widthMinPixels: 0.1,
        getColor: (x: MovedData) => x.routeColor,
        visible,
        pickable: false
      }),
      optionVisible ?
      new CubeGraphLayer({
        id: id + '-moves-opt-cube',
        optionData: optionMovedData.concat([{}]),
        visible: optionVisible,
        optionCentering,
        stacking1,
        getPosition,
        getCubeColor,
        getCubeElevation,
        getRadius: optPlacement,
        opacity: optionOpacity,
        pickable: false,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
      }) : null,
      optionVisible ?
      new ArcLayer({
        id: id + '-moves-opt-arc',
        data: movedData as any[],
        visible: optionVisible,
        pickable: true,
        widthUnits: 'meters',
        widthMinPixels: 0.1,
        getSourcePosition: (x: MovedData) => x.sourcePosition || getPosition(x),
        getTargetPosition: (x: MovedData) => x.targetPosition || getPosition(x),
        getSourceColor: (x: MovedData) => x.sourceColor || x.color || COLOR1,
        getTargetColor: (x: MovedData) => x.targetColor || x.color || COLOR1,
        getWidth: getArchWidth,
        opacity: layerOpacity
      }) : null,
    ];
  }
}
