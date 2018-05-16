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

var AddMinutesButton = function (_Component) {
  (0, _inherits3.default)(AddMinutesButton, _Component);

  function AddMinutesButton() {
    (0, _classCallCheck3.default)(this, AddMinutesButton);
    return (0, _possibleConstructorReturn3.default)(this, (AddMinutesButton.__proto__ || (0, _getPrototypeOf2.default)(AddMinutesButton)).apply(this, arguments));
  }

  (0, _createClass3.default)(AddMinutesButton, [{
    key: 'addMinutes',
    value: function addMinutes(minutes) {
      this.props.actions.addMinutes(minutes);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          addMinutes = _props.addMinutes,
          children = _props.children;


      return _react2.default.createElement(
        'button',
        { onClick: this.addMinutes.bind(this, addMinutes) },
        children
      );
    }
  }]);
  return AddMinutesButton;
}(_react.Component);

AddMinutesButton.defaultProps = {
  addMinutes: 10
};
exports.default = AddMinutesButton;