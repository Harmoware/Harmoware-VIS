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

var _frontScatterplotLayer = require('../front-scatterplot-layer');

var _frontScatterplotLayer2 = _interopRequireDefault(_frontScatterplotLayer);

var _settings = require('../../constants/settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FixedPointLayer = function (_CompositeLayer) {
  (0, _inherits3.default)(FixedPointLayer, _CompositeLayer);

  function FixedPointLayer() {
    (0, _classCallCheck3.default)(this, FixedPointLayer);
    return (0, _possibleConstructorReturn3.default)(this, (FixedPointLayer.__proto__ || (0, _getPrototypeOf2.default)(FixedPointLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(FixedPointLayer, [{
    key: 'renderLayers',
    value: function renderLayers() {
      var _props = this.props,
          layerOpacity = _props.layerOpacity,
          depotsData = _props.depotsData,
          getColor = _props.getColor,
          propGetRadius = _props.getRadius;


      if (!depotsData) {
        return null;
      }

      var getPosition = function getPosition(x) {
        return x.position;
      };
      var getRadius = propGetRadius || function (x) {
        return x.radius || 2;
      };

      return [new _frontScatterplotLayer2.default({
        id: 'fixed-point',
        data: depotsData,
        projectionMode: _deck.COORDINATE_SYSTEM.IDENTITY,
        getPosition: getPosition,
        getColor: getColor,
        getRadius: getRadius,
        opacity: layerOpacity,
        pickable: true,
        radiusScale: 0.1
      })];
    }
  }]);
  return FixedPointLayer;
}(_deck.CompositeLayer);

FixedPointLayer.defaultProps = {
  layerOpacity: 0.75,
  getColor: function getColor(x) {
    return x.color || _settings.COLOR4;
  }
};
FixedPointLayer.layerName = 'FixedPointLayer';
exports.default = FixedPointLayer;