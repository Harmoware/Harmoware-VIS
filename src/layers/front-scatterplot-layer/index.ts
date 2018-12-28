// Copyright (c) 2015 - 2017 Uber Technologies, Inc.

import { Layer, LayerProps, experimental, AttributeManager } from 'deck.gl';
import { GL, Model, Geometry } from 'luma.gl';
import vs from './front-scatterplot-layer-vertex.glsl';
import fs from './front-scatterplot-layer-fragment.glsl';
import { EventInfo } from '../../types';

const DEFAULT_COLOR = [255, 255, 255, 255];
const { get } = experimental;

type Data  = {
  position: number[],
  radius: number,
  color: (number | number[])[],
};

interface Props extends LayerProps {
  data: Data[],
  radiusScale?: number,
  radiusMinPixels?: number,
  radiusMaxPixels?: number,
  getPosition?: (x) => number[],
  getRadius?: (x) => number,
  getColor?: (x) => number[],
}
interface State {
  attributeManager: AttributeManager,
  model: Model,
}
interface Attribute {
  value: number[],
  size: number
}

export default class FrontScatterplotLayer extends Layer<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  static defaultProps = {
    radiusScale: 1,
    radiusMinPixels: 0, //  min point radius in pixels
    radiusMaxPixels: Number.MAX_SAFE_INTEGER, // max point radius in pixels
    getPosition: (x: Data) => x.position,
    getRadius: (x: Data) => x.radius || 1,
    getColor: (x: Data) => x.color || DEFAULT_COLOR
  };

  static layerName = 'FrontScatterplotLayer';

  getShaders() {
    const { shaderCache } = this.context;
    return { vs, fs, shaderCache }; // 'project' module added by default.
  }

  initializeState() {
    const { gl } = this.context as { gl: WebGLRenderingContext };
    this.setState({ model: this.getModel(gl) });

    /* eslint-disable max-len */
    this.state.attributeManager.addInstanced({
      instancePositions: { size: 3, accessor: 'getPosition', update: this.calculateInstancePositions },
      instanceRadius: { size: 1, accessor: 'getRadius', defaultValue: 1, update: this.calculateInstanceRadius },
      instanceColors: { size: 4, type: GL.UNSIGNED_BYTE, accessor: 'getColor', update: this.calculateInstanceColors }
    });
    /* eslint-enable max-len */
  }

  draw({ uniforms }) {
    const { radiusScale, radiusMinPixels, radiusMaxPixels } = this.props;
    this.state.model.render(Object.assign({}, uniforms, {
      outline: 0,
      strokeWidth: 0,
      radiusScale,
      radiusMinPixels,
      radiusMaxPixels
    }));
  }

  getModel(gl: WebGLRenderingContext): Model {
    // a square that minimally cover the unit circle
    const positions = [
      -1, -1, 0, -1, 1, 0, 1, 1, 0,
      -1, -1, 0, 1, -1, 0, 1, 1, 0,
      -1, 0, -1, -1, 0, 1, 1, 0, 1,
      -1, 0, -1, 1, 0, -1, 1, 0, 1,
      0, -1, -1, 0, -1, 1, 0, 1, 1,
      0, -1, -1, 0, 1, -1, 0, 1, 1,
    ];

    return new Model(gl, Object.assign({}, this.getShaders(), {
      geometry: new Geometry({
        drawMode: GL.TRIANGLES,
        positions: new Float32Array(positions)
      }),
      isInstanced: true,
      shaderCache: this.context.shaderCache
    }));
  }

  calculateInstancePositions(attribute: Attribute) {
    const { data, getPosition } = this.props;
    const { value, size } = attribute;
    let i = 0;
    data.forEach((point) => {
      const position = getPosition(point);
      value[i + 0] = (get(position, 0));
      value[i + 1] = (get(position, 1));
      value[i + 2] = (get(position, 2)) || 0;
      i += size;
    });
  }

  calculateInstanceRadius(attribute: Attribute) {
    const { data, getRadius } = this.props;
    const { value, size } = attribute;
    let i = 0;
    data.forEach((point) => {
      const radius = getRadius(point);
      value[i] = isNaN(radius) ? 1 : radius;
      i += size;
    });
  }

  calculateInstanceColors(attribute: Attribute) {
    const { data, getColor } = this.props;
    const { value, size } = attribute;
    let i = 0;
    data.forEach((point) => {
      const color = getColor(point) || DEFAULT_COLOR;
      value[i + 0] = (get(color, 0));
      value[i + 1] = (get(color, 1));
      value[i + 2] = (get(color, 2));
      value[i + 3] = isNaN(get(color, 3)) ? 255 : (get(color, 3));
      i += size;
    });
  }
}
