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

var ElapsedTimeRange = function (_Component) {
  (0, _inherits3.default)(ElapsedTimeRange, _Component);

  function ElapsedTimeRange() {
    (0, _classCallCheck3.default)(this, ElapsedTimeRange);
    return (0, _possibleConstructorReturn3.default)(this, (ElapsedTimeRange.__proto__ || (0, _getPrototypeOf2.default)(ElapsedTimeRange)).apply(this, arguments));
  }

  (0, _createClass3.default)(ElapsedTimeRange, [{
    key: 'setTime',
    value: function setTime(e) {
      this.props.actions.setTime(Math.floor(Number(e.target.value)));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          settime = _props.settime,
          timeLength = _props.timeLength,
          min = _props.min,
          step = _props.step,
          className = _props.className;


      return _react2.default.createElement('input', {
        type: 'range',
        value: Math.floor(settime),
        min: min, max: timeLength, step: step,
        onChange: this.setTime.bind(this),
        className: className
      });
    }
  }]);
  return ElapsedTimeRange;
}(_react.Component);

ElapsedTimeRange.defaultProps = {
  min: -100,
  step: 1,
  className: ''
};
exports.default = ElapsedTimeRange;