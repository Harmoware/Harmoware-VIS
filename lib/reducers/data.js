'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _actionTypes = require('../constants/action-types');

var types = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  bounds: {},
  rainfall: [],
  answers: [],
  routePaths: [],
  busoption: {},
  busstopscsv: [],
  busstopsbase: [],
  busmovesbase: [],
  busmovesbasedic: {},
  routesdata: {},
  busroutes: {}
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.SETBOUNDS:
      return function () {
        var bounds = action.bounds;
        return (0, _assign2.default)({}, state, {
          bounds: bounds
        });
      }();
    case types.SETRAINFALL:
      return function () {
        var rainfall = action.rainfall;
        return (0, _assign2.default)({}, state, {
          rainfall: rainfall
        });
      }();
    case types.SETANSWERS:
      return function () {
        var answers = action.answers;
        return (0, _assign2.default)({}, state, {
          answers: answers
        });
      }();
    case types.SETROUTEPATHS:
      return function () {
        var routePaths = action.paths;
        return (0, _assign2.default)({}, state, {
          routePaths: routePaths
        });
      }();
    case types.SETBUSOPTION:
      return function () {
        var busoption = action.option;
        return (0, _assign2.default)({}, state, {
          busoption: busoption
        });
      }();
    case types.SETBUSSTOPSCSV:
      return function () {
        var busstopscsv = action.csv;
        return (0, _assign2.default)({}, state, {
          busstopscsv: busstopscsv
        });
      }();
    case types.SETBUSSTOPSBASE:
      return function () {
        var busstopsbase = action.busstopsbase;
        return (0, _assign2.default)({}, state, {
          busstopsbase: busstopsbase
        });
      }();
    case types.SETBUSMOVESBASE:
      return function () {
        var busmovesbase = action.base;
        return (0, _assign2.default)({}, state, {
          busmovesbase: busmovesbase
        });
      }();
    case types.SETBUSMOVESBASEDIC:
      return function () {
        var busmovesbasedic = action.dic;
        return (0, _assign2.default)({}, state, {
          busmovesbasedic: busmovesbasedic
        });
      }();
    case types.SETBUSMOVESDATA:
      return function () {
        var bounds = action.bounds,
            busmovesbase = action.busmovesbase,
            busmovesbasedic = action.busmovesbasedic;

        return (0, _assign2.default)({}, state, {
          bounds: bounds, busmovesbase: busmovesbase, busmovesbasedic: busmovesbasedic
        });
      }();
    case types.SETBUSTRIPSCSV:
      return function () {
        var bustripscsv = action.csv;
        return (0, _assign2.default)({}, state, {
          bustripscsv: bustripscsv
        });
      }();
    case types.SETROUTESDATA:
      return function () {
        var routesdata = action.routes;
        return (0, _assign2.default)({}, state, {
          routesdata: routesdata
        });
      }();
    case types.SETBUSROUTES:
      return function () {
        var busroutes = action.routes;
        return (0, _assign2.default)({}, state, {
          busroutes: busroutes
        });
      }();
    default:
      return state;
  }
};