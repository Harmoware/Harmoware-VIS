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
  settime: 0,
  starttimestamp: 0,
  timeLength: 0,
  timeBegin: 0,
  loopTime: 70000 / 60 * 1000 * 2,
  leading: 100,
  trailing: 180,
  beforeFrameTimestamp: 0
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.ADDMINUTES:
      return function () {
        var settime = state.settime + action.min * 60;
        if (settime <= 0 - state.leading) {
          settime = 0 - state.leading;
        }
        var starttimestamp = Date.now() - settime / state.timeLength * state.loopTime;
        return (0, _assign2.default)({}, state, {
          settime: settime, starttimestamp: starttimestamp
        });
      }();
    case types.SETTIMESTAMP:
      return function () {
        var starttimestamp = action.time;
        return (0, _assign2.default)({}, state, {
          starttimestamp: starttimestamp
        });
      }();
    case types.SETTIME:
      return function () {
        var settime = action.time;
        return (0, _assign2.default)({}, state, {
          settime: settime
        });
      }();
    case types.SETTIMESETTINGS:
      return function () {
        var timeBegin = action.timeBegin,
            timeLength = action.timeLength,
            loopTime = action.loopTime,
            starttimestamp = action.starttimestamp;

        return (0, _assign2.default)({}, state, {
          timeBegin: timeBegin,
          timeLength: timeLength,
          loopTime: loopTime,
          starttimestamp: starttimestamp
        });
      }();
    case types.INCREASETIME:
      return function () {
        var now = Date.now();
        if (now - state.starttimestamp > state.loopTime) {
          console.log('settime overlap.');
          var _settime = 0 - state.leading;
          var starttimestamp = now - _settime / state.timeLength * state.loopTime;
          return (0, _assign2.default)({}, state, {
            settime: _settime, starttimestamp: starttimestamp
          });
        }
        var beforeSettime = state.settime;
        var settime = (now - state.starttimestamp) % state.loopTime / state.loopTime * state.timeLength;
        if (beforeSettime > settime) {
          console.log(beforeSettime + ' ' + settime);
        }
        var beforeFrameTimestamp = now;
        return (0, _assign2.default)({}, state, {
          settime: settime, beforeFrameTimestamp: beforeFrameTimestamp
        });
      }();
    case types.DECREASETIME:
      return function () {
        var now = Date.now();
        var beforeFrameElapsed = now - state.beforeFrameTimestamp;
        var starttimestamp = state.starttimestamp + beforeFrameElapsed * 2;
        var settime = (now - state.starttimestamp) % state.loopTime / state.loopTime * state.timeLength;
        if (settime <= 0 - state.leading) {
          settime = state.timeLength;
          starttimestamp = now - settime / state.timeLength * state.loopTime;
        }
        var beforeFrameTimestamp = now;
        return (0, _assign2.default)({}, state, {
          settime: settime, starttimestamp: starttimestamp, beforeFrameTimestamp: beforeFrameTimestamp
        });
      }();
    case types.SETLOOPTIME:
      return function () {
        var loopTime = action.loopTime;
        return (0, _assign2.default)({}, state, {
          loopTime: loopTime
        });
      }();
    case types.SETLEADING:
      return function () {
        var leading = action.leading;
        return (0, _assign2.default)({}, state, {
          leading: leading
        });
      }();
    case types.SETFRAMETIMESTAMP:
      return function () {
        var beforeFrameTimestamp = Date.now();
        return (0, _assign2.default)({}, state, {
          beforeFrameTimestamp: beforeFrameTimestamp
        });
      }();
    default:
      return state;
  }
};