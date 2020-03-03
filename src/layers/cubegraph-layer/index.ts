import { LayerProps, GridCellLayer, CompositeLayer } from 'deck.gl';
import { MovedData, DepotsData } from '../../types';


const DEFAULT_COLOR = [255, 255, 255, 255];

interface Props extends LayerProps {
  optionData: MovedData[]|DepotsData[],
  cellSize?: number,
  coverage?: number,
  elevationScale?: number,
  extruded?: boolean,
  getPosition?: (x: MovedData|DepotsData) => number[],
  getCubeColor?: (x: MovedData|DepotsData) => number[][],
  getCubeElevation?: (x: MovedData|DepotsData) => number[],
  getRadius?: (x: MovedData|DepotsData) => number,
  stacking1?: boolean,
  stacking2?: boolean,
  optionCentering?: boolean,
}
const pm = [[1,1],[1,-1],[-1,1],[-1,-1]];

export default class CubeGraphLayer extends CompositeLayer<Props> {

  static defaultProps: Props = {
    id: 'CubeGraphLayer',
    optionData: [],
    visible: true,
    cellSize: 12,
    coverage: 1,
    elevationScale: 1,
    opacity: 0.25,
    extruded: true,
    // position:[longitude,latitude,[elevation]]
    getPosition: (x: MovedData|DepotsData) => x.position,
    // cubeElevation:[値-1,値-2,,,値-n]
    getCubeElevation: (x: MovedData|DepotsData) => x.optElevation || [0],
    // cubeColor:[[rgba-1],[rgba-2],,,[rgba-n]]
    getCubeColor: (x: MovedData|DepotsData) => x.optColor || [DEFAULT_COLOR],
    getRadius: (x: MovedData|DepotsData) => x.radius,
    stacking1: false,
    stacking2: false,
    optionCentering: false,
  };

  static layerName = 'CubeGraphLayer';

  renderLayers() {
    const { id, optionData, visible, pickable, opacity, cellSize, elevationScale,
      getPosition, getCubeElevation, getCubeColor, getRadius,
      stacking1, stacking2, optionCentering } = this.props;

    if (!optionData || optionData.length === 0 || !visible) {
      return null;
    }
  
    const { distanceScales: { degreesPerPixel, pixelsPerMeter } } = this.context.viewport;
    const degreesMeterLng = Math.abs(degreesPerPixel[0]) * Math.abs(pixelsPerMeter[0]);
    const degreesMeterLat = Math.abs(degreesPerPixel[1]) * Math.abs(pixelsPerMeter[1]);
    const halfcellSize = cellSize / 2;

    const setdata = [];
    for (let i = 0; i < optionData.length; i=(i+1)|0) {
      const item = optionData[i];
      const position = getPosition(item);
      if(!Array.isArray(position) || position.length < 2) continue;
      let height = position[2] || 0;
      const elevation = getCubeElevation(item) || [0];
      const color = getCubeColor(item) || [DEFAULT_COLOR];
      const radius = optionCentering ? 0 : getRadius(item) || cellSize;
      const shiftLng = degreesMeterLng * (radius + halfcellSize);
      const shiftLat = degreesMeterLat * (radius + halfcellSize);
      for (let j = 0; j < elevation.length; j=(j+1)|0) {
        if(elevation[j] === 0) continue;
        const elevationValue = elevation[j] * elevationScale;
        const setcolor = color[j] || DEFAULT_COLOR;
        let setposition = [];
        if(stacking1){
          setposition = [position[0], position[1], height];
          height = height + elevationValue;
        }else
        if(stacking2){
          if(j===2) height = position[2] || 0;
          setposition = [
            position[0] + (pm[j][0] * shiftLng),
            position[1],
            height
          ];
          height = height + elevationValue;
        }else{
          setposition = [
            position[0] + (pm[j][0] * shiftLng),
            position[1] + (pm[j][1] * shiftLat),
            height
          ];
        }
        setdata.push({
          position: setposition,
          elevation: elevation[j],
          color: setcolor,
        });
      }
    }

    return setdata.length > 0 ? new GridCellLayer({
      id: id + '-GridCellLayer',
      data: setdata,
      pickable,
      opacity,
      cellSize,
      elevationScale,
      getPosition: (x: any) => x.position || null,
      getElevation: (x: any) => x.elevation,
      getFillColor: (x: any) => x.color,
      offset: [0,0],
    }) : null;
  }
}
