'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _deck = require('deck.gl');

var _deck2 = _interopRequireDefault(_deck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LIGHT_SETTINGS = {
  lightsPosition: [137.087638, 34.883046, 8000, 137.399026, 35.13819, 8000],
  ambientRatio: 0.2,
  diffuseRatio: 0.5,
  specularRatio: 0.3,
  lightsStrength: [1.0, 0.0, 2.0, 0.0],
  numberOfLights: 2
};

var DeckGLOverlay = function (_Component) {
  (0, _inherits3.default)(DeckGLOverlay, _Component);
  (0, _createClass3.default)(DeckGLOverlay, null, [{
    key: 'defaultViewport',
    get: function get() {
      return {
        longitude: 136.906428,
        latitude: 35.181453,
        zoom: 11.1,
        maxZoom: 16,
        minZoom: 8,
        pitch: 30,
        bearing: 0
      };
    }
  }]);

  function DeckGLOverlay() {
    (0, _classCallCheck3.default)(this, DeckGLOverlay);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DeckGLOverlay.__proto__ || (0, _getPrototypeOf2.default)(DeckGLOverlay)).call(this));

    _this.onHover = _this.onHover.bind(_this);
    _this.onClick = _this.onClick.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(DeckGLOverlay, [{
    key: 'onHover',
    value: function onHover(el) {
      if (el) {
        if (el.layer.id.match(/^busstops.*/)) {
          // this._busstopsAction(el);
        }
        this.props.actions.setHovered(el);
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(el) {
      var _props = this.props,
          selectedBusstop = _props.selectedBusstop,
          clicked = _props.clicked,
          actions = _props.actions;

      if (el) {
        var layer = el.layer,
            object = el.object;
        var busmovesbaseidx = object.busmovesbaseidx,
            code = object.code;

        if (layer.id.match(/^busmoves.*/)) {
          if (clicked && clicked.object.busmovesbaseidx === busmovesbaseidx) {
            actions.setClicked(null);
            actions.setRoutePaths([]);
          } else {
            actions.updateRoute(el, true);
            actions.setSelectedBus(code);
          }
        } else if (layer.id.match(/^busstops.*/)) {
          if (selectedBusstop.length > 0 && selectedBusstop === code) {
            actions.setSelectedBusstop('');
          } else {
            actions.setSelectedBusstop(code);
          }
        }
      }
    }
  }, {
    key: 'initialize',
    value: function initialize(gl) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          viewport = _props2.viewport,
          rainfall = _props2.rainfall,
          busstopsdata = _props2.busstopsdata,
          busmovesdata = _props2.busmovesdata,
          routePaths = _props2.routePaths;
      var _props3 = this.props,
          cellopacity = _props3.cellopacity,
          cellSize = _props3.cellSize,
          elevationScale = _props3.elevationScale;
      var _props4 = this.props,
          visible1 = _props4.visible1,
          visible2 = _props4.visible2;


      if (!rainfall || !busstopsdata || !busmovesdata) {
        return null;
      }

      var layers = [new _deck.ScatterplotLayer({
        id: 'busmoves',
        data: busmovesdata,
        radiusScale: 1,
        getPosition: function getPosition(d) {
          return d.coordinates;
        },
        getColor: function getColor(d) {
          return d.color;
        },
        getRadius: function getRadius(d) {
          return d.radius * (viewport.zoom >= 11.5 ? 1 : (11.5 - viewport.zoom) * 2 + 1);
        },
        opacity: 0.75,
        pickable: true,
        onHover: this.onHover,
        onClick: this.onClick
      }), new _deck.GridCellLayer({
        id: 'busmoves-opt1',
        data: busmovesdata,
        visible: visible1,
        getPosition: function getPosition(d) {
          return d.coordinates;
        },
        getColor: function getColor(d) {
          return d.color1 || d.color;
        },
        getElevation: function getElevation(d) {
          return d.elevation1 || 0;
        },
        opacity: 0.25,
        pickable: true,
        onHover: this.onHover,
        onClick: this.onClick,
        cellSize: 10,
        elevationScale: elevationScale,
        lightSettings: LIGHT_SETTINGS
      }), new _deck.GridCellLayer({
        id: 'busmoves-opt2',
        data: busmovesdata,
        visible: visible1,
        getPosition: function getPosition(d) {
          return [d.coordinates[0], d.coordinates[1] - 0.00012, d.coordinates[2]];
        },
        getColor: function getColor(d) {
          return d.color2 || d.color;
        },
        getElevation: function getElevation(d) {
          return d.elevation2 || 0;
        },
        opacity: 0.25,
        pickable: true,
        onHover: this.onHover,
        onClick: this.onClick,
        cellSize: 10,
        elevationScale: elevationScale,
        lightSettings: LIGHT_SETTINGS
      }), new _deck.GridCellLayer({
        id: 'busmoves-opt3',
        data: busmovesdata,
        visible: visible1,
        getPosition: function getPosition(d) {
          return [d.coordinates[0] - 0.00014, d.coordinates[1], d.coordinates[2]];
        },
        getColor: function getColor(d) {
          return d.color3 || d.color;
        },
        getElevation: function getElevation(d) {
          return d.elevation3 || 0;
        },
        opacity: 0.25,
        pickable: true,
        onHover: this.onHover,
        onClick: this.onClick,
        cellSize: 10,
        elevationScale: elevationScale,
        lightSettings: LIGHT_SETTINGS
      }), new _deck.GridCellLayer({
        id: 'busmoves-opt4',
        data: busmovesdata,
        visible: visible1,
        getPosition: function getPosition(d) {
          return [d.coordinates[0] - 0.00014, d.coordinates[1] - 0.00012, d.coordinates[2]];
        },
        getColor: function getColor(d) {
          return d.color4 || d.color;
        },
        getElevation: function getElevation(d) {
          return d.elevation4 || 0;
        },
        opacity: 0.25,
        pickable: true,
        onHover: this.onHover,
        onClick: this.onClick,
        cellSize: 10,
        elevationScale: elevationScale,
        lightSettings: LIGHT_SETTINGS
      }), new _deck.ScatterplotLayer({
        id: 'busstops',
        data: busstopsdata,
        radiusScale: 1,
        getPosition: function getPosition(d) {
          return d.coordinates;
        },
        getColor: function getColor(d) {
          return d.color;
        },
        getRadius: function getRadius(d) {
          return d.radius * (viewport.zoom >= 11.5 ? 1 : (11.5 - viewport.zoom) * 2 + 1);
        },
        opacity: 0.5,
        pickable: true,
        onHover: this.onHover,
        onClick: this.onClick
      }), new _deck.GridCellLayer({
        id: 'busstops-opt1',
        data: busstopsdata,
        visible: visible2,
        getPosition: function getPosition(d) {
          return [d.coordinates[0] + 0.00032, d.coordinates[1], d.coordinates[2]];
        },
        getColor: function getColor(d) {
          return d.color1 || d.color;
        },
        getElevation: function getElevation(d) {
          return d.elevation1 || 0;
        },
        opacity: 0.25,
        pickable: true,
        onHover: this.onHover,
        cellSize: 15,
        elevationScale: elevationScale,
        lightSettings: LIGHT_SETTINGS
      }), new _deck.GridCellLayer({
        id: 'busstops-opt2',
        data: busstopsdata,
        visible: visible2,
        getPosition: function getPosition(d) {
          return [d.coordinates[0] + 0.00032, d.coordinates[1] - 0.00015, d.coordinates[2]];
        },
        getColor: function getColor(d) {
          return d.color2 || d.color;
        },
        getElevation: function getElevation(d) {
          return d.elevation2 || 0;
        },
        opacity: 0.25,
        pickable: true,
        onHover: this.onHover,
        cellSize: 15,
        elevationScale: elevationScale,
        lightSettings: LIGHT_SETTINGS
      }), new _deck.GridCellLayer({
        id: 'busstops-opt3',
        data: busstopsdata,
        visible: visible2,
        getPosition: function getPosition(d) {
          return [d.coordinates[0] - 0.0005, d.coordinates[1], d.coordinates[2]];
        },
        getColor: function getColor(d) {
          return d.color3 || d.color;
        },
        getElevation: function getElevation(d) {
          return d.elevation3 || 0;
        },
        opacity: 0.25,
        pickable: true,
        onHover: this.onHover,
        cellSize: 15,
        elevationScale: elevationScale,
        lightSettings: LIGHT_SETTINGS
      }), new _deck.GridCellLayer({
        id: 'busstops-opt4',
        data: busstopsdata,
        visible: visible2,
        getPosition: function getPosition(d) {
          return [d.coordinates[0] - 0.0005, d.coordinates[1] - 0.00015, d.coordinates[2]];
        },
        getColor: function getColor(d) {
          return d.color4 || d.color;
        },
        getElevation: function getElevation(d) {
          return d.elevation4 || 0;
        },
        opacity: 0.25,
        pickable: true,
        onHover: this.onHover,
        cellSize: 15,
        elevationScale: elevationScale,
        lightSettings: LIGHT_SETTINGS
      }), new _deck.GridCellLayer({
        id: 'grid-cell-layer',
        data: rainfall,
        opacity: cellopacity,
        cellSize: cellSize,
        elevationScale: 20,
        lightSettings: LIGHT_SETTINGS
      }), new _deck.LineLayer({
        id: 'route-paths',
        data: routePaths,
        strokeWidth: viewport.zoom - 10 + 1.5,
        fp64: false,
        pickable: false
      })];

      return _react2.default.createElement(_deck2.default, (0, _extends3.default)({}, viewport, { layers: layers, onWebGLInitialized: this.initialize }));
    }
  }]);
  return DeckGLOverlay;
}(_react.Component);

exports.default = DeckGLOverlay;