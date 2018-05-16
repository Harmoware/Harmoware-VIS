'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _actionTypes = require('../constants/action-types');

var types = _interopRequireWildcard(_actionTypes);

var _library = require('../library');

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
  },
  lightSettings: {
    lightsPosition: [137.087638, 34.883046, 8000, 137.399026, 35.13819, 8000],
    ambientRatio: 0.2,
    diffuseRatio: 0.5,
    specularRatio: 0.3,
    lightsStrength: [1.0, 0.0, 2.0, 0.0],
    numberOfLights: 2
  },
  settime: 0,
  starttimestamp: 0,
  timeLength: 0,
  timeBegin: 0,
  loopTime: 0,
  leading: 100,
  trailing: 180,
  beforeFrameTimestamp: 0,
  movesbase: [],
  depotsBase: [],
  bounds: {
    westlongitiude: 0,
    eastlongitiude: 0,
    southlatitude: 0,
    northlatitude: 0
  },
  animatePause: false,
  animateReverse: false,
  secpermin: 3,
  clickedObject: null,
  routePaths: [],
  defaultZoom: 11.1,
  defaultPitch: 30,
  getMovesOptionFunc: null,
  getDepotsOptionFunc: null,
  movedData: [],
  depotsData: [],
  rainfall: []
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
    case types.SETLIGHTSETTINGS:
      return function () {
        var lightSettings = (0, _assign2.default)({}, state.lightSettings, action.lightSettings);
        return (0, _assign2.default)({}, state, {
          lightSettings: lightSettings
        });
      }();
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
        var starttimestamp = Date.now() - settime / state.timeLength * state.loopTime;
        return (0, _assign2.default)({}, state, {
          settime: settime, starttimestamp: starttimestamp
        });
      }();
    case types.INCREASETIME:
      return function () {
        var latestProps = action.props;
        var now = Date.now();
        if (now - state.starttimestamp > state.loopTime) {
          console.log('settime overlap.');
          var _settime = 0 - state.leading;
          var starttimestamp = now - _settime / state.timeLength * state.loopTime;
          var _setProps = (0, _extends3.default)({}, latestProps, { settime: _settime, starttimestamp: starttimestamp });
          var _movedData = (0, _library.getMoveObjects)(_setProps);
          var _depotsData = (0, _library.getDepots)(_setProps);
          return (0, _assign2.default)({}, state, {
            settime: _settime, starttimestamp: starttimestamp, movedData: _movedData, depotsData: _depotsData
          });
        }
        var beforeSettime = state.settime;
        var settime = (now - state.starttimestamp) % state.loopTime / state.loopTime * state.timeLength;
        if (beforeSettime > settime) {
          console.log(beforeSettime + ' ' + settime);
        }
        var beforeFrameTimestamp = now;
        var setProps = (0, _extends3.default)({}, latestProps, { settime: settime, beforeFrameTimestamp: beforeFrameTimestamp });
        var movedData = (0, _library.getMoveObjects)(setProps);
        var depotsData = (0, _library.getDepots)(setProps);
        return (0, _assign2.default)({}, state, {
          settime: settime, beforeFrameTimestamp: beforeFrameTimestamp, movedData: movedData, depotsData: depotsData
        });
      }();
    case types.DECREASETIME:
      return function () {
        var latestProps = action.props;
        var now = Date.now();
        var beforeFrameElapsed = now - state.beforeFrameTimestamp;
        var starttimestamp = state.starttimestamp + beforeFrameElapsed * 2;
        var settime = (now - state.starttimestamp) % state.loopTime / state.loopTime * state.timeLength;
        if (settime <= 0 - state.leading) {
          settime = state.timeLength;
          starttimestamp = now - settime / state.timeLength * state.loopTime;
        }
        var beforeFrameTimestamp = now;
        var setProps = (0, _extends3.default)({}, latestProps, { settime: settime, starttimestamp: starttimestamp, beforeFrameTimestamp: beforeFrameTimestamp });
        var movedData = (0, _library.getMoveObjects)(setProps);
        var depotsData = (0, _library.getDepots)(setProps);
        return (0, _assign2.default)({}, state, {
          settime: settime, starttimestamp: starttimestamp, beforeFrameTimestamp: beforeFrameTimestamp, movedData: movedData, depotsData: depotsData
        });
      }();
    case types.SETLEADING:
      return function () {
        var leading = action.leading;
        return (0, _assign2.default)({}, state, {
          leading: leading
        });
      }();
    case types.SETTRAILING:
      return function () {
        var trailing = action.trailing;
        return (0, _assign2.default)({}, state, {
          trailing: trailing
        });
      }();
    case types.SETFRAMETIMESTAMP:
      return function () {
        var latestProps = action.props;
        var beforeFrameTimestamp = Date.now();
        var setProps = (0, _extends3.default)({}, latestProps, { beforeFrameTimestamp: beforeFrameTimestamp });
        var movedData = (0, _library.getMoveObjects)(setProps);
        var depotsData = (0, _library.getDepots)(setProps);
        return (0, _assign2.default)({}, state, {
          beforeFrameTimestamp: beforeFrameTimestamp, movedData: movedData, depotsData: depotsData
        });
      }();
    case types.SETMOVESBASE:
      return function () {
        var analyzeData = (0, _library.analyzeMovesBase)(action.base);
        var settime = state.leading * -1;
        var timeBegin = analyzeData.timeBegin,
            bounds = analyzeData.bounds,
            movesbase = analyzeData.movesbase;
        var timeLength = analyzeData.timeLength;

        if (timeLength > 0) {
          timeLength += state.trailing;
        }
        var loopTime = (0, _library.calcLoopTime)(timeLength, state.secpermin);
        // starttimestampはDate.now()の値でいいが、スタート時はleading分の余白時間を付加する
        var starttimestamp = Date.now() + (0, _library.calcLoopTime)(state.leading, state.secpermin);
        var viewport = (0, _assign2.default)({}, state.viewport, analyzeData.viewport, { zoom: state.defaultZoom, pitch: state.defaultPitch });
        return (0, _assign2.default)({}, state, {
          timeBegin: timeBegin,
          timeLength: timeLength,
          bounds: bounds,
          movesbase: movesbase,
          viewport: viewport,
          settime: settime,
          loopTime: loopTime,
          starttimestamp: starttimestamp
        });
      }();
    case types.SETDEPOTSBASE:
      return function () {
        var depotsBase = action.depotsBase;
        return (0, _assign2.default)({}, state, {
          depotsBase: depotsBase
        });
      }();
    case types.SETANIMATEPAUSE:
      return function () {
        var animatePause = action.pause;
        var starttimestamp = Date.now() - state.settime / state.timeLength * state.loopTime;
        return (0, _assign2.default)({}, state, {
          animatePause: animatePause, starttimestamp: starttimestamp
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
        var loopTime = (0, _library.calcLoopTime)(state.timeLength, secpermin);
        var starttimestamp = state.starttimestamp;
        if (!state.animatePause) {
          starttimestamp = Date.now() - state.settime / state.timeLength * loopTime;
        }
        return (0, _assign2.default)({}, state, {
          secpermin: secpermin, loopTime: loopTime, starttimestamp: starttimestamp
        });
      }();
    case types.SETCLICKED:
      return function () {
        var clickedObject = action.clickedObject;
        return (0, _assign2.default)({}, state, {
          clickedObject: clickedObject
        });
      }();
    case types.SETROUTEPATHS:
      return function () {
        var routePaths = action.paths;
        return (0, _assign2.default)({}, state, {
          routePaths: routePaths
        });
      }();
    case types.SETDEFAULTZOOM:
      return function () {
        var defaultZoom = action.defaultZoom;
        return (0, _assign2.default)({}, state, {
          defaultZoom: defaultZoom
        });
      }();
    case types.SETDEFAULTPITCH:
      return function () {
        var defaultPitch = action.defaultPitch;
        return (0, _assign2.default)({}, state, {
          defaultPitch: defaultPitch
        });
      }();
    case types.SETMOVESOPTIONFUNC:
      return function () {
        var getMovesOptionFunc = action.func;
        return (0, _assign2.default)({}, state, {
          getMovesOptionFunc: getMovesOptionFunc
        });
      }();
    case types.SETDEPOTSOPTIONFUNC:
      return function () {
        var getDepotsOptionFunc = action.func;
        return (0, _assign2.default)({}, state, {
          getDepotsOptionFunc: getDepotsOptionFunc
        });
      }();
    case types.SETRAINFALL:
      return function () {
        var rainfall = action.rainfall;
        return (0, _assign2.default)({}, state, {
          rainfall: rainfall
        });
      }();
    default:
      return state;
  }
};