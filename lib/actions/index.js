'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLinemapData = exports.setNonmapView = exports.setRainfall = exports.setDepotsOptionFunc = exports.setMovesOptionFunc = exports.setDefaultPitch = exports.setDefaultZoom = exports.setRoutePaths = exports.setClicked = exports.setSecPerHour = exports.setAnimateReverse = exports.setAnimatePause = exports.setDepotsBase = exports.setMovesBase = exports.setLightSettings = exports.setViewport = exports.setTrailing = exports.setLeading = exports.setTime = exports.setTimeStamp = exports.setFrameTimestamp = exports.decreaseTime = exports.increaseTime = exports.addMinutes = undefined;

var _actionTypes = require('../constants/action-types');

var types = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var addMinutes = exports.addMinutes = function addMinutes(min) {
  return { type: types.ADDMINUTES, min: min };
};

var increaseTime = exports.increaseTime = function increaseTime(props) {
  return { type: types.INCREASETIME, props: props };
};

var decreaseTime = exports.decreaseTime = function decreaseTime(props) {
  return { type: types.DECREASETIME, props: props };
};

var setFrameTimestamp = exports.setFrameTimestamp = function setFrameTimestamp(props) {
  return { type: types.SETFRAMETIMESTAMP, props: props };
};

var setTimeStamp = exports.setTimeStamp = function setTimeStamp(props) {
  return { type: types.SETTIMESTAMP, props: props };
};

var setTime = exports.setTime = function setTime(time) {
  return { type: types.SETTIME, time: time };
};

var setLeading = exports.setLeading = function setLeading(leading) {
  return { type: types.SETLEADING, leading: leading };
};

var setTrailing = exports.setTrailing = function setTrailing(trailing) {
  return { type: types.SETTRAILING, trailing: trailing };
};

var setViewport = exports.setViewport = function setViewport(viewport) {
  return { type: types.SETVIEWPORT, viewport: viewport };
};

var setLightSettings = exports.setLightSettings = function setLightSettings(lightSettings) {
  return { type: types.SETLIGHTSETTINGS, lightSettings: lightSettings };
};

var setMovesBase = exports.setMovesBase = function setMovesBase(base) {
  return { type: types.SETMOVESBASE, base: base };
};

var setDepotsBase = exports.setDepotsBase = function setDepotsBase(depotsBase) {
  return { type: types.SETDEPOTSBASE, depotsBase: depotsBase };
};

var setAnimatePause = exports.setAnimatePause = function setAnimatePause(pause) {
  return { type: types.SETANIMATEPAUSE, pause: pause };
};

var setAnimateReverse = exports.setAnimateReverse = function setAnimateReverse(reverse) {
  return { type: types.SETANIMATEREVERSE, reverse: reverse };
};

var setSecPerHour = exports.setSecPerHour = function setSecPerHour(secperhour) {
  return { type: types.SETSECPERHOUR, secperhour: secperhour };
};

var setClicked = exports.setClicked = function setClicked(clickedObject) {
  return { type: types.SETCLICKED, clickedObject: clickedObject };
};

var setRoutePaths = exports.setRoutePaths = function setRoutePaths(paths) {
  return { type: types.SETROUTEPATHS, paths: paths };
};

var setDefaultZoom = exports.setDefaultZoom = function setDefaultZoom(defaultZoom) {
  return { type: types.SETDEFAULTZOOM, defaultZoom: defaultZoom };
};

var setDefaultPitch = exports.setDefaultPitch = function setDefaultPitch(defaultPitch) {
  return { type: types.SETDEFAULTPITCH, defaultPitch: defaultPitch };
};

var setMovesOptionFunc = exports.setMovesOptionFunc = function setMovesOptionFunc(func) {
  return { type: types.SETMOVESOPTIONFUNC, func: func };
};

var setDepotsOptionFunc = exports.setDepotsOptionFunc = function setDepotsOptionFunc(func) {
  return { type: types.SETDEPOTSOPTIONFUNC, func: func };
};

var setRainfall = exports.setRainfall = function setRainfall(rainfall) {
  return { type: types.SETRAINFALL, rainfall: rainfall };
};

var setNonmapView = exports.setNonmapView = function setNonmapView(nonmapView) {
  return { type: types.SETNONMAPVIEW, nonmapView: nonmapView };
};

var setLinemapData = exports.setLinemapData = function setLinemapData(linemapData) {
  return { type: types.SETLINEMAPDATA, linemapData: linemapData };
};