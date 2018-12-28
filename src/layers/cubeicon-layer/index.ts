import { Layer, LayerProps, AttributeManager } from 'deck.gl';
import { GL, Model, CubeGeometry, picking, registerShaderModules } from 'luma.gl';
import vertex from './cubeicon-layer-vertex.glsl';
import fragment from './cubeicon-layer-fragment.glsl';
import { LightSettings, MovedData, DepotsData } from '../../types';

registerShaderModules([picking]);

const DEFAULT_COLOR = [255, 255, 255, 255];

interface Data {
  position: number[],
  elevation:number[],
  color: number[][],
}

interface Props extends LayerProps {
  cellSize?: number,
  coverage?: number,
  elevationScale?: number,
  extruded?: boolean,
  fp64?: boolean,
  lightSettings: LightSettings,
  getPosition?: (x) => number[],
  getElevation?: (x) => number[],
  getColor?: (x) => (number | number[])[],
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

  static defaultProps = {
    visible: true,
    cellSize: 12,
    coverage: 1,
    elevationScale: 1,
    opacity: 0.25,
    extruded: true,
    fp64: false,
    getPosition: (x: Data) => x.position, // position:[longitude,latitude]
    getElevation: (x: Data) => x.elevation, // elevation:[値-1,値-2,,,値-n]
    getColor: (x: Data) => x.color, // color:[[rgba-1],[rgba-2],,,[rgba-n]]
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
      //      id: this.props.id,
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
    const { data, getPosition, getElevation, elevationScale } = this.props;
    const { value, size } = attribute;
    let i = 0;
    for (let j = 0; j < data.length; j += 1) {
      const position = getPosition(data[j]);
      let height = 0;
      const elevation = getElevation(data[j]) || [0];
      for (let k = 0; k < elevation.length; k += 1) {
        value[i + 0] = position[0];
        value[i + 1] = position[1];
        value[i + 2] = height;
        value[i + 3] = elevation[k] * elevationScale;
        i += size;
        height += elevation[k] * elevationScale;
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
