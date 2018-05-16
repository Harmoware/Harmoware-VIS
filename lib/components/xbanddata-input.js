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

var XbandDataInput = function (_Component) {
  (0, _inherits3.default)(XbandDataInput, _Component);

  function XbandDataInput() {
    (0, _classCallCheck3.default)(this, XbandDataInput);
    return (0, _possibleConstructorReturn3.default)(this, (XbandDataInput.__proto__ || (0, _getPrototypeOf2.default)(XbandDataInput)).apply(this, arguments));
  }

  (0, _createClass3.default)(XbandDataInput, [{
    key: 'onSelect',


    // static propTypes = {
    //   actions: PropTypes.objectOf(PropTypes.func).isRequired,
    // }

    value: function onSelect(e) {
      var _this2 = this;

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
              _position = _readdata$.position,
              _elevation = _readdata$.elevation,
              _color = _readdata$.color;

          if (_position && (_elevation || _color)) {
            actions.setRainfall(readdata);
            return;
          }
          window.alert('雨量データ形式不正');
        }
        actions.setRainfall([]);
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('input', { type: 'file', accept: '.json', onChange: this.onSelect.bind(this) });
    }
  }]);
  return XbandDataInput;
}(_react.Component);

exports.default = XbandDataInput;