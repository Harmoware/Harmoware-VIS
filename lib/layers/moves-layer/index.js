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

var _library = require('../../library');

var _settings = require('../../constants/settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MovesLayer = function (_CompositeLayer) {
  (0, _inherits3.default)(MovesLayer, _CompositeLayer);

  function MovesLayer() {
    (0, _classCallCheck3.default)(this, MovesLayer);
    return (0, _possibleConstructorReturn3.default)(this, (MovesLayer.__proto__ || (0, _getPrototypeOf2.default)(MovesLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(MovesLayer, [{
    key: 'getPickingInfo',
    value: function getPickingInfo(pickParams) {
      var mode = pickParams.mode,
          info = pickParams.info;
      var object = info.object,
          layer = info.layer;
      var id = layer.id,
          props = layer.props;

      if (mode === 'hover') {
        props.onHover(info);
      }
      if (mode === 'click') {
        if (props.onClick.name !== 'noop') {
          props.onClick(info);
        } else if (object && props.actions) {
          var _movesbaseidx = object.movesbaseidx;
          var _actions = props.actions,
              _clickedObject = props.clickedObject,
              _movesbase = props.movesbase;

          var _routePaths = [];
          if (_clickedObject && _clickedObject.object.movesbaseidx === _movesbaseidx) {
            _actions.setClicked(null);
          } else {
            _actions.setClicked({ object: object, layer: { id: id } });
            var operation = _movesbase[_movesbaseidx].operation;

            for (var j = 0; j < operation.length - 1; j += 1) {
              var _operation$j = operation[j],
                  position = _operation$j.position,
                  color = _operation$j.color;
              var nextposition = operation[j + 1].position;

              _routePaths.push({
                sourcePosition: position,
                targetPosition: nextposition,
                color: color || _settings.COLOR1
              });
            }
          }
          _actions.setRoutePaths(_routePaths);
        }
      }
    }
  }, {
    key: 'renderLayers',
    value: function renderLayers() {
      var _props = this.props,
          routePaths = _props.routePaths,
          layerRadiusScale = _props.layerRadiusScale,
          layerOpacity = _props.layerOpacity,
          movedData = _props.movedData,
          movesbase = _props.movesbase,
          clickedObject = _props.clickedObject,
          actions = _props.actions,
          optionElevationScale = _props.optionElevationScale,
          optionOpacity = _props.optionOpacity,
          optionCellSize = _props.optionCellSize,
          optionVisible = _props.optionVisible,
          optionChange = _props.optionChange,
          lightSettings = _props.lightSettings,
          getColor = _props.getColor,
          propGetRadius = _props.getRadius,
          getColor1 = _props.getColor1,
          getColor2 = _props.getColor2,
          getColor3 = _props.getColor3,
          getColor4 = _props.getColor4,
          getElevation1 = _props.getElevation1,
          getElevation2 = _props.getElevation2,
          getElevation3 = _props.getElevation3,
          getElevation4 = _props.getElevation4,
          getCubeColor = _props.getCubeColor,
          getCubeElevation = _props.getCubeElevation;


      if (!routePaths || !movesbase || !actions || typeof clickedObject === 'undefined' || optionVisible && !lightSettings) {
        alert('MovesLayer: props 指定エラー');
        return null;
      }
      if (!movedData) {
        return null;
      }

      var distanceScales = this.context.viewport.distanceScales;
      var degreesPerPixel = distanceScales.degreesPerPixel,
          pixelsPerMeter = distanceScales.pixelsPerMeter;

      var degreesMeterLng = degreesPerPixel[0] * pixelsPerMeter[0];
      var degreesMeterLat = degreesPerPixel[1] * pixelsPerMeter[1];
      var optionMedianLng = degreesMeterLng * optionCellSize / 2;
      var optionMedianLat = degreesMeterLat * optionCellSize / 2;
      var optionShiftLng = degreesMeterLng * optionCellSize / 2;
      var optionShiftLat = degreesMeterLat * optionCellSize / 2;

      var getPosition = function getPosition(x) {
        return x.position;
      };

      var getOptPosition = function getOptPosition(x) {
        var pos = getPosition(x);
        return [pos[0] - optionMedianLng, pos[1] - optionMedianLat, pos[2]];
      };

      var getRadius = propGetRadius || function (x) {
        return x.radius || 20;
      };
      var getPosition1 = function getPosition1(x) {
        var pos = getOptPosition(x);
        return [pos[0] + optionShiftLng, pos[1] + optionShiftLat, pos[2]];
      };
      var getPosition2 = function getPosition2(x) {
        var pos = getOptPosition(x);
        return [pos[0] + optionShiftLng, pos[1] - optionShiftLat, pos[2]];
      };
      var getPosition3 = function getPosition3(x) {
        var pos = getOptPosition(x);
        return [pos[0] - optionShiftLng, pos[1] + optionShiftLat, pos[2]];
      };
      var getPosition4 = function getPosition4(x) {
        var pos = getOptPosition(x);
        return [pos[0] - optionShiftLng, pos[1] - optionShiftLat, pos[2]];
      };

      if ((0, _library.getClickedObjectToBeRemoved)(movedData, clickedObject)) {
        actions.setRoutePaths([]);
        actions.setClicked(null);
      }

      return [new _deck.ScatterplotLayer({
        id: 'moves',
        data: movedData,
        radiusScale: layerRadiusScale,
        getPosition: getPosition,
        getColor: getColor,
        getRadius: getRadius,
        opacity: layerOpacity,
        pickable: true,
        radiusMinPixels: 1
      }), new _deck.LineLayer({
        id: 'route-paths',
        data: routePaths,
        strokeWidth: Math.max(pixelsPerMeter[0] * 10, 1),
        fp64: false,
        pickable: false
      }), new _deck.GridCellLayer({
        id: 'moves-opt1',
        data: movedData,
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
        id: 'moves-opt2',
        data: movedData,
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
        id: 'moves-opt3',
        data: movedData,
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
        id: 'moves-opt4',
        data: movedData,
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
        id: 'moves-opt-cube',
        data: movedData,
        visible: optionVisible && optionChange,
        getPosition: getPosition,
        getColor: getCubeColor,
        getElevation: getCubeElevation,
        opacity: optionOpacity,
        pickable: true,
        cellSize: optionCellSize,
        elevationScale: optionElevationScale,
        lightSettings: lightSettings
      })];
    }
  }]);
  return MovesLayer;
}(_deck.CompositeLayer);

MovesLayer.defaultProps = {
  layerRadiusScale: 1,
  layerOpacity: 0.75,
  optionVisible: true,
  optionChange: false,
  optionOpacity: 0.25,
  optionCellSize: 12,
  optionElevationScale: 1,
  getColor: function getColor(x) {
    return x.color || _settings.COLOR1;
  },
  getColor1: function getColor1(x) {
    return x.optColor && x.optColor[0] || x.color || _settings.COLOR1;
  },
  getColor2: function getColor2(x) {
    return x.optColor && x.optColor[1] || x.color || _settings.COLOR1;
  },
  getColor3: function getColor3(x) {
    return x.optColor && x.optColor[2] || x.color || _settings.COLOR1;
  },
  getColor4: function getColor4(x) {
    return x.optColor && x.optColor[3] || x.color || _settings.COLOR1;
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
  },
  getCubeColor: function getCubeColor(x) {
    return x.optColor || [x.color] || [_settings.COLOR1];
  },
  getCubeElevation: function getCubeElevation(x) {
    return x.optElevation || [0];
  }
};
MovesLayer.layerName = 'MovesLayer';
exports.default = MovesLayer;