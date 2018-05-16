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

var SimulationDateTime = function (_Component) {
  (0, _inherits3.default)(SimulationDateTime, _Component);

  function SimulationDateTime() {
    (0, _classCallCheck3.default)(this, SimulationDateTime);
    return (0, _possibleConstructorReturn3.default)(this, (SimulationDateTime.__proto__ || (0, _getPrototypeOf2.default)(SimulationDateTime)).apply(this, arguments));
  }

  (0, _createClass3.default)(SimulationDateTime, [{
    key: 'render',


    // static propTypes = {
    //   timeBegin: PropTypes.number.isRequired,
    //   settime: PropTypes.number.isRequired,
    //   caption: PropTypes.string,
    //   locales: PropTypes.string,
    //   options: PropTypes.objectOf(PropTypes.string),
    // }

    value: function render() {
      var _props = this.props,
          timeBegin = _props.timeBegin,
          settime = _props.settime,
          caption = _props.caption,
          locales = _props.locales,
          options = _props.options;


      var date = new Date((timeBegin + settime) * 1000);
      var nbsp = caption.length > 0 ? ' ' : '';

      return _react2.default.createElement(
        'span',
        null,
        caption,
        nbsp,
        date.toLocaleString(locales, options)
      );
    }
  }]);
  return SimulationDateTime;
}(_react.Component);

SimulationDateTime.defaultProps = {
  caption: '',
  locales: 'ja-JP',
  options: { year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short' } };
exports.default = SimulationDateTime;