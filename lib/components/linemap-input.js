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

var LinemapInput = function (_Component) {
  (0, _inherits3.default)(LinemapInput, _Component);

  function LinemapInput() {
    (0, _classCallCheck3.default)(this, LinemapInput);
    return (0, _possibleConstructorReturn3.default)(this, (LinemapInput.__proto__ || (0, _getPrototypeOf2.default)(LinemapInput)).apply(this, arguments));
  }

  (0, _createClass3.default)(LinemapInput, [{
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
        if (readdata.length > 0) {
          var _readdata$ = readdata[0],
              sourcePosition = _readdata$.sourcePosition,
              targetPosition = _readdata$.targetPosition;

          if (sourcePosition && targetPosition) {
            actions.setLinemapData(readdata);
            return;
          }
          window.alert(i18n.formatError);
        }
        actions.setLinemapData([]);
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var className = this.props.className;


      return _react2.default.createElement('input', { type: 'file', accept: '.json', onChange: this.onSelect.bind(this), className: className });
    }
  }]);
  return LinemapInput;
}(_react.Component);

LinemapInput.defaultProps = {
  i18n: {
    formatError: 'ラインマップデータ形式不正'
  },
  className: ''
};
exports.default = LinemapInput;