import { Layer } from '@deck.gl/core';
import GL from 'luma.gl/constants';
import { LayerProps, AttributeManager } from 'deck.gl';
import { Model, CubeGeometry } from 'luma.gl';
import vertex from './cubeicon-layer-vertex.glsl';
import fragment from './cubeicon-layer-fragment.glsl';
import { LightSettings } from '../../types';

const DEFAULT_COLOR = [255, 255, 255, 255];

interface Data {
  position: number[],
  height:number,
  color: number[],
  radius: number,
}

interface Props extends LayerProps {
  cellSize?: number,
  coverage?: number,
  heightScale?: number,
  extruded?: boolean,
  fp64?: boolean,
  lightSettings: LightSettings,
  getPosition?: (x: any) => number[],
  getHeight?: (x: any) => number,
  getColor?: (x: any) => number[],
}
interface State {
  attributeManager: AttributeManager,
  model: Model,
}
interface Attribute {
  value: number[],
  size: number
}

export default class CubeiconLayer extends Layer<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  static defaultProps: Props = {
    visible: true,
    cellSize: 12,
    coverage: 1,
    heightScale: 1,
    opacity: 0.25,
    extruded: true,
    fp64: false,
    lightSettings: {},
    getPosition: (x: Data) => x.position, // position:[longitude,latitude,[elevation]]
    getHeight: (x: Data) => x.height, // height:height
    getColor: (x: Data) => x.color, // color:[rgba]
  };

  static layerName = 'CubeiconLayer';

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
    const { data } = props || this.props;
    return data.length;
  }

  draw() {
    const { cellSize } = this.props;
    super.draw({ uniforms: Object.assign({
      cellSize
    })});
  }

  calculateInstancePositions(attribute: Attribute) {
    const { data, getPosition, getHeight, cellSize, heightScale } = this.props;
    const { value, size } = attribute;
    let i = 0;
    for (let j = 0; j < data.length; j += 1) {
      const position = getPosition(data[j]);
      value[i + 0] = position[0];
      value[i + 1] = position[1];
      value[i + 2] = position[2] || 0;
      value[i + 3] = (getHeight(data[j]) || cellSize) * heightScale;
      i += size;
    }
  }

  calculateInstanceColors(attribute: Attribute) {
    const { data, getColor } = this.props;
    const { value, size } = attribute;
    let i = 0;
    for (let j = 0; j < data.length; j += 1) {
      const color = getColor(data[j]) || DEFAULT_COLOR;
      for (let k = 0; k < size; k += 1) {
        if (color[k] === undefined) {
          value[i + k] = DEFAULT_COLOR[k];
        } else {
          value[i + k] = Number.isFinite(color[k]) ? color[k] : DEFAULT_COLOR[k];
        }
      }
      i += size;
    }
  }
}
