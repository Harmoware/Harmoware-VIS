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
import vertex from './enhanced-arc-layer-vertex.glsl';
import fragment from './enhanced-arc-layer-fragment.glsl';
import { COLOR1 } from '../../constants/settings';
var EnhancedArcLayer = /** @class */ (function (_super) {
    __extends(EnhancedArcLayer, _super);
    function EnhancedArcLayer(props) {
        return _super.call(this, props) || this;
    }
    EnhancedArcLayer.prototype.getShaders = function () {
        return { vs: vertex, fs: fragment };
    };
    EnhancedArcLayer.prototype.initializeState = function () {
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
    EnhancedArcLayer.prototype.getModel = function (gl) {
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
    };
    EnhancedArcLayer.prototype.calculateInstancePositions = function (attribute) {
        var _a = this.props, data = _a.data, getSourcePosition = _a.getSourcePosition, getTargetPosition = _a.getTargetPosition;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        for (var j = 0, lengthj = data.length; j < lengthj; j += 1) {
            var sourcePosition = getSourcePosition(data[j]);
            var targetPosition = getTargetPosition(data[j]);
            value[i + 0] = sourcePosition[0];
            value[i + 1] = sourcePosition[1];
            value[i + 2] = targetPosition[0];
            value[i + 3] = targetPosition[1];
            i += size;
        }
    };
    EnhancedArcLayer.prototype.calculateInstanceSourceColors = function (attribute) {
        var _a = this.props, data = _a.data, getSourceColor = _a.getSourceColor;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        for (var j = 0, lengthj = data.length; j < lengthj; j += 1) {
            var color = getSourceColor(data[j]);
            value[i + 0] = color[0];
            value[i + 1] = color[1];
            value[i + 2] = color[2];
            value[i + 3] = isNaN(color[3]) ? 255 : color[3];
            i += size;
        }
    };
    EnhancedArcLayer.prototype.calculateInstanceTargetColors = function (attribute) {
        var _a = this.props, data = _a.data, getTargetColor = _a.getTargetColor;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        for (var j = 0, lengthj = data.length; j < lengthj; j += 1) {
            var color = getTargetColor(data[j]);
            value[i + 0] = color[0];
            value[i + 1] = color[1];
            value[i + 2] = color[2];
            value[i + 3] = isNaN(color[3]) ? 255 : color[3];
            i += size;
        }
    };
    EnhancedArcLayer.prototype.calculateInstanceStrokeWidths = function (attribute) {
        var _a = this.props, data = _a.data, getStrokeWidths = _a.getStrokeWidths;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        for (var j = 0, lengthj = data.length; j < lengthj; j += 1) {
            var strokeWidth = getStrokeWidths(data[j]);
            value[i] = isNaN(strokeWidth) ? 1 : strokeWidth;
            i += size;
        }
    };
    EnhancedArcLayer.defaultProps = {
        visible: true,
        opacity: 0.75,
        getSourcePosition: function (x) { return x.sourcePosition; },
        getTargetPosition: function (x) { return x.targetPosition; },
        getSourceColor: function (x) { return x.sourceColor || x.color || COLOR1; },
        getTargetColor: function (x) { return x.targetColor || x.color || COLOR1; },
        getStrokeWidths: function (x) { return x.strokeWidth || 1; }
    };
    EnhancedArcLayer.layerName = 'EnhancedArcLayer';
    return EnhancedArcLayer;
}(Layer));
export default EnhancedArcLayer;
//# sourceMappingURL=index.js.map