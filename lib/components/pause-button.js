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

var PauseButton = function (_Component) {
  (0, _inherits3.default)(PauseButton, _Component);

  function PauseButton() {
    (0, _classCallCheck3.default)(this, PauseButton);
    return (0, _possibleConstructorReturn3.default)(this, (PauseButton.__proto__ || (0, _getPrototypeOf2.default)(PauseButton)).apply(this, arguments));
  }

  (0, _createClass3.default)(PauseButton, [{
    key: 'setAnimatePause',


    // static propTypes = {
    //   actions: PropTypes.objectOf(PropTypes.func).isRequired,
    //   animatePause: PropTypes.bool.isRequired,
    //   children: PropTypes.string,
    // }

    value: function setAnimatePause() {
      this.props.actions.setAnimatePause(true);
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;


      return _react2.default.createElement(
        'button',
        { onClick: this.setAnimatePause.bind(this) },
        children
      );
    }
  }]);
  return PauseButton;
}(_react.Component);

PauseButton.defaultProps = {
  children: '⏯️ 一時停止' };
exports.default = PauseButton;