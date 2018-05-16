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
    key: 'setSecPerMin',


    // static propTypes = {
    //   secpermin: PropTypes.number.isRequired,
    //   actions: PropTypes.objectOf(PropTypes.func).isRequired,
    //   maxsecpermin: PropTypes.number,
    //   min: PropTypes.number,
    //   step: PropTypes.number,
    // }

    value: function setSecPerMin(e) {
      var value = Number(e.target.value);
      var secpermin = this.props.maxsecpermin + 1 - Math.floor(value);
      this.props.actions.setSecPerMin(secpermin);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          secpermin = _props.secpermin,
          maxsecpermin = _props.maxsecpermin,
          min = _props.min,
          step = _props.step;


      return _react2.default.createElement('input', {
        type: 'range',
        value: maxsecpermin + 1 - secpermin,
        min: min, max: '' + maxsecpermin, step: step,
        onChange: this.setSecPerMin.bind(this)
      });
    }
  }]);
  return SpeedRange;
}(_react.Component);

SpeedRange.defaultProps = {
  maxsecpermin: 10,
  min: 1,
  step: 1 };
exports.default = SpeedRange;