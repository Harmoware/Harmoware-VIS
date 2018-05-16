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
  delayheight: 0,
  secpermin: 3,
  delayrange: 10,
  elevationScale: 5,
  cellSize: 0,
  bsoptFname: '',
  xbandFname: '',
  selectedBusstop: '',
  selectedBus: '',
  answer: '',
  clicked: null,
  hovered: null,
  animatePause: false,
  animateReverse: false
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.SETDELAYHEIGHT:
      return function () {
        var delayheight = action.height;
        return (0, _assign2.default)({}, state, {
          delayheight: delayheight
        });
      }();
    case types.SETSCALEELEVATION:
      return function () {
        var elevationScale = action.elevation;
        return (0, _assign2.default)({}, state, {
          elevationScale: elevationScale
        });
      }();
    case types.SETCELLSIZE:
      return function () {
        var cellSize = action.cellSize;
        return (0, _assign2.default)({}, state, {
          cellSize: cellSize
        });
      }();
    case types.SETBSOPTFNAME:
      return function () {
        var bsoptFname = action.name;
        return (0, _assign2.default)({}, state, {
          bsoptFname: bsoptFname
        });
      }();
    case types.SETXBANDFNAME:
      return function () {
        var xbandFname = action.xbandFname;
        return (0, _assign2.default)({}, state, {
          xbandFname: xbandFname
        });
      }();
    case types.SETDELAYRANGE:
      return function () {
        var delayrange = action.delayrange;
        return (0, _assign2.default)({}, state, {
          delayrange: delayrange
        });
      }();
    case types.SETANSWER:
      return function () {
        var answer = action.answer;
        return (0, _assign2.default)({}, state, {
          answer: answer
        });
      }();
    case types.SETCLICKED:
      return function () {
        var clicked = action.clicked;
        return (0, _assign2.default)({}, state, {
          clicked: clicked
        });
      }();
    case types.SETHOVERED:
      return function () {
        var hovered = action.hovered;
        return (0, _assign2.default)({}, state, {
          hovered: hovered
        });
      }();
    case types.SETSELECTEDBUSSTOP:
      return function () {
        var selectedBusstop = action.busstop;
        return (0, _assign2.default)({}, state, {
          selectedBusstop: selectedBusstop
        });
      }();
    case types.SETSELECTEDBUS:
      return function () {
        var selectedBus = action.selectedBus;
        return (0, _assign2.default)({}, state, {
          selectedBus: selectedBus
        });
      }();
    case types.SETANIMATEPAUSE:
      return function () {
        var animatePause = action.pause;
        return (0, _assign2.default)({}, state, {
          animatePause: animatePause
        });
      }();
    case types.SETANIMATEREVERSE:
      return function () {
        var animateReverse = action.reverse;
        return (0, _assign2.default)({}, state, {
          animateReverse: animateReverse
        });
      }();
    case types.SETSECPERMIN:
      return function () {
        var secpermin = action.secpermin;
        return (0, _assign2.default)({}, state, {
          secpermin: secpermin
        });
      }();
    default:
      return state;
  }
};