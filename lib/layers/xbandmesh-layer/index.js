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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var XbandmeshLayer = function (_CompositeLayer) {
  (0, _inherits3.default)(XbandmeshLayer, _CompositeLayer);

  function XbandmeshLayer() {
    (0, _classCallCheck3.default)(this, XbandmeshLayer);
    return (0, _possibleConstructorReturn3.default)(this, (XbandmeshLayer.__proto__ || (0, _getPrototypeOf2.default)(XbandmeshLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(XbandmeshLayer, [{
    key: 'renderLayers',
    value: function renderLayers() {
      var _props = this.props,
          rainfall = _props.rainfall,
          layerOpacity = _props.layerOpacity,
          layerCellSize = _props.layerCellSize,
          layerElevationScale = _props.layerElevationScale,
          lightSettings = _props.lightSettings,
          getElevation = _props.getElevation,
          getColor = _props.getColor,
          getRainfallColor = _props.getRainfallColor,
          defaultColor = _props.defaultColor;


      if (!lightSettings) {
        alert('XbandmeshLayer: props 指定エラー');
        return null;
      }
      if (!rainfall || rainfall.length === 0) {
        return null;
      }

      var getCellColor = function getCellColor(x) {
        return getColor(x) || getRainfallColor(getElevation(x)) || defaultColor;
      };

      return [new _deck.GridCellLayer({
        id: 'xband-mesh-layer',
        data: rainfall,
        getElevation: getElevation,
        getColor: getCellColor,
        opacity: layerOpacity,
        cellSize: layerCellSize,
        elevationScale: layerElevationScale,
        lightSettings: lightSettings,
        pickable: true
      })];
    }
  }]);
  return XbandmeshLayer;
}(_deck.CompositeLayer);

XbandmeshLayer.defaultProps = {
  layerOpacity: 0.2,
  layerCellSize: 100,
  layerElevationScale: 20,
  getElevation: function getElevation(x) {
    return x.elevation || 0;
  },
  getColor: function getColor(x) {
    return x.color;
  },
  getRainfallColor: function getRainfallColor(x) {
    if (x < 3) {
      // 0:白 => 3:水色
      return [255.0 - x / 3.0 * 255.0, 255.0, 255.0];
    } else if (x < 12) {
      // 3:水色 => 12:青
      return [0.0, 255.0 - (x - 3.0) / 9.0 * 255.0, 255.0];
    } else if (x < 25) {
      // 12:青 => 25:黄
      return [(x - 12.0) / 13.0 * 255.0, (x - 12.0) / 13.0 * 255.0, 255.0 - (x - 12.0) / 13.0 * 255.0];
    } else if (x < 40) {
      // 25:黄 => 40:赤
      return [255.0, 255.0 - (x - 25.0) / 15.0 * 255.0, 0.0];
    } else if (x < 80) {
      // 40:赤 => 80:紫
      return [255.0 - (x - 40.0) / 40.0 * 127.0, 0.0, (x - 40.0) / 40.0 * 255.0];
    }
    return [127.0, 0.0, 255.0]; // 80～:紫
  },
  defaultColor: [0, 255, 255]
};
XbandmeshLayer.layerName = 'XbandmeshLayer';
exports.default = XbandmeshLayer;