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

var SpeedRange = function (_Component) {
  (0, _inherits3.default)(SpeedRange, _Component);

  function SpeedRange() {
    (0, _classCallCheck3.default)(this, SpeedRange);
    return (0, _possibleConstructorReturn3.default)(this, (SpeedRange.__proto__ || (0, _getPrototypeOf2.default)(SpeedRange)).apply(this, arguments));
  }

  (0, _createClass3.default)(SpeedRange, [{
    key: 'setSecPerHour',
    value: function setSecPerHour(e) {
      var value = Number(e.target.value);
      var _props = this.props,
          maxsecperhour = _props.maxsecperhour,
          min = _props.min,
          actions = _props.actions;

      var secperhour = maxsecperhour + min - Math.floor(value);
      actions.setSecPerHour(secperhour);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          secperhour = _props2.secperhour,
          maxsecperhour = _props2.maxsecperhour,
          min = _props2.min,
          step = _props2.step,
          className = _props2.className;


      return _react2.default.createElement('input', {
        type: 'range',
        value: maxsecperhour + min - secperhour,
        min: min, max: maxsecperhour, step: step,
        onChange: this.setSecPerHour.bind(this),
        className: className
      });
    }
  }]);
  return SpeedRange;
}(_react.Component);

SpeedRange.defaultProps = {
  maxsecperhour: 3600,
  min: 1,
  step: 1,
  className: ''
};
exports.default = SpeedRange;