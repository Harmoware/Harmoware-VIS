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

var _reactIconsKit = require('react-icons-kit');

var _md = require('react-icons-kit/md');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlayButton = function (_Component) {
  (0, _inherits3.default)(PlayButton, _Component);

  function PlayButton() {
    (0, _classCallCheck3.default)(this, PlayButton);
    return (0, _possibleConstructorReturn3.default)(this, (PlayButton.__proto__ || (0, _getPrototypeOf2.default)(PlayButton)).apply(this, arguments));
  }

  (0, _createClass3.default)(PlayButton, [{
    key: 'setAnimatePause',
    value: function setAnimatePause() {
      this.props.actions.setAnimatePause(false);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          i18n = _props.i18n,
          className = _props.className;


      return _react2.default.createElement(
        'button',
        { onClick: this.setAnimatePause.bind(this), className: className },
        children === undefined ? _react2.default.createElement(
          'span',
          null,
          _react2.default.createElement(_reactIconsKit.Icon, { icon: _md.ic_play_circle_outline }),
          '\xA0',
          i18n.playButtonCaption
        ) : _react2.default.createElement(
          'span',
          null,
          children
        )
      );
    }
  }]);
  return PlayButton;
}(_react.Component);

PlayButton.defaultProps = {
  i18n: {
    playButtonCaption: '️PLAY'
  },
  className: ''
};
exports.default = PlayButton;