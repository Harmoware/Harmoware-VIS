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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Layer } from 'deck.gl';
import { GL, Model, Geometry } from 'luma.gl';
import vs from './depots-arc-layer-vertex.glsl';
import fs from './depots-arc-layer-fragment.glsl';
var DEFAULT_COLOR = [255, 255, 255, 255];
var DepotsArcLayer = /** @class */ (function (_super) {
    __extends(DepotsArcLayer, _super);
    function DepotsArcLayer(props) {
        return _super.call(this, props) || this;
    }
    DepotsArcLayer.prototype.getShaders = function () {
        return { vs: vs, fs: fs };
    };
    DepotsArcLayer.prototype.initializeState = function () {
        var gl = this.context.gl;
        this.setState({ model: this.getModel(gl) });
        var attributeManager = this.state.attributeManager;
        /* eslint-disable max-len */
        attributeManager.addInstanced({
            instancePositions: { size: 4, accessor: ['getSourcePosition', 'getTargetPosition'], update: this.calculateInstancePositions },
            instanceSourceColors: { size: 4, type: GL.UNSIGNED_BYTE, accessor: 'getSourceColor', update: this.calculateInstanceSourceColors },
            instanceTargetColors: { size: 4, type: GL.UNSIGNED_BYTE, accessor: 'getTargetColor', update: this.calculateInstanceTargetColors },
            instanceStrokeWidths: { size: 1, accessor: 'getStrokeWidths', update: this.calculateInstanceStrokeWidths }
        });
        /* eslint-enable max-len */
    };
    DepotsArcLayer.prototype.getModel = function (gl) {
        var positions = [];
        var NUM_SEGMENTS = 50;
        /*
         *  (0, -1)-------------_(1, -1)
         *       |          _,-"  |
         *       o      _,-"      o
         *       |  _,-"          |
         *   (0, 1)"-------------(1, 1)
         */
        for (var i = 0; i < NUM_SEGMENTS; i += 1) {
            positions = positions.concat([i, -1, 0, i, 1, 0]);
        }
        var model = new Model(gl, Object.assign({}, this.getShaders(), {
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
    };
    DepotsArcLayer.prototype.calculateInstancePositions = function (attribute) {
        var _a = this.props, data = _a.data, getSourcePosition = _a.getSourcePosition, getTargetPosition = _a.getTargetPosition;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        data.forEach(function (object) {
            var sourcePosition = getSourcePosition(object);
            var targetPosition = getTargetPosition(object);
            value[i + 0] = sourcePosition[0];
            value[i + 1] = sourcePosition[1];
            value[i + 2] = targetPosition[0];
            value[i + 3] = targetPosition[1];
            i += size;
        });
    };
    DepotsArcLayer.prototype.calculateInstanceSourceColors = function (attribute) {
        var _a = this.props, data = _a.data, getSourceColor = _a.getSourceColor;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        data.forEach(function (object) {
            var color = getSourceColor(object);
            value[i + 0] = color[0];
            value[i + 1] = color[1];
            value[i + 2] = color[2];
            value[i + 3] = isNaN(color[3]) ? 255 : color[3];
            i += size;
        });
    };
    DepotsArcLayer.prototype.calculateInstanceTargetColors = function (attribute) {
        var _a = this.props, data = _a.data, getTargetColor = _a.getTargetColor;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        data.forEach(function (object) {
            var color = getTargetColor(object);
            value[i + 0] = color[0];
            value[i + 1] = color[1];
            value[i + 2] = color[2];
            value[i + 3] = isNaN(color[3]) ? 255 : color[3];
            i += size;
        });
    };
    DepotsArcLayer.prototype.calculateInstanceStrokeWidths = function (attribute) {
        var _a = this.props, data = _a.data, getStrokeWidths = _a.getStrokeWidths;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        data.forEach(function (object) {
            var strokeWidth = getStrokeWidths(object);
            value[i] = isNaN(strokeWidth) ? 1 : strokeWidth;
            i += size;
        });
    };
    DepotsArcLayer.defaultProps = {
        getSourcePosition: function (x) { return x.sourcePosition; },
        getTargetPosition: function (x) { return x.targetPosition; },
        getSourceColor: function (x) { return x.color || DEFAULT_COLOR; },
        getTargetColor: function (x) { return x.color || DEFAULT_COLOR; },
        getStrokeWidths: function (x) { return x.strokeWidth || 1; }
    };
    DepotsArcLayer.layerName = 'DepotsArcLayer';
    return DepotsArcLayer;
}(Layer));
export default DepotsArcLayer;
//# sourceMappingURL=index.js.map