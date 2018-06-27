'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFinite = require('babel-runtime/core-js/number/is-finite');

var _isFinite2 = _interopRequireDefault(_isFinite);

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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _deck = require('deck.gl');

var _luma = require('luma.gl');

var _cubeiconLayerVertex = require('./cubeicon-layer-vertex.glsl');

var _cubeiconLayerVertex2 = _interopRequireDefault(_cubeiconLayerVertex);

var _cubeiconLayerFragment = require('./cubeicon-layer-fragment.glsl');

var _cubeiconLayerFragment2 = _interopRequireDefault(_cubeiconLayerFragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _luma.registerShaderModules)([_luma.picking]);

var DEFAULT_COLOR = [255, 255, 255, 255];

var CubeiconLayer = function (_Layer) {
  (0, _inherits3.default)(CubeiconLayer, _Layer);

  function CubeiconLayer() {
    (0, _classCallCheck3.default)(this, CubeiconLayer);
    return (0, _possibleConstructorReturn3.default)(this, (CubeiconLayer.__proto__ || (0, _getPrototypeOf2.default)(CubeiconLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(CubeiconLayer, [{
    key: 'getShaders',
    value: function getShaders() {
      var shaderCache = this.context.shaderCache;

      return { vs: _cubeiconLayerVertex2.default, fs: _cubeiconLayerFragment2.default, modules: ['lighting', 'picking'], shaderCache: shaderCache };
    }
  }, {
    key: 'initializeState',
    value: function initializeState() {
      var gl = this.context.gl;

      this.setState({ model: this.getModel(gl) });

      var attributeManager = this.state.attributeManager;


      attributeManager.addInstanced({
        instancePositions: { size: 4, update: this.calculateInstancePositions },
        instanceColors: { size: 4, type: _luma.GL.UNSIGNED_BYTE, update: this.calculateInstanceColors }
      });
    }
  }, {
    key: 'updateState',
    value: function updateState(_ref) {
      var props = _ref.props,
          oldProps = _ref.oldProps,
          changeFlags = _ref.changeFlags;

      (0, _get3.default)(CubeiconLayer.prototype.__proto__ || (0, _getPrototypeOf2.default)(CubeiconLayer.prototype), 'updateState', this).call(this, { props: props, oldProps: oldProps, changeFlags: changeFlags });
      this.updateUniforms();
    }
  }, {
    key: 'getModel',
    value: function getModel(gl) {
      return new _luma.Model(gl, (0, _assign2.default)({}, this.getShaders(), {
        //      id: this.props.id,
        geometry: new _luma.CubeGeometry(),
        isInstanced: true,
        shaderCache: this.context.shaderCache
      }));
    }
  }, {
    key: 'updateUniforms',
    value: function updateUniforms() {
      var _props = this.props,
          opacity = _props.opacity,
          extruded = _props.extruded,
          coverage = _props.coverage,
          lightSettings = _props.lightSettings;


      this.setUniforms((0, _assign2.default)({}, {
        extruded: extruded,
        opacity: opacity,
        coverage: coverage
      }, lightSettings));
    }
  }, {
    key: 'getNumInstances',
    value: function getNumInstances(props) {
      var _ref2 = props || this.props,
          data = _ref2.data,
          getElevation = _ref2.getElevation;

      return data.reduce(function (v, d) {
        return v + (getElevation(d) || [0]).length;
      }, 0);
    }
  }, {
    key: 'draw',
    value: function draw(_ref3) {
      var uniforms = _ref3.uniforms;
      var cellSize = this.props.cellSize;

      (0, _get3.default)(CubeiconLayer.prototype.__proto__ || (0, _getPrototypeOf2.default)(CubeiconLayer.prototype), 'draw', this).call(this, { uniforms: (0, _assign2.default)({
          cellSize: cellSize
        }, uniforms) });
    }
  }, {
    key: 'calculateInstancePositions',
    value: function calculateInstancePositions(attribute) {
      var _props2 = this.props,
          data = _props2.data,
          getPosition = _props2.getPosition,
          getElevation = _props2.getElevation,
          elevationScale = _props2.elevationScale;
      var value = attribute.value,
          size = attribute.size;

      var i = 0;
      for (var j = 0; j < data.length; j += 1) {
        var _position = getPosition(data[j]);
        var height = 0;
        var _elevation = getElevation(data[j]) || [0];
        for (var k = 0; k < _elevation.length; k += 1) {
          value[i + 0] = _position[0];
          value[i + 1] = _position[1];
          value[i + 2] = height;
          value[i + 3] = _elevation[k] * elevationScale;
          i += size;
          height += _elevation[k] * elevationScale;
        }
      }
    }
  }, {
    key: 'calculateInstanceColors',
    value: function calculateInstanceColors(attribute) {
      var _props3 = this.props,
          data = _props3.data,
          getColor = _props3.getColor,
          getElevation = _props3.getElevation;
      var value = attribute.value,
          size = attribute.size;

      var i = 0;
      for (var j = 0; j < data.length; j += 1) {
        var _color = getColor(data[j]) || [DEFAULT_COLOR];
        var _elevation2 = getElevation(data[j]) || [0];
        for (var k = 0; k < _elevation2.length; k += 1) {
          for (var l = 0; l < DEFAULT_COLOR.length; l += 1) {
            if (_color[k] === undefined) {
              value[i + l] = DEFAULT_COLOR[l];
            } else {
              value[i + l] = (0, _isFinite2.default)(_color[k][l]) ? _color[k][l] : DEFAULT_COLOR[l];
            }
          }
          i += size;
        }
      }
    }
  }]);
  return CubeiconLayer;
}(_deck.Layer);

CubeiconLayer.defaultProps = {
  visible: true,
  cellSize: 12,
  coverage: 1,
  elevationScale: 1,
  opacity: 0.25,
  extruded: true,
  fp64: false,
  getPosition: function getPosition(x) {
    return x.position;
  }, // position:[longitude,latitude]
  getElevation: function getElevation(x) {
    return x.elevation;
  }, // elevation:[値-1,値-2,,,値-n]
  getColor: function getColor(x) {
    return x.color;
  } // color:[[rgba-1],[rgba-2],,,[rgba-n]]
};
CubeiconLayer.layerName = 'CubeiconLayer';
exports.default = CubeiconLayer;