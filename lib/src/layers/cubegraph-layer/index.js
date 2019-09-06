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
import vertex from './cubegraph-layer-vertex.glsl';
import fragment from './cubegraph-layer-fragment.glsl';
var DEFAULT_COLOR = [255, 255, 255, 255];
var CubeGraphLayer = /** @class */ (function (_super) {
    __extends(CubeGraphLayer, _super);
    function CubeGraphLayer(props) {
        return _super.call(this, props) || this;
    }
    CubeGraphLayer.prototype.getShaders = function () {
        var shaderCache = this.context.shaderCache;
        return { vs: vertex, fs: fragment, modules: ['lighting', 'picking'], shaderCache: shaderCache };
    };
    CubeGraphLayer.prototype.initializeState = function () {
        var gl = this.context.gl;
        this.setState({ model: this.getModel(gl) });
        var attributeManager = this.state.attributeManager;
        attributeManager.addInstanced({
            instancePositions: { size: 4, update: this.calculateInstancePositions },
            instanceColors: { size: 4, type: GL.UNSIGNED_BYTE, update: this.calculateInstanceColors }
        });
    };
    CubeGraphLayer.prototype.updateState = function (_a) {
        var props = _a.props, oldProps = _a.oldProps, changeFlags = _a.changeFlags;
        _super.prototype.updateState.call(this, { props: props, oldProps: oldProps, changeFlags: changeFlags });
        this.updateUniforms();
    };
    CubeGraphLayer.prototype.getModel = function (gl) {
        return new Model(gl, Object.assign({}, this.getShaders(), {
            //      id: this.props.id,
            geometry: new CubeGeometry(),
            isInstanced: true,
            shaderCache: this.context.shaderCache
        }));
    };
    CubeGraphLayer.prototype.updateUniforms = function () {
        var _a = this.props, opacity = _a.opacity, extruded = _a.extruded, coverage = _a.coverage, lightSettings = _a.lightSettings;
        this.setUniforms(Object.assign({}, {
            extruded: extruded,
            opacity: opacity,
            coverage: coverage
        }, lightSettings));
    };
    CubeGraphLayer.prototype.getNumInstances = function (props) {
        var _a = props || this.props, data = _a.data, getElevation = _a.getElevation;
        return data.reduce(function (v, d) { return v + (getElevation(d) || [0]).length; }, 0);
    };
    CubeGraphLayer.prototype.draw = function () {
        var cellSize = this.props.cellSize;
        _super.prototype.draw.call(this, { uniforms: Object.assign({
                cellSize: cellSize
            }) });
    };
    CubeGraphLayer.prototype.calculateInstancePositions = function (attribute) {
        var _a = this.props, data = _a.data, getPosition = _a.getPosition, getElevation = _a.getElevation, getRadius = _a.getRadius, elevationScale = _a.elevationScale, stacking1 = _a.stacking1, stacking2 = _a.stacking2, optionShiftLng = _a.optionShiftLng, optionShiftLat = _a.optionShiftLat, degreesMeterLng = _a.degreesMeterLng, degreesMeterLat = _a.degreesMeterLat;
        var value = attribute.value, size = attribute.size;
        var pm = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        var i = 0;
        for (var j = 0; j < data.length; j += 1) {
            var position = getPosition(data[j]);
            if (typeof position === 'undefined')
                continue;
            var height = position[2] || 0;
            var elevation = getElevation(data[j]) || [0];
            var elevationlength = elevation.length;
            var radius = degreesMeterLng || degreesMeterLat ? getRadius(data[j]) : 0;
            var shiftLng = stacking1 ? 0 : (degreesMeterLng * radius) + optionShiftLng;
            var shiftLat = stacking1 || stacking2 ? 0 : (degreesMeterLat * radius) + optionShiftLat;
            for (var k = 0; k < elevationlength; k += 1) {
                var elevationValue = elevation[k] * elevationScale;
                if (stacking1) {
                    value[i + 0] = position[0];
                    value[i + 1] = position[1];
                    value[i + 2] = height;
                    value[i + 3] = elevationValue;
                    i += size;
                    height += elevationValue;
                }
                else if (stacking2) {
                    if (k < 2) {
                        value[i + 0] = position[0] + shiftLng;
                        value[i + 1] = position[1] + optionShiftLat;
                        value[i + 2] = height;
                        value[i + 3] = elevationValue;
                    }
                    else {
                        if (k === 2)
                            height = position[2] || 0;
                        value[i + 0] = position[0] - shiftLng;
                        value[i + 1] = position[1] - optionShiftLat;
                        value[i + 2] = height;
                        value[i + 3] = elevationValue;
                    }
                    i += size;
                    height += elevationValue;
                }
                else {
                    value[i + 0] = position[0] + (pm[k][0] * shiftLng);
                    value[i + 1] = position[1] + (pm[k][1] * shiftLat);
                    value[i + 2] = position[2] || 0;
                    value[i + 3] = elevationValue;
                    i += size;
                }
            }
        }
    };
    CubeGraphLayer.prototype.calculateInstanceColors = function (attribute) {
        var _a = this.props, data = _a.data, getColor = _a.getColor, getElevation = _a.getElevation;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        for (var j = 0; j < data.length; j += 1) {
            var color = getColor(data[j]) || [DEFAULT_COLOR];
            var elevation = getElevation(data[j]) || [0];
            for (var k = 0; k < elevation.length; k += 1) {
                for (var l = 0; l < DEFAULT_COLOR.length; l += 1) {
                    if (color[k] === undefined) {
                        value[i + l] = DEFAULT_COLOR[l];
                    }
                    else {
                        value[i + l] = Number.isFinite(color[k][l]) ? color[k][l] : DEFAULT_COLOR[l];
                    }
                }
                i += size;
            }
        }
    };
    CubeGraphLayer.defaultProps = {
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
        getPosition: function (x) { return x.position; },
        getElevation: function (x) { return x.elevation; },
        getColor: function (x) { return x.color; },
        getRadius: function (x) { return x.radius || 30; },
    };
    CubeGraphLayer.layerName = 'CubeGraphLayer';
    return CubeGraphLayer;
}(Layer));
export default CubeGraphLayer;
//# sourceMappingURL=index.js.map