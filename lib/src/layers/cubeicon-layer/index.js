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
import { Layer } from '@deck.gl/core';
import GL from 'luma.gl/constants';
import { Model, CubeGeometry } from 'luma.gl';
import vertex from './cubeicon-layer-vertex.glsl';
import fragment from './cubeicon-layer-fragment.glsl';
var DEFAULT_COLOR = [255, 255, 255, 255];
var CubeiconLayer = /** @class */ (function (_super) {
    __extends(CubeiconLayer, _super);
    function CubeiconLayer(props) {
        return _super.call(this, props) || this;
    }
    CubeiconLayer.prototype.getShaders = function () {
        var shaderCache = this.context.shaderCache;
        return { vs: vertex, fs: fragment, modules: ['lighting', 'picking'], shaderCache: shaderCache };
    };
    CubeiconLayer.prototype.initializeState = function () {
        var gl = this.context.gl;
        this.setState({ model: this.getModel(gl) });
        var attributeManager = this.state.attributeManager;
        attributeManager.addInstanced({
            instancePositions: { size: 4, update: this.calculateInstancePositions },
            instanceColors: { size: 4, type: GL.UNSIGNED_BYTE, update: this.calculateInstanceColors }
        });
    };
    CubeiconLayer.prototype.updateState = function (_a) {
        var props = _a.props, oldProps = _a.oldProps, changeFlags = _a.changeFlags;
        _super.prototype.updateState.call(this, { props: props, oldProps: oldProps, changeFlags: changeFlags });
        this.updateUniforms();
    };
    CubeiconLayer.prototype.getModel = function (gl) {
        return new Model(gl, Object.assign({}, this.getShaders(), {
            //      id: this.props.id,
            geometry: new CubeGeometry(),
            isInstanced: true,
            shaderCache: this.context.shaderCache
        }));
    };
    CubeiconLayer.prototype.updateUniforms = function () {
        var _a = this.props, opacity = _a.opacity, extruded = _a.extruded, coverage = _a.coverage, lightSettings = _a.lightSettings;
        this.setUniforms(Object.assign({}, {
            extruded: extruded,
            opacity: opacity,
            coverage: coverage
        }, lightSettings));
    };
    CubeiconLayer.prototype.getNumInstances = function (props) {
        var data = (props || this.props).data;
        return data.length;
    };
    CubeiconLayer.prototype.draw = function () {
        var cellSize = this.props.cellSize;
        _super.prototype.draw.call(this, { uniforms: Object.assign({
                cellSize: cellSize
            }) });
    };
    CubeiconLayer.prototype.calculateInstancePositions = function (attribute) {
        var _a = this.props, data = _a.data, getPosition = _a.getPosition, getHeight = _a.getHeight, cellSize = _a.cellSize, heightScale = _a.heightScale;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        for (var j = 0; j < data.length; j += 1) {
            var position = getPosition(data[j]);
            value[i + 0] = position[0];
            value[i + 1] = position[1];
            value[i + 2] = position[2] || 0;
            value[i + 3] = (getHeight(data[j]) || cellSize) * heightScale;
            i += size;
        }
    };
    CubeiconLayer.prototype.calculateInstanceColors = function (attribute) {
        var _a = this.props, data = _a.data, getColor = _a.getColor;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        for (var j = 0; j < data.length; j += 1) {
            var color = getColor(data[j]) || DEFAULT_COLOR;
            for (var k = 0; k < size; k += 1) {
                if (color[k] === undefined) {
                    value[i + k] = DEFAULT_COLOR[k];
                }
                else {
                    value[i + k] = Number.isFinite(color[k]) ? color[k] : DEFAULT_COLOR[k];
                }
            }
            i += size;
        }
    };
    CubeiconLayer.defaultProps = {
        visible: true,
        cellSize: 12,
        coverage: 1,
        heightScale: 1,
        opacity: 0.25,
        extruded: true,
        fp64: false,
        lightSettings: {},
        getPosition: function (x) { return x.position; },
        getHeight: function (x) { return x.height; },
        getColor: function (x) { return x.color; },
    };
    CubeiconLayer.layerName = 'CubeiconLayer';
    return CubeiconLayer;
}(Layer));
export default CubeiconLayer;
//# sourceMappingURL=index.js.map