// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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
import get from './get';
import vs from './front-scatterplot-layer-vertex.glsl';
import fs from './front-scatterplot-layer-fragment.glsl';
var DEFAULT_COLOR = [255, 255, 255, 255];
var FrontScatterplotLayer = /** @class */ (function (_super) {
    __extends(FrontScatterplotLayer, _super);
    function FrontScatterplotLayer(props) {
        return _super.call(this, props) || this;
    }
    FrontScatterplotLayer.prototype.getShaders = function () {
        var shaderCache = this.context.shaderCache;
        return { vs: vs, fs: fs, shaderCache: shaderCache }; // 'project' module added by default.
    };
    FrontScatterplotLayer.prototype.initializeState = function () {
        var gl = this.context.gl;
        this.setState({ model: this.getModel(gl) });
        /* eslint-disable max-len */
        this.state.attributeManager.addInstanced({
            instancePositions: { size: 3, accessor: 'getPosition', update: this.calculateInstancePositions },
            instanceRadius: { size: 1, accessor: 'getRadius', defaultValue: 1, update: this.calculateInstanceRadius },
            instanceColors: { size: 4, type: GL.UNSIGNED_BYTE, accessor: 'getColor', update: this.calculateInstanceColors }
        });
        /* eslint-enable max-len */
    };
    FrontScatterplotLayer.prototype.draw = function (_a) {
        var uniforms = _a.uniforms;
        var _b = this.props, radiusScale = _b.radiusScale, radiusMinPixels = _b.radiusMinPixels, radiusMaxPixels = _b.radiusMaxPixels;
        this.state.model.render(Object.assign({}, uniforms, {
            outline: 0,
            strokeWidth: 0,
            radiusScale: radiusScale,
            radiusMinPixels: radiusMinPixels,
            radiusMaxPixels: radiusMaxPixels
        }));
    };
    FrontScatterplotLayer.prototype.getModel = function (gl) {
        // a square that minimally cover the unit circle
        var positions = [
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
    };
    FrontScatterplotLayer.prototype.calculateInstancePositions = function (attribute) {
        var _a = this.props, data = _a.data, getPosition = _a.getPosition;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        data.forEach(function (point) {
            var position = getPosition(point);
            value[i + 0] = (get(position, 0));
            value[i + 1] = (get(position, 1));
            value[i + 2] = (get(position, 2)) || 0;
            i += size;
        });
    };
    FrontScatterplotLayer.prototype.calculateInstanceRadius = function (attribute) {
        var _a = this.props, data = _a.data, getRadius = _a.getRadius;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        data.forEach(function (point) {
            var radius = getRadius(point);
            value[i] = isNaN(radius) ? 1 : radius;
            i += size;
        });
    };
    FrontScatterplotLayer.prototype.calculateInstanceColors = function (attribute) {
        var _a = this.props, data = _a.data, getColor = _a.getColor;
        var value = attribute.value, size = attribute.size;
        var i = 0;
        data.forEach(function (point) {
            var color = getColor(point) || DEFAULT_COLOR;
            value[i + 0] = (get(color, 0));
            value[i + 1] = (get(color, 1));
            value[i + 2] = (get(color, 2));
            value[i + 3] = isNaN(get(color, 3)) ? 255 : (get(color, 3));
            i += size;
        });
    };
    FrontScatterplotLayer.defaultProps = {
        radiusScale: 1,
        radiusMinPixels: 0,
        radiusMaxPixels: Number.MAX_SAFE_INTEGER,
        getPosition: function (x) { return x.position; },
        getRadius: function (x) { return x.radius || 1; },
        getColor: function (x) { return x.color || DEFAULT_COLOR; }
    };
    FrontScatterplotLayer.layerName = 'FrontScatterplotLayer';
    return FrontScatterplotLayer;
}(Layer));
export default FrontScatterplotLayer;
//# sourceMappingURL=index.js.map