

import { Layer, COORDINATE_SYSTEM } from 'deck.gl';
import { GL, Model, Geometry } from 'luma.gl';
import vertex from './enhanced-arc-layer-vertex.glsl';
import fragment from './enhanced-arc-layer-fragment.glsl';
import { COLOR1 } from '../../constants/settings';
import { Context } from '../../types';

type Data = {
  sourcePosition: Array<number>,
  targetPosition: Array<number>,
  sourceColor: Array<number>,
  targetColor: Array<number>,
  color: Array<number>,
  strokeWidth: number,
}

interface Props {
  id?: string,
  data?: Array<Data>,
  visible?: boolean,
  opacity?: number,
  getSourcePosition?: (x: any) => Array<number>,
  getTargetPosition?: (x: any) => Array<number>,
  getSourceColor?: (x: any) => Array<number>,
  getTargetColor?: (x: any) => Array<number>,
  getStrokeWidths?: (x: any) => number,
}
interface State {
  attributeManager: any,
}

export default class EnhancedArcLayer extends Layer<Props, State> {
  props: Props;
  state: State;
  context: Context;
  setState: (any) => void;

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    visible: true,
    opacity: 0.75,
    getSourcePosition: (x: Data) => x.sourcePosition,
    getTargetPosition: (x: Data) => x.targetPosition,
    getSourceColor: (x: Data) => x.sourceColor || x.color || COLOR1,
    getTargetColor: (x: Data) => x.targetColor || x.color || COLOR1,
    getStrokeWidths: (x: Data) => x.strokeWidth || 1
  };

  static layerName = 'EnhancedArcLayer';

  getShaders() {
    return { vs: vertex, fs: fragment };
  }

  initializeState() {
    const { gl } = this.context;
    this.setState({ model: this.getModel(gl) });

    const { attributeManager } = this.state;

    /* eslint-disable max-len */
    attributeManager.addInstanced({
      instancePositions: { size: 4, accessor: ['getSourcePosition', 'getTargetPosition'], update: this.calculateInstancePositions },
      instanceSourceColors: { size: 4, type: GL.UNSIGNED_BYTE, accessor: 'getSourceColor', update: this.calculateInstanceSourceColors },
      instanceTargetColors: { size: 4, type: GL.UNSIGNED_BYTE, accessor: 'getTargetColor', update: this.calculateInstanceTargetColors },
      instanceStrokeWidths: { size: 1, accessor: 'getStrokeWidths', update: this.calculateInstanceStrokeWidths }
    });
    /* eslint-enable max-len */
  }

  getModel(gl: any) {
    let positions = [];
    const NUM_SEGMENTS = 50;
    /*
     *  (0, -1)-------------_(1, -1)
     *       |          _,-"  |
     *       o      _,-"      o
     *       |  _,-"          |
     *   (0, 1)"-------------(1, 1)
     */
    for (let i = 0; i < NUM_SEGMENTS; i += 1) {
      positions = positions.concat([i, -1, 0, i, 1, 0]);
    }

    const model = new Model(gl, Object.assign({}, this.getShaders(), {
      // id: this.props.id,
      geometry: new Geometry({
        drawMode: GL.TRIANGLE_STRIP,
        positions: new Float32Array(positions)
      }),
      isInstanced: true,
      shaderCache: this.context.shaderCache
    }));

    model.setUniforms({ numSegments: NUM_SEGMENTS });

    return model;
  }

  calculateInstancePositions(attribute: { value: Array<number>, size: number }) {
    const { data, getSourcePosition, getTargetPosition } = this.props;
    const { value, size } = attribute;
    let i = 0;
    for (let j = 0, lengthj = data.length; j < lengthj; j += 1) {
      const sourcePosition = getSourcePosition(data[j]);
      const targetPosition = getTargetPosition(data[j]);
      value[i + 0] = sourcePosition[0];
      value[i + 1] = sourcePosition[1];
      value[i + 2] = targetPosition[0];
      value[i + 3] = targetPosition[1];
      i += size;
    }
  }

  calculateInstanceSourceColors(attribute: { value: Array<number>, size: number }) {
    const { data, getSourceColor } = this.props;
    const { value, size } = attribute;
    let i = 0;
    for (let j = 0, lengthj = data.length; j < lengthj; j += 1) {
      const color = getSourceColor(data[j]);
      value[i + 0] = color[0];
      value[i + 1] = color[1];
      value[i + 2] = color[2];
      value[i + 3] = isNaN(color[3]) ? 255 : color[3];
      i += size;
    }
  }

  calculateInstanceTargetColors(attribute: { value: Array<number>, size: number }) {
    const { data, getTargetColor } = this.props;
    const { value, size } = attribute;
    let i = 0;
    for (let j = 0, lengthj = data.length; j < lengthj; j += 1) {
      const color = getTargetColor(data[j]);
      value[i + 0] = color[0];
      value[i + 1] = color[1];
      value[i + 2] = color[2];
      value[i + 3] = isNaN(color[3]) ? 255 : color[3];
      i += size;
    }
  }

  calculateInstanceStrokeWidths(attribute: { value: Array<number>, size: number }) {
    const { data, getStrokeWidths } = this.props;
    const { value, size } = attribute;
    let i = 0;
    for (let j = 0, lengthj = data.length; j < lengthj; j += 1) {
      const strokeWidth = getStrokeWidths(data[j]);
      value[i] = isNaN(strokeWidth) ? 1 : strokeWidth;
      i += size;
    }
  }
}
