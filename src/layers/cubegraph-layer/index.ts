import { LayerProps, GridCellLayer, CompositeLayer } from 'deck.gl';

const DEFAULT_COLOR = [255, 255, 255, 255];

interface Props extends LayerProps {
  cellSize?: number,
  coverage?: number,
  elevationScale?: number,
  extruded?: boolean,
  material?: object,
  getPosition?: (x: any) => number[],
  getColor?: (x: any) => number[][],
  getElevation?: (x: any) => number[],
  getRadius?: (x: any) => number,
  stacking1?: boolean,
  stacking2?: boolean,
  optionCentering?: boolean,
}
const pm = [[1,1],[1,-1],[-1,1],[-1,-1]];

export default class CubeGraphLayer extends CompositeLayer<Props> {

  static defaultProps: Props = {
    visible: true,
    cellSize: 12,
    coverage: 1,
    elevationScale: 1,
    opacity: 0.25,
    extruded: true,
    getPosition: (x: any) => x.position, // position:[longitude,latitude,[elevation]]
    getElevation: (x: any) => x.elevation || [0], // elevation:[値-1,値-2,,,値-n]
    getColor: (x: any) => x.color || [DEFAULT_COLOR], // color:[[rgba-1],[rgba-2],,,[rgba-n]]
    getRadius: (x: any) => x.radius,
    stacking1: false,
    stacking2: false,
    optionCentering: false,
  };

  static layerName = 'CubeGraphLayer';

  renderLayers() {
    const { id, data, visible, pickable, opacity, cellSize, elevationScale,
      getPosition, getElevation, getColor, getRadius,
      stacking1, stacking2, optionCentering } = this.props;

    if (!data || data.length === 0 || !visible) {
      return null;
    }
  
    const { distanceScales: { degreesPerPixel, pixelsPerMeter } } = this.context.viewport;
    const degreesMeterLng = Math.abs(degreesPerPixel[0]) * Math.abs(pixelsPerMeter[0]);
    const degreesMeterLat = Math.abs(degreesPerPixel[1]) * Math.abs(pixelsPerMeter[1]);
    const halfcellSize = cellSize / 2;

    const setdata = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      const position = getPosition(item);
      if(typeof position === 'undefined') continue;
      let height = position[2] || 0;
      const elevation = getElevation(item) || [0];
      const color = getColor(item) || [DEFAULT_COLOR];
      const radius = optionCentering ? 0 : getRadius(item) || cellSize;
      const shiftLng = degreesMeterLng * (radius + halfcellSize);
      const shiftLat = degreesMeterLat * (radius + halfcellSize);
      for (let j = 0; j < elevation.length; j += 1) {
        if(elevation[j] === 0) continue;
        const elevationValue = elevation[j] * elevationScale;
        const setcolor = color[j] || DEFAULT_COLOR;
        let setposition = [];
        if(stacking1){
          setposition = [position[0], position[1], height];
          height += elevationValue;
        }else
        if(stacking2){
          if(j===2) height = position[2] || 0;
          setposition = [
            position[0] + (pm[j][0] * shiftLng),
            position[1],
            height
          ];
          height += elevationValue;
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
      id: id + '-CubeGraphLayer',
      data: setdata,
      pickable,
      opacity,
      cellSize,
      elevationScale,
      getPosition: (x: any) => x.position,
      getElevation: (x: any) => x.elevation,
      getFillColor: (x: any) => x.color,
      offset: [0,0],
    }) : null;
  }
}
