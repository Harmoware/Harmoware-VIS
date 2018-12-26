// 2018 Harmoware-VIS DepotsArcLayer Modified version of ArcLayer
//
// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { Layer, AttributeManager } from 'deck.gl';
import { GL, Model, Geometry } from 'luma.gl';

import vs from './depots-arc-layer-vertex.glsl';
import fs from './depots-arc-layer-fragment.glsl';

import { Arcdata } from '../../types'

const DEFAULT_COLOR = [255, 255, 255, 255];

interface Props {
  id: string,
  data: Arcdata[],
  getSourcePosition?: (x: Arcdata) => number[],
  getTargetPosition?: (x: Arcdata) => number[],
  getSourceColor?: (x: Arcdata) => number[],
  getTargetColor?: (x: Arcdata) => number[],
  getStrokeWidths?: (x: Arcdata) => number,
}
interface State {
  attributeManager: AttributeManager,
  model: Model,
}
interface Attribute {
  value: number[],
  size: number
}

export default class DepotsArcLayer extends Layer<Props, State> {

  static defaultProps = {
    getSourcePosition: (x: Arcdata):number[] => x.sourcePosition,
    getTargetPosition: (x: Arcdata):number[] => x.targetPosition,
    getSourceColor: (x: Arcdata):number[] => x.color || DEFAULT_COLOR,
    getTargetColor: (x: Arcdata):number[] => x.color || DEFAULT_COLOR,
    getStrokeWidths: (x: Arcdata):number => x.strokeWidth || 1
  }

  static layerName = 'DepotsArcLayer';

  constructor(props) {
    super(props);
  }

  getShaders() {
    return { vs, fs };
  }

  initializeState() {
    const { gl } = this.context as { gl: WebGLRenderingContext };
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

  getModel(gl: WebGLRenderingContext): Model {
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
      id: this.props.id,
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

  calculateInstancePositions(attribute: Attribute) {
    const { data, getSourcePosition, getTargetPosition } = this.props;
    const { value, size } = attribute;
    let i = 0;
    data.forEach((object) => {
      const sourcePosition = getSourcePosition(object);
      const targetPosition = getTargetPosition(object);
      value[i + 0] = sourcePosition[0];
      value[i + 1] = sourcePosition[1];
      value[i + 2] = targetPosition[0];
      value[i + 3] = targetPosition[1];
      i += size;
    });
  }

  calculateInstanceSourceColors(attribute: Attribute) {
    const { data, getSourceColor } = this.props;
    const { value, size } = attribute;
    let i = 0;
    data.forEach((object) => {
      const color = getSourceColor(object);
      value[i + 0] = color[0];
      value[i + 1] = color[1];
      value[i + 2] = color[2];
      value[i + 3] = isNaN(color[3]) ? 255 : color[3];
      i += size;
    });
  }

  calculateInstanceTargetColors(attribute: Attribute) {
    const { data, getTargetColor } = this.props;
    const { value, size } = attribute;
    let i = 0;
    data.forEach((object) => {
      const color = getTargetColor(object);
      value[i + 0] = color[0];
      value[i + 1] = color[1];
      value[i + 2] = color[2];
      value[i + 3] = isNaN(color[3]) ? 255 : color[3];
      i += size;
    });
  }

  calculateInstanceStrokeWidths(attribute: Attribute) {
    const { data, getStrokeWidths } = this.props;
    const { value, size } = attribute;
    let i = 0;
    data.forEach((object) => {
      const strokeWidth = getStrokeWidths(object);
      value[i] = isNaN(strokeWidth) ? 1 : strokeWidth;
      i += size;
    });
  }
}
