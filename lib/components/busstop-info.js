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

var BusStopInfo = function (_Component) {
  (0, _inherits3.default)(BusStopInfo, _Component);

  function BusStopInfo() {
    (0, _classCallCheck3.default)(this, BusStopInfo);
    return (0, _possibleConstructorReturn3.default)(this, (BusStopInfo.__proto__ || (0, _getPrototypeOf2.default)(BusStopInfo)).apply(this, arguments));
  }

  (0, _createClass3.default)(BusStopInfo, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          selectedBusstop = _props.selectedBusstop,
          date = _props.date,
          busstops = _props.busstops;

      var d = new Date(date);
      var width = selectedBusstop.length > 0 && selectedBusstop !== '0000' ? '300px' : '0px';
      var height = selectedBusstop.length > 0 && selectedBusstop !== '0000' ? '100px' : '0px';
      var busstop = busstops.find(function (busstopElement) {
        if (busstopElement.code === selectedBusstop) {
          return true;
        }
        return false;
      });
      return _react2.default.createElement(
        'svg',
        { width: width, height: height },
        selectedBusstop.length > 0 && selectedBusstop !== '0000' ? _react2.default.createElement('rect', { width: width, height: height, stroke: 'none', fill: 'none' }) : null,
        selectedBusstop.length > 0 && selectedBusstop !== '0000' ? _react2.default.createElement(
          'text',
          { x: '20', y: '20', fill: 'white' },
          d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
        ) : null,
        selectedBusstop.length > 0 && selectedBusstop !== '0000' ? _react2.default.createElement(
          'text',
          { x: '20', y: '40', fill: 'white' },
          selectedBusstop,
          ':',
          busstop.name
        ) : null,
        selectedBusstop.length > 0 && selectedBusstop !== '0000' ? _react2.default.createElement(
          'text',
          { x: '20', y: '60', fill: 'white' },
          busstop.memo
        ) : null
      );
    }
  }]);
  return BusStopInfo;
}(_react.Component);

exports.default = BusStopInfo;