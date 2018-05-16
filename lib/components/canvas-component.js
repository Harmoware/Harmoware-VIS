'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CanvasComponent = function (_Component) {
  (0, _inherits3.default)(CanvasComponent, _Component);

  function CanvasComponent() {
    (0, _classCallCheck3.default)(this, CanvasComponent);
    return (0, _possibleConstructorReturn3.default)(this, (CanvasComponent.__proto__ || (0, _getPrototypeOf2.default)(CanvasComponent)).apply(this, arguments));
  }

  (0, _createClass3.default)(CanvasComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateCanvas();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props !== nextProps) {
        this.updateCanvas();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.updateCanvas();
    }
  }, {
    key: 'updateCanvas',
    value: function updateCanvas() {
      var canvas = this.canvas;

      var context = canvas.getContext('2d');
      this.props.updateCanvas(context);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement('canvas', {
        ref: function ref(canvas) {
          _this2.canvas = canvas;
        },
        width: this.props.width, height: this.props.height
      });
    }
  }]);
  return CanvasComponent;
}(_react.Component);

exports.default = CanvasComponent;


CanvasComponent.propTypes = {
  width: _react.PropTypes.number.isRequired,
  height: _react.PropTypes.number.isRequired,
  updateCanvas: _react.PropTypes.func.isRequired
};