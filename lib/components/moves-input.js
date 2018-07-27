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

var MovesInput = function (_Component) {
  (0, _inherits3.default)(MovesInput, _Component);

  function MovesInput() {
    (0, _classCallCheck3.default)(this, MovesInput);
    return (0, _possibleConstructorReturn3.default)(this, (MovesInput.__proto__ || (0, _getPrototypeOf2.default)(MovesInput)).apply(this, arguments));
  }

  (0, _createClass3.default)(MovesInput, [{
    key: 'onSelect',
    value: function onSelect(e) {
      var _this2 = this;

      var i18n = this.props.i18n;

      var reader = new FileReader();
      var file = e.target.files[0];
      if (!file) {
        return;
      }
      reader.readAsText(file);
      reader.onload = function () {
        var actions = _this2.props.actions;

        var readdata = '';
        try {
          readdata = JSON.parse(reader.result.toString());
        } catch (exception) {
          window.alert(exception);
          return;
        }
        if (!Array.isArray(readdata)) {
          // Not Array?
          var _readdata = readdata,
              movesbase = _readdata.movesbase;

          if (!movesbase) {
            window.alert(i18n.formatError);
            return;
          }
        }
        actions.setMovesBase(readdata);
        actions.setRoutePaths([]);
        actions.setClicked(null);
        actions.setAnimatePause(false);
        actions.setAnimateReverse(false);
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var className = this.props.className;


      return _react2.default.createElement('input', { type: 'file', accept: '.json', onChange: this.onSelect.bind(this), className: className });
    }
  }]);
  return MovesInput;
}(_react.Component);

MovesInput.defaultProps = {
  i18n: {
    formatError: 'ラインマップデータ形式不正'
  },
  className: ''
};
exports.default = MovesInput;