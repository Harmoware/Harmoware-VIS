'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMapGl = require('react-map-gl');

var _reactMapGl2 = _interopRequireDefault(_reactMapGl);

var _deck = require('deck.gl');

var _deck2 = _interopRequireDefault(_deck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HarmoVisLayers = function (_React$Component) {
  (0, _inherits3.default)(HarmoVisLayers, _React$Component);

  function HarmoVisLayers() {
    (0, _classCallCheck3.default)(this, HarmoVisLayers);
    return (0, _possibleConstructorReturn3.default)(this, (HarmoVisLayers.__proto__ || (0, _getPrototypeOf2.default)(HarmoVisLayers)).apply(this, arguments));
  }

  (0, _createClass3.default)(HarmoVisLayers, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.actions.setNonmapView(false);
    }
  }, {
    key: 'initialize',
    value: function initialize(gl) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          viewport = _props.viewport,
          mapStyle = _props.mapStyle,
          actions = _props.actions,
          mapboxApiAccessToken = _props.mapboxApiAccessToken,
          layers = _props.layers;

      var onChangeViewport = this.props.onChangeViewport || actions.setViewport;

      return _react2.default.createElement(
        _reactMapGl2.default,
        (0, _extends3.default)({}, viewport, { mapStyle: mapStyle, perspectiveEnabled: true,
          onChangeViewport: onChangeViewport,
          mapboxApiAccessToken: mapboxApiAccessToken
        }),
        _react2.default.createElement(_deck2.default, (0, _extends3.default)({}, viewport, { layers: layers, onWebGLInitialized: this.initialize }))
      );
    }
  }]);
  return HarmoVisLayers;
}(_react2.default.Component);

HarmoVisLayers.defaultProps = {
  mapStyle: 'mapbox://styles/mapbox/dark-v8'
};
exports.default = HarmoVisLayers;