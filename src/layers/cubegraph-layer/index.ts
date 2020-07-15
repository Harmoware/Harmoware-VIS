import { GridCellLayer } from '@deck.gl/layers';
import { LayerProps, CompositeLayer } from '@deck.gl/core';
import { MovedData, DepotsData } from '../../types';


const DEFAULT_COLOR = [255, 255, 255, 255];

interface Props extends LayerProps {
  optionData: (MovedData|DepotsData)[],
  cellSize?: number,
  coverage?: number,
  elevationScale?: number,
  extruded?: boolean,
  getCubeColor: (x: MovedData|DepotsData) => number[][],
  getCubeElevation: (x: MovedData|DepotsData) => number[],
  getRadius?: (x: MovedData|DepotsData) => number,
  stacking1?: boolean,
  stacking2?: boolean,
  optionCentering?: boolean,
}
const pm = [[1,1],[1,-1],[-1,1],[-1,-1]];
// position:[longitude,latitude,[elevation]]
const getPosition = (x: MovedData|DepotsData) => x.position;

export default class CubeGraphLayer extends CompositeLayer<Props> {
  constructor(props: Props) {
    super(props);
  };

  static defaultProps = {
    id: 'CubeGraphLayer',
    visible: true,
    cellSize: 12,
    coverage: 1,
    elevationScale: 1,
    opacity: 0.25,
    extruded: true,
    getRadius: (x: MovedData|DepotsData) => x.radius,
    stacking1: false,
    stacking2: false,
    optionCentering: false,
  };

  static layerName = 'CubeGraphLayer';

  renderLayers() {
    const { id, optionData, visible, pickable, opacity, cellSize, elevationScale,
      getCubeElevation, getCubeColor, getRadius,
      stacking1, stacking2, optionCentering } = this.props;

    if (!optionData || optionData.length === 0 || !visible) {
      return null;
    }
  
    const { distanceScales: { degreesPerUnit, unitsPerMeter } } = this.context.viewport;
    const degreesMeterLng = Math.abs(degreesPerUnit[0]) * Math.abs(unitsPerMeter[0]);
    const degreesMeterLat = Math.abs(degreesPerUnit[1]) * Math.abs(unitsPerMeter[1]);
    const halfcellSize = cellSize / 2;

    const setdata = [];
    const selectOptionData = optionData.filter(x=>x.position && getCubeElevation(x));
    for (const item of selectOptionData) {
      const position = item.position;
      let height = position[2] || 0;
      const elevation = getCubeElevation(item);
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
