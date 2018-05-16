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
  viewport: {
    longitude: 136.906428,
    latitude: 35.181453,
    zoom: 11.1,
    maxZoom: 16,
    minZoom: 8,
    pitch: 30,
    bearing: 0,
    width: 500,
    height: 500
  }
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.SETVIEWPORT:
      return function () {
        var viewport = (0, _assign2.default)({}, state.viewport, action.viewport);
        return (0, _assign2.default)({}, state, {
          viewport: viewport
        });
      }();
    default:
      return state;
  }
};