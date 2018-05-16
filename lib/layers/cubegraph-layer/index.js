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

var _cubeiconLayer = require('../cubeicon-layer');

var _cubeiconLayer2 = _interopRequireDefault(_cubeiconLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CubeGraphLayer = function (_CompositeLayer) {
  (0, _inherits3.default)(CubeGraphLayer, _CompositeLayer);

  function CubeGraphLayer() {
    (0, _classCallCheck3.default)(this, CubeGraphLayer);
    return (0, _possibleConstructorReturn3.default)(this, (CubeGraphLayer.__proto__ || (0, _getPrototypeOf2.default)(CubeGraphLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(CubeGraphLayer, [{
    key: 'renderLayers',
    value: function renderLayers() {
      var _props = this.props,
          optionData = _props.optionData,
          optionVisible = _props.optionVisible,
          optionCellSize = _props.optionCellSize,
          optionOpacity = _props.optionOpacity,
          optionElevationScale = _props.optionElevationScale,
          lightSettings = _props.lightSettings,
          getOptElevation = _props.getOptElevation,
          getOptColor = _props.getOptColor,
          shiftByMeter = _props.shiftByMeter,
          id = _props.id;


      if (!optionVisible) {
        return null;
      }
      if (!lightSettings) {
        alert('CubeGraphLayer: props 指定エラー');
        return null;
      }
      if (!optionData || optionData.length === 0) {
        return null;
      }

      var distanceScales = this.context.viewport.distanceScales;
      var degreesPerPixel = distanceScales.degreesPerPixel,
          pixelsPerMeter = distanceScales.pixelsPerMeter;

      var shiftLng = degreesPerPixel[0] * pixelsPerMeter[0] * shiftByMeter[0];
      var shiftLat = degreesPerPixel[1] * pixelsPerMeter[1] * shiftByMeter[1];

      var getPosition = function getPosition(x) {
        return x.position;
      };

      var getOptPosition = function getOptPosition(x) {
        var pos = getPosition(x);
        return [pos[0] + shiftLng, pos[1] + shiftLat, pos[2]];
      };

      var setProps = {};
      setProps.id = id;
      setProps.data = optionData;
      setProps.visible = optionVisible;
      if (optionCellSize) {
        setProps.cellSize = optionCellSize;
      }
      if (optionOpacity) {
        setProps.opacity = optionOpacity;
      }
      if (optionElevationScale) {
        setProps.elevationScale = optionElevationScale;
      }
      setProps.getPosition = getOptPosition;
      setProps.getElevation = getOptElevation;
      setProps.getColor = getOptColor;
      setProps.lightSettings = lightSettings;

      return [new _cubeiconLayer2.default(setProps)];
    }
  }]);
  return CubeGraphLayer;
}(_deck.CompositeLayer);

CubeGraphLayer.defaultProps = {
  id: 'CubeiconLayer',
  getOptColor: function getOptColor(x) {
    return x.optColor || [x.color] || [[255, 255, 255]];
  },
  getOptElevation: function getOptElevation(x) {
    return x.optElevation || [0];
  },
  shiftByMeter: [0, 0, 0]
};
CubeGraphLayer.layerName = 'CubeGraphLayer';
exports.default = CubeGraphLayer;