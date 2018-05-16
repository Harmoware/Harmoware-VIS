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

var _settings = require('../../constants/settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DepotsLayer = function (_CompositeLayer) {
  (0, _inherits3.default)(DepotsLayer, _CompositeLayer);

  function DepotsLayer() {
    (0, _classCallCheck3.default)(this, DepotsLayer);
    return (0, _possibleConstructorReturn3.default)(this, (DepotsLayer.__proto__ || (0, _getPrototypeOf2.default)(DepotsLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(DepotsLayer, [{
    key: 'renderLayers',
    value: function renderLayers() {
      var _props = this.props,
          layerRadiusScale = _props.layerRadiusScale,
          layerOpacity = _props.layerOpacity,
          depotsData = _props.depotsData,
          getColor = _props.getColor,
          propGetRadius = _props.getRadius,
          optionElevationScale = _props.optionElevationScale,
          optionVisible = _props.optionVisible,
          optionChange = _props.optionChange,
          optionOpacity = _props.optionOpacity,
          optionCellSize = _props.optionCellSize,
          lightSettings = _props.lightSettings,
          getColor1 = _props.getColor1,
          getColor2 = _props.getColor2,
          getColor3 = _props.getColor3,
          getColor4 = _props.getColor4,
          getElevation1 = _props.getElevation1,
          getElevation2 = _props.getElevation2,
          getElevation3 = _props.getElevation3,
          getElevation4 = _props.getElevation4;


      if (optionVisible && !lightSettings) {
        alert('DepotsLayer: props 指定エラー');
        return null;
      }
      if (!depotsData) {
        return null;
      }

      var distanceScales = this.context.viewport.distanceScales;
      var degreesPerPixel = distanceScales.degreesPerPixel,
          pixelsPerMeter = distanceScales.pixelsPerMeter;

      var degreesMeterLng = degreesPerPixel[0] * pixelsPerMeter[0];
      var degreesMeterLat = degreesPerPixel[1] * pixelsPerMeter[1];
      var optionMedianLng = degreesMeterLng * optionCellSize / 2;
      var optionMedianLat = degreesMeterLat * optionCellSize / 2;
      var optionShiftLng = function optionShiftLng(rad) {
        return degreesMeterLng * (rad + optionCellSize / 2 + 2);
      };
      var optionShiftLat = degreesMeterLat * (optionCellSize / 2 + 2);

      var getPosition = function getPosition(x) {
        return x.position;
      };

      var getOptPosition = function getOptPosition(x) {
        var pos = getPosition(x);
        return [pos[0] - optionMedianLng, pos[1] - optionMedianLat, pos[2]];
      };

      var getRadius = propGetRadius || function (x) {
        return x.radius || 30;
      };
      var getPosition1 = function getPosition1(x) {
        var pos = getOptPosition(x);
        var rad = getRadius(x);
        return [pos[0] + optionShiftLng(rad), pos[1] + optionShiftLat, pos[2]];
      };
      var getPosition2 = function getPosition2(x) {
        var pos = getOptPosition(x);
        var rad = getRadius(x);
        return [pos[0] + optionShiftLng(rad), pos[1] - optionShiftLat, pos[2]];
      };
      var getPosition3 = function getPosition3(x) {
        var pos = getOptPosition(x);
        var rad = getRadius(x);
        return [pos[0] - optionShiftLng(rad), pos[1] + optionShiftLat, pos[2]];
      };
      var getPosition4 = function getPosition4(x) {
        var pos = getOptPosition(x);
        var rad = getRadius(x);
        return [pos[0] - optionShiftLng(rad), pos[1] - optionShiftLat, pos[2]];
      };

      var getCubePosition1 = function getCubePosition1(x) {
        var pos = getPosition(x);
        var rad = getRadius(x);
        return [pos[0] + optionShiftLng(rad), pos[1], pos[2]];
      };

      var getCubePosition2 = function getCubePosition2(x) {
        var pos = getPosition(x);
        var rad = getRadius(x);
        return [pos[0] - optionShiftLng(rad), pos[1], pos[2]];
      };

      var getCubeColor1 = function getCubeColor1(x) {
        return [x.optColor && x.optColor[0] || x.color || _settings.COLOR4, x.optColor && x.optColor[1] || x.color || _settings.COLOR4];
      };
      var getCubeColor2 = function getCubeColor2(x) {
        return [x.optColor && x.optColor[2] || x.color || _settings.COLOR4, x.optColor && x.optColor[3] || x.color || _settings.COLOR4];
      };
      var getCubeElevation1 = function getCubeElevation1(x) {
        return [x.optElevation && x.optElevation[0] || 0, x.optElevation && x.optElevation[1] || 0];
      };
      var getCubeElevation2 = function getCubeElevation2(x) {
        return [x.optElevation && x.optElevation[2] || 0, x.optElevation && x.optElevation[3] || 0];
      };

      return [new _deck.ScatterplotLayer({
        id: 'depots',
        data: depotsData,
        radiusScale: layerRadiusScale,
        getPosition: getPosition,
        getColor: getColor,
        getRadius: getRadius,
        opacity: layerOpacity,
        pickable: true,
        radiusMinPixels: 1
      }), new _deck.GridCellLayer({
        id: 'depots-opt1',
        data: depotsData,
        visible: optionVisible && !optionChange,
        getPosition: getPosition1,
        getColor: getColor1,
        getElevation: getElevation1,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings: lightSettings
      }), new _deck.GridCellLayer({
        id: 'depots-opt2',
        data: depotsData,
        visible: optionVisible && !optionChange,
        getPosition: getPosition2,
        getColor: getColor2,
        getElevation: getElevation2,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings: lightSettings
      }), new _deck.GridCellLayer({
        id: 'depots-opt3',
        data: depotsData,
        visible: optionVisible && !optionChange,
        getPosition: getPosition3,
        getColor: getColor3,
        getElevation: getElevation3,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings: lightSettings
      }), new _deck.GridCellLayer({
        id: 'depots-opt4',
        data: depotsData,
        visible: optionVisible && !optionChange,
        getPosition: getPosition4,
        getColor: getColor4,
        getElevation: getElevation4,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings: lightSettings
      }), new _cubeiconLayer2.default({
        id: 'depots-opt-cube1',
        data: depotsData,
        visible: optionVisible && optionChange,
        getPosition: getCubePosition1,
        getColor: getCubeColor1,
        getElevation: getCubeElevation1,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings: lightSettings
      }), new _cubeiconLayer2.default({
        id: 'depots-opt-cube2',
        data: depotsData,
        visible: optionVisible && optionChange,
        getPosition: getCubePosition2,
        getColor: getCubeColor2,
        getElevation: getCubeElevation2,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings: lightSettings
      })];
    }
  }]);
  return DepotsLayer;
}(_deck.CompositeLayer);

DepotsLayer.layerName = 'DepotsLayer';
DepotsLayer.defaultProps = {
  layerRadiusScale: 1,
  layerOpacity: 0.5,
  optionVisible: true,
  optionChange: false,
  optionOpacity: 0.25,
  optionCellSize: 20,
  optionElevationScale: 1,
  getColor: function getColor(x) {
    return x.color || _settings.COLOR4;
  },
  getColor1: function getColor1(x) {
    return x.optColor && x.optColor[0] || x.color || _settings.COLOR4;
  },
  getColor2: function getColor2(x) {
    return x.optColor && x.optColor[1] || x.color || _settings.COLOR4;
  },
  getColor3: function getColor3(x) {
    return x.optColor && x.optColor[2] || x.color || _settings.COLOR4;
  },
  getColor4: function getColor4(x) {
    return x.optColor && x.optColor[3] || x.color || _settings.COLOR4;
  },
  getElevation1: function getElevation1(x) {
    return x.optElevation && x.optElevation[0] || 0;
  },
  getElevation2: function getElevation2(x) {
    return x.optElevation && x.optElevation[1] || 0;
  },
  getElevation3: function getElevation3(x) {
    return x.optElevation && x.optElevation[2] || 0;
  },
  getElevation4: function getElevation4(x) {
    return x.optElevation && x.optElevation[3] || 0;
  }
};
exports.default = DepotsLayer;