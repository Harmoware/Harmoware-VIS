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

var MovesNonmapLayer = function (_CompositeLayer) {
  (0, _inherits3.default)(MovesNonmapLayer, _CompositeLayer);

  function MovesNonmapLayer() {
    (0, _classCallCheck3.default)(this, MovesNonmapLayer);
    return (0, _possibleConstructorReturn3.default)(this, (MovesNonmapLayer.__proto__ || (0, _getPrototypeOf2.default)(MovesNonmapLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(MovesNonmapLayer, [{
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
          layerOpacity = _props.layerOpacity,
          movedData = _props.movedData,
          getColor = _props.getColor,
          propGetRadius = _props.getRadius,
          routePaths = _props.routePaths;


      if (!movedData) {
        return null;
      }

      var getPosition = function getPosition(x) {
        return x.position;
      };
      var getRadius = propGetRadius || function (x) {
        return x.radius || 2;
      };

      return [new _frontScatterplotLayer2.default({
        id: 'moves-nonmap',
        data: movedData,
        projectionMode: _deck.COORDINATE_SYSTEM.IDENTITY,
        getPosition: getPosition,
        getColor: getColor,
        getRadius: getRadius,
        opacity: layerOpacity,
        pickable: true,
        radiusScale: 0.1
      }), new _deck.LineLayer({
        id: 'route-paths',
        data: routePaths,
        projectionMode: _deck.COORDINATE_SYSTEM.IDENTITY,
        strokeWidth: 20,
        pickable: false
      })];
    }
  }]);
  return MovesNonmapLayer;
}(_deck.CompositeLayer);

MovesNonmapLayer.defaultProps = {
  layerOpacity: 0.75,
  getColor: function getColor(x) {
    return x.color || _settings.COLOR1;
  }
};
MovesNonmapLayer.layerName = 'MovesNonmapLayer';
exports.default = MovesNonmapLayer;