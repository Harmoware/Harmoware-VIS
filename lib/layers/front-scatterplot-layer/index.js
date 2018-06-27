'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _maxSafeInteger = require('babel-runtime/core-js/number/max-safe-integer');

var _maxSafeInteger2 = _interopRequireDefault(_maxSafeInteger);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _deck = require('deck.gl');

var _luma = require('luma.gl');

var _get = require('./get');

var _get2 = _interopRequireDefault(_get);

var _frontScatterplotLayerVertex = require('./front-scatterplot-layer-vertex.glsl');

var _frontScatterplotLayerVertex2 = _interopRequireDefault(_frontScatterplotLayerVertex);

var _frontScatterplotLayerFragment = require('./front-scatterplot-layer-fragment.glsl');

var _frontScatterplotLayerFragment2 = _interopRequireDefault(_frontScatterplotLayerFragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_COLOR = [255, 255, 255, 255];

// Copyright (c) 2015 - 2017 Uber Technologies, Inc.

var FrontScatterplotLayer = function (_Layer) {
  (0, _inherits3.default)(FrontScatterplotLayer, _Layer);

  function FrontScatterplotLayer() {
    (0, _classCallCheck3.default)(this, FrontScatterplotLayer);
    return (0, _possibleConstructorReturn3.default)(this, (FrontScatterplotLayer.__proto__ || (0, _getPrototypeOf2.default)(FrontScatterplotLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(FrontScatterplotLayer, [{
    key: 'getShaders',
    value: function getShaders() {
      var shaderCache = this.context.shaderCache;

      return { vs: _frontScatterplotLayerVertex2.default, fs: _frontScatterplotLayerFragment2.default, shaderCache: shaderCache }; // 'project' module added by default.
    }
  }, {
    key: 'initializeState',
    value: function initializeState() {
      var gl = this.context.gl;

      this.setState({ model: this.getModel(gl) });

      /* eslint-disable max-len */
      this.state.attributeManager.addInstanced({
        instancePositions: { size: 3, accessor: 'getPosition', update: this.calculateInstancePositions },
        instanceRadius: { size: 1, accessor: 'getRadius', defaultValue: 1, update: this.calculateInstanceRadius },
        instanceColors: { size: 4, type: _luma.GL.UNSIGNED_BYTE, accessor: 'getColor', update: this.calculateInstanceColors }
      });
      /* eslint-enable max-len */
    }
  }, {
    key: 'draw',
    value: function draw(_ref) {
      var uniforms = _ref.uniforms;
      var _props = this.props,
          radiusScale = _props.radiusScale,
          radiusMinPixels = _props.radiusMinPixels,
          radiusMaxPixels = _props.radiusMaxPixels;

      this.state.model.render((0, _assign2.default)({}, uniforms, {
        outline: 0,
        strokeWidth: 0,
        radiusScale: radiusScale,
        radiusMinPixels: radiusMinPixels,
        radiusMaxPixels: radiusMaxPixels
      }));
    }
  }, {
    key: 'getModel',
    value: function getModel(gl) {
      // a square that minimally cover the unit circle
      var positions = [-1, -1, 0, -1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 0, -1, -1, 0, -1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1];

      return new _luma.Model(gl, (0, _assign2.default)({}, this.getShaders(), {
        geometry: new _luma.Geometry({
          drawMode: _luma.GL.TRIANGLES,
          positions: new Float32Array(positions)
        }),
        isInstanced: true,
        shaderCache: this.context.shaderCache
      }));
    }
  }, {
    key: 'calculateInstancePositions',
    value: function calculateInstancePositions(attribute) {
      var _props2 = this.props,
          data = _props2.data,
          getPosition = _props2.getPosition;
      var value = attribute.value,
          size = attribute.size;

      var i = 0;
      data.forEach(function (point) {
        var position = getPosition(point);
        value[i + 0] = (0, _get2.default)(position, 0);
        value[i + 1] = (0, _get2.default)(position, 1);
        value[i + 2] = (0, _get2.default)(position, 2) || 0;
        i += size;
      });
    }
  }, {
    key: 'calculateInstanceRadius',
    value: function calculateInstanceRadius(attribute) {
      var _props3 = this.props,
          data = _props3.data,
          getRadius = _props3.getRadius;
      var value = attribute.value,
          size = attribute.size;

      var i = 0;
      data.forEach(function (point) {
        var radius = getRadius(point);
        value[i] = isNaN(radius) ? 1 : radius;
        i += size;
      });
    }
  }, {
    key: 'calculateInstanceColors',
    value: function calculateInstanceColors(attribute) {
      var _props4 = this.props,
          data = _props4.data,
          getColor = _props4.getColor;
      var value = attribute.value,
          size = attribute.size;

      var i = 0;
      data.forEach(function (point) {
        var color = getColor(point) || DEFAULT_COLOR;
        value[i + 0] = (0, _get2.default)(color, 0);
        value[i + 1] = (0, _get2.default)(color, 1);
        value[i + 2] = (0, _get2.default)(color, 2);
        value[i + 3] = isNaN((0, _get2.default)(color, 3)) ? 255 : (0, _get2.default)(color, 3);
        i += size;
      });
    }
  }]);
  return FrontScatterplotLayer;
}(_deck.Layer);

FrontScatterplotLayer.defaultProps = {
  radiusScale: 1,
  radiusMinPixels: 0, //  min point radius in pixels
  radiusMaxPixels: _maxSafeInteger2.default, // max point radius in pixels
  getPosition: function getPosition(x) {
    return x.position;
  },
  getRadius: function getRadius(x) {
    return x.radius || 1;
  },
  getColor: function getColor(x) {
    return x.color || DEFAULT_COLOR;
  }
};
FrontScatterplotLayer.layerName = 'FrontScatterplotLayer';
exports.default = FrontScatterplotLayer;