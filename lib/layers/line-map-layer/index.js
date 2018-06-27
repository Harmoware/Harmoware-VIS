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

var _deck = require('deck.gl');

var _settings = require('../../constants/settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LineMapLayer = function (_CompositeLayer) {
  (0, _inherits3.default)(LineMapLayer, _CompositeLayer);

  function LineMapLayer() {
    (0, _classCallCheck3.default)(this, LineMapLayer);
    return (0, _possibleConstructorReturn3.default)(this, (LineMapLayer.__proto__ || (0, _getPrototypeOf2.default)(LineMapLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(LineMapLayer, [{
    key: 'renderLayers',
    value: function renderLayers() {
      var _props = this.props,
          layerOpacity = _props.layerOpacity,
          linemapData = _props.linemapData,
          strokeWidth = _props.strokeWidth,
          getColor = _props.getColor;


      if (!linemapData) {
        return null;
      }

      var getSourcePosition = function getSourcePosition(x) {
        return x.sourcePosition;
      };
      var getTargetPosition = function getTargetPosition(x) {
        return x.targetPosition;
      };

      return [new _deck.LineLayer({
        id: 'line-map-layer',
        data: linemapData,
        projectionMode: _deck.COORDINATE_SYSTEM.IDENTITY,
        getSourcePosition: getSourcePosition,
        getTargetPosition: getTargetPosition,
        getColor: getColor,
        opacity: layerOpacity,
        pickable: true,
        strokeWidth: strokeWidth
      })];
    }
  }]);
  return LineMapLayer;
}(_deck.CompositeLayer);

LineMapLayer.defaultProps = {
  layerOpacity: 1.0,
  strokeWidth: 20,
  getColor: function getColor(x) {
    return x.color || _settings.COLOR2;
  }
};
LineMapLayer.layerName = 'LineMapLayer';
exports.default = LineMapLayer;