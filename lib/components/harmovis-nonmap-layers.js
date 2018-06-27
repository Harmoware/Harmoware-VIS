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

var _reactDom = require('react-dom');

var _reactMapGl = require('react-map-gl');

var _reactMapGl2 = _interopRequireDefault(_reactMapGl);

var _deck = require('deck.gl');

var _deck2 = _interopRequireDefault(_deck);

var _orbitControl = require('./orbit-control');

var _orbitControl2 = _interopRequireDefault(_orbitControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HarmoVisNonMapLayers = function (_React$Component) {
  (0, _inherits3.default)(HarmoVisNonMapLayers, _React$Component);

  function HarmoVisNonMapLayers() {
    (0, _classCallCheck3.default)(this, HarmoVisNonMapLayers);
    return (0, _possibleConstructorReturn3.default)(this, (HarmoVisNonMapLayers.__proto__ || (0, _getPrototypeOf2.default)(HarmoVisNonMapLayers)).apply(this, arguments));
  }

  (0, _createClass3.default)(HarmoVisNonMapLayers, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.actions.setNonmapView(true);
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
      var _this2 = this;

      var _props = this.props,
          viewport = _props.viewport,
          actions = _props.actions,
          layers = _props.layers;

      var onChangeViewport = this.props.onChangeViewport || actions.setViewport;
      var width = viewport.width,
          height = viewport.height;

      var glViewport = _orbitControl2.default.getViewport(viewport);

      return _react2.default.createElement(
        _orbitControl2.default,
        (0, _extends3.default)({}, viewport, {
          ref: function ref(canvas) {
            _this2.canvas = canvas;
          },
          onViewportChange: onChangeViewport
        }),
        _react2.default.createElement(_deck2.default, {
          width: width, height: height, viewport: glViewport,
          layers: layers, onWebGLInitialized: this.initialize
        })
      );
    }
  }]);
  return HarmoVisNonMapLayers;
}(_react2.default.Component);

exports.default = HarmoVisNonMapLayers;