import { Layer } from '@deck.gl/core';
import GL from 'luma.gl/constants';
import { LayerProps, AttributeManager } from 'deck.gl';
import { Model, CubeGeometry } from 'luma.gl';
import vertex from './cubegraph-layer-vertex.glsl';
import fragment from './cubegraph-layer-fragment.glsl';
import { LightSettings } from '../../types';

const DEFAULT_COLOR = [255, 255, 255, 255];

interface Data {
  position: number[],
  elevation:number[],
  color: number[][],
  radius: number,
}

interface Props extends LayerProps {
  stacking1?: boolean,
  stacking2?: boolean,
  optionShiftLng?: number,
  optionShiftLat?: number,
  degreesMeterLng?: number,
  degreesMeterLat?: number,
  cellSize?: number,
  coverage?: number,
  elevationScale?: number,
  extruded?: boolean,
  fp64?: boolean,
  lightSettings: LightSettings,
  getPosition?: (x: any) => number[],
  getElevation?: (x: any) => number[],
  getColor?: (x: any) => (number | number[])[],
  getRadius?: (x: any) => number,
}
interface State {
  attributeManager: AttributeManager,
  model: Model,
}
interface Attribute {
  value: number[],
  size: number
}

export default class CubeGraphLayer extends Layer<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  static defaultProps: Props = {
    visible: true,
    stacking1: false,
    stacking2: false,
    optionShiftLng: 0,
    optionShiftLat: 0,
    degreesMeterLng: 0,
    degreesMeterLat: 0,
    cellSize: 12,
    coverage: 1,
    elevationScale: 1,
    opacity: 0.25,
    extruded: true,
    fp64: false,
    lightSettings: {},
    getPosition: (x: Data) => x.position, // position:[longitude,latitude,[elevation]]
    getElevation: (x: Data) => x.elevation, // elevation:[値-1,値-2,,,値-n]
    getColor: (x: Data) => x.color, // color:[[rgba-1],[rgba-2],,,[rgba-n]]
    getRadius: (x: Data) => x.radius || 30,
  };

  static layerName = 'CubeGraphLayer';

  getShaders() {
    const { shaderCache } = this.context;
    return { vs: vertex, fs: fragment, modules: ['lighting', 'picking'], shaderCache };
  }

  initializeState() {
    const { gl } = this.context as { gl: WebGLRenderingContext };
    this.setState({ model: this.getModel(gl) });

    const { attributeManager } = this.state;

    attributeManager.addInstanced({
      instancePositions: { size: 4, update: this.calculateInstancePositions },
      instanceColors: { size: 4, type: GL.UNSIGNED_BYTE, update: this.calculateInstanceColors }
    });
  }

  updateState({ props, oldProps, changeFlags }) {
    super.updateState({ props, oldProps, changeFlags });
    this.updateUniforms();
  }

  getModel(gl: WebGLRenderingContext): Model {
    return new Model(gl, Object.assign({}, this.getShaders(), {
      id: this.props.id,
      geometry: new CubeGeometry(),
      isInstanced: true,
      shaderCache: this.context.shaderCache
    }));
  }

  updateUniforms() {
    const { opacity, extruded, coverage, lightSettings } = this.props;

    this.setUniforms(Object.assign({}, {
      extruded,
      opacity,
      coverage
    },
    lightSettings));
  }

  getNumInstances(props: Props) {
    const { data, getElevation } = props || this.props;

    return data.reduce((v, d) => v + (getElevation(d) || [0]).length, 0);
  }

  draw() {
    const { cellSize } = this.props;
    super.draw({ uniforms: Object.assign({
      cellSize
    })});
  }

  calculateInstancePositions(attribute: Attribute) {
    const { data, getPosition, getElevation, getRadius, elevationScale,
      stacking1, stacking2, optionShiftLng, optionShiftLat,
      degreesMeterLng, degreesMeterLat } = this.props;
    const { value, size } = attribute;
    const pm = [[1,1],[1,-1],[-1,1],[-1,-1]];
    let i = 0;
    for (let j = 0; j < data.length; j += 1) {
      const position = getPosition(data[j]);
      if(typeof position === 'undefined') continue;
      let height = position[2] || 0;
      const elevation = getElevation(data[j]) || [0];
      const elevationlength = elevation.length;
      const radius = degreesMeterLng || degreesMeterLat ? getRadius(data[j]) : 0;
      const shiftLng = stacking1 ? 0 : (degreesMeterLng * radius) + optionShiftLng;
      const shiftLat = stacking1 || stacking2 ? 0 : (degreesMeterLat * radius) + optionShiftLat;
      for (let k = 0; k < elevationlength; k += 1) {
        const elevationValue = elevation[k] * elevationScale;
        if(stacking1){
          value[i + 0] = position[0];
          value[i + 1] = position[1];
          value[i + 2] = height;
          value[i + 3] = elevationValue;
          i += size;
          height += elevationValue;
        }else
        if(stacking2){
          if(k<2){
            value[i + 0] = position[0] + shiftLng;
            value[i + 1] = position[1] + optionShiftLat;
            value[i + 2] = height;
            value[i + 3] = elevationValue;
          }else{
            if(k === 2) height = position[2] || 0;
            value[i + 0] = position[0] - shiftLng;
            value[i + 1] = position[1] - optionShiftLat;
            value[i + 2] = height;
            value[i + 3] = elevationValue;
          }
          i += size;
          height += elevationValue;
        }else{
          value[i + 0] = position[0] + (pm[k][0] * shiftLng);
          value[i + 1] = position[1] + (pm[k][1] * shiftLat);
          value[i + 2] = position[2] || 0;
          value[i + 3] = elevationValue;
          i += size;
        }
      }
    }
  }

  calculateInstanceColors(attribute: Attribute) {
    const { data, getColor, getElevation } = this.props;
    const { value, size } = attribute;
    let i = 0;
    for (let j = 0; j < data.length; j += 1) {
      const color = getColor(data[j]) || [DEFAULT_COLOR];
      const elevation = getElevation(data[j]) || [0];
      for (let k = 0; k < elevation.length; k += 1) {
        for (let l = 0; l < DEFAULT_COLOR.length; l += 1) {
          if (color[k] === undefined) {
            value[i + l] = DEFAULT_COLOR[l];
          } else {
            value[i + l] = Number.isFinite(color[k][l]) ? color[k][l] : DEFAULT_COLOR[l];
          }
        }
        i += size;
      }
    }
  }
}
