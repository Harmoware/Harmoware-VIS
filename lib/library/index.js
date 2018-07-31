'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCombinedReducer = exports.connectToHarmowareVis = exports.defaultMapStateToProps = exports.analyzelinemapData = exports.getClickedObjectToBeRemoved = exports.getMoveObjects = exports.getDepots = exports.analyzeDepotsBase = exports.analyzeMovesBase = exports.calcLoopTime = exports.getContainerProp = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _actions = require('../actions');

var Actions = _interopRequireWildcard(_actions);

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scaleInfo = { scaleZ: 0, xMid: 0, yMid: 0 };
var EQUATOR_RADIUS = 6378136.6;
var DEGREE_SCALE = 100;
var getLongitiudeDegree = function getLongitiudeDegree(latitude) {
  return 360 * DEGREE_SCALE / (2 * Math.PI * (EQUATOR_RADIUS * Math.cos(latitude * Math.PI / 180.0)));
};

var getContainerProp = exports.getContainerProp = function getContainerProp(state) {
  return (0, _extends3.default)({}, state.base);
};

// LoopTime とは１ループにかける時間（ミリ秒）
var calcLoopTime = exports.calcLoopTime = function calcLoopTime(timeLength, secperhour) {
  return timeLength / 3600 * 1000 * secperhour;
};

function normalize(nonmapView, movesbase) {
  if (!nonmapView) return movesbase;
  var xMin = Infinity;
  var yMin = Infinity;
  var xMax = -Infinity;
  var yMax = -Infinity;
  for (var i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
    var operation = movesbase[i].operation;

    for (var j = 0, lengthj = operation.length; j < lengthj; j += 1) {
      var position = operation[j].position;

      xMin = Math.min(xMin, position[0]);
      yMin = Math.min(yMin, position[1]);
      xMax = Math.max(xMax, position[0]);
      yMax = Math.max(yMax, position[1]);
    }
  }
  scaleInfo.xMid = (xMin + xMax) / 2;
  scaleInfo.yMid = (yMin + yMax) / 2;
  scaleInfo.scaleZ = getLongitiudeDegree(scaleInfo.yMid);
  for (var k = 0, lengthk = movesbase.length; k < lengthk; k += 1) {
    var _operation = movesbase[k].operation;

    for (var l = 0, lengthl = _operation.length; l < lengthl; l += 1) {
      var _position = _operation[l].position;

      _position[0] = (_position[0] - scaleInfo.xMid) / scaleInfo.scaleZ;
      _position[1] = (_position[1] - scaleInfo.yMid) / scaleInfo.scaleZ;
      _position[2] /= DEGREE_SCALE;
    }
  }
  return movesbase;
}

var analyzeMovesBase = exports.analyzeMovesBase = function analyzeMovesBase(nonmapView, inputData) {
  var baseTimeBegin = void 0;
  var baseTimeLength = void 0;
  var baseBounds = void 0;
  var basemovesbase = void 0;

  if (Array.isArray(inputData)) {
    // Array?
    basemovesbase = inputData;
  } else {
    baseTimeBegin = inputData.timeBegin;
    baseTimeLength = inputData.timeLength;
    baseBounds = inputData.bounds;
    basemovesbase = inputData.movesbase;
  }

  var timeBegin = typeof baseTimeBegin === 'number' ? baseTimeBegin : 0;
  var timeLength = typeof baseTimeLength === 'number' ? baseTimeLength : 0;
  var bounds = typeof baseBounds !== 'undefined' ? baseBounds : {
    westlongitiude: 0, eastlongitiude: 0, southlatitude: 0, northlatitude: 0
  };

  var movesbase = basemovesbase.slice();
  var timeEnd = 0;
  for (var i = 0, lengthi = basemovesbase.length; i < lengthi; i += 1) {
    var _basemovesbase$i = basemovesbase[i],
        departuretime = _basemovesbase$i.departuretime,
        arrivaltime = _basemovesbase$i.arrivaltime,
        operation = _basemovesbase$i.operation;

    if (!baseTimeBegin || !baseTimeLength) {
      timeBegin = !timeBegin ? departuretime : Math.min(timeBegin, departuretime);
      timeEnd = !timeEnd ? arrivaltime : Math.max(timeEnd, arrivaltime);
    }

    for (var j = 0, lengthj = operation.length; j < lengthj; j += 1) {
      var position = operation[j].position;
      var _operation$j = operation[j],
          longitude = _operation$j.longitude,
          latitude = _operation$j.latitude;

      if (typeof position !== 'undefined') {
        longitude = position[0];
        latitude = position[1];
      } else {
        operation[j].position = [longitude, latitude, 3];
      }
      if (!baseBounds && longitude && latitude && !nonmapView) {
        var _ref = bounds || {},
            eastlongitiude = _ref.eastlongitiude,
            westlongitiude = _ref.westlongitiude,
            southlatitude = _ref.southlatitude,
            northlatitude = _ref.northlatitude;

        eastlongitiude = !eastlongitiude ? longitude : Math.max(eastlongitiude, longitude);
        westlongitiude = !westlongitiude ? longitude : Math.min(westlongitiude, longitude);
        southlatitude = !southlatitude ? latitude : Math.min(southlatitude, latitude);
        northlatitude = !northlatitude ? latitude : Math.max(northlatitude, latitude);
        bounds = { eastlongitiude: eastlongitiude, westlongitiude: westlongitiude, southlatitude: southlatitude, northlatitude: northlatitude };
      }
    }
  }
  if (!baseTimeBegin || !baseTimeLength) {
    timeLength = timeEnd - timeBegin;
    for (var k = 0, lengthk = basemovesbase.length; k < lengthk; k += 1) {
      movesbase[k].departuretime -= timeBegin;
      movesbase[k].arrivaltime -= timeBegin;
      var _operation2 = basemovesbase[k].operation;

      for (var l = 0, lengthl = _operation2.length; l < lengthl; l += 1) {
        _operation2[l].elapsedtime -= timeBegin;
      }
    }
  }
  var viewport = nonmapView ? {
    lookAt: [0, 0, 0], distance: 200, rotationX: 60, rotationY: 0, fov: 50
  } : {
    longitude: (bounds.westlongitiude + bounds.eastlongitiude) / 2,
    latitude: (bounds.southlatitude + bounds.southlatitude + bounds.northlatitude) / 3
  };
  return { timeBegin: timeBegin, timeLength: timeLength, bounds: bounds, movesbase: normalize(nonmapView, movesbase), viewport: viewport };
};

var analyzeDepotsBase = exports.analyzeDepotsBase = function analyzeDepotsBase(nonmapView, depotsBase) {
  if (!nonmapView) return depotsBase;
  var xMin = Infinity;
  var yMin = Infinity;
  var xMax = -Infinity;
  var yMax = -Infinity;
  for (var i = 0, lengthi = depotsBase.length; i < lengthi; i += 1) {
    var position = depotsBase[i].position;

    xMin = Math.min(xMin, position[0]);
    yMin = Math.min(yMin, position[1]);
    xMax = Math.max(xMax, position[0]);
    yMax = Math.max(yMax, position[1]);
  }
  var xMid = scaleInfo.xMid || (xMin + xMax) / 2;
  var yMid = scaleInfo.yMid || (yMin + yMax) / 2;
  var scaleZ = scaleInfo.scaleZ || getLongitiudeDegree(yMid);
  for (var j = 0, lengthj = depotsBase.length; j < lengthj; j += 1) {
    var _position2 = depotsBase[j].position;

    _position2[0] = (_position2[0] - xMid) / scaleZ;
    _position2[1] = (_position2[1] - yMid) / scaleZ;
    _position2[2] /= DEGREE_SCALE;
  }
  if (!scaleInfo.xMid) scaleInfo.xMid = xMid;
  if (!scaleInfo.yMid) scaleInfo.yMid = yMid;
  if (!scaleInfo.scaleZ) scaleInfo.scaleZ = scaleZ;
  return depotsBase;
};

var defDepotsOptionFunc = function defDepotsOptionFunc(props, idx) {
  var _ref2 = props.depotsBase[idx],
      color = _ref2.color,
      optColor = _ref2.optColor,
      optElevation = _ref2.optElevation,
      normal = _ref2.normal;

  var retValue = {};
  if (color) retValue.color = color;
  if (optColor) retValue.optColor = optColor;
  if (optElevation) retValue.optElevation = optElevation;
  if (normal) retValue.normal = normal;
  return retValue;
};
var getDepots = exports.getDepots = function getDepots(props) {
  var nonmapView = props.nonmapView,
      depotsBase = props.depotsBase,
      bounds = props.bounds,
      getDepotsOptionFunc = props.getDepotsOptionFunc;

  var depotsData = [];
  var getOptionFunction = getDepotsOptionFunc || defDepotsOptionFunc;

  if (nonmapView || depotsBase.length > 0 && typeof bounds !== 'undefined' && (0, _keys2.default)(bounds).length > 0) {
    for (var i = 0, lengthi = depotsBase.length; i < lengthi; i += 1) {
      var _depotsBase$i = depotsBase[i],
          longitude = _depotsBase$i.longitude,
          latitude = _depotsBase$i.latitude;
      var position = depotsBase[i].position;

      if (typeof position === 'undefined') {
        position = [longitude, latitude, 1];
      }
      if (nonmapView || bounds.westlongitiude <= position[0] && position[0] <= bounds.eastlongitiude && bounds.southlatitude <= position[1] && position[1] <= bounds.northlatitude) {
        var itemmap = (0, _extends3.default)({
          position: [parseFloat(position[0]), parseFloat(position[1]), parseFloat(position[2])]
        }, getOptionFunction(props, i));
        depotsData.push(itemmap);
      }
    }
  }
  return depotsData;
};

var defMovesOptionFunc = function defMovesOptionFunc(props, idx1, idx2) {
  var _ref3 = props.movesbase[idx1].operation[idx2],
      color = _ref3.color,
      optColor = _ref3.optColor,
      optElevation = _ref3.optElevation,
      normal = _ref3.normal;

  var retValue = {};
  if (color) retValue.color = color;
  if (optColor) retValue.optColor = optColor;
  if (optElevation) retValue.optElevation = optElevation;
  if (normal) retValue.normal = normal;
  return retValue;
};
var getMoveObjects = exports.getMoveObjects = function getMoveObjects(props) {
  var movesbase = props.movesbase,
      settime = props.settime,
      timeBegin = props.timeBegin,
      timeLength = props.timeLength,
      getMovesOptionFunc = props.getMovesOptionFunc;

  var movedData = [];
  var getOptionFunction = getMovesOptionFunc || defMovesOptionFunc;

  for (var i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
    var _movesbase$i = movesbase[i],
        departuretime = _movesbase$i.departuretime,
        arrivaltime = _movesbase$i.arrivaltime,
        operation = _movesbase$i.operation;

    if (typeof departuretime !== 'number' || typeof arrivaltime !== 'number') {
      // console.log(`バス運行実績データなし=>${i}`);
    } else if (timeBegin > 0 && timeLength > 0 && departuretime <= settime && settime < arrivaltime) {
      for (var j = 0, lengthj = operation.length; j < lengthj - 1; j += 1) {
        var _operation$j2 = operation[j],
            elapsedtime = _operation$j2.elapsedtime,
            position = _operation$j2.position;
        var _operation3 = operation[j + 1],
            nextelapsedtime = _operation3.elapsedtime,
            nextposition = _operation3.position;

        if (elapsedtime <= settime && settime < nextelapsedtime) {
          var elapsedtimespan = settime - elapsedtime;
          var timespan = nextelapsedtime - elapsedtime;
          var positionspan = [];
          positionspan[0] = position[0] - nextposition[0];
          positionspan[1] = position[1] - nextposition[1];
          positionspan[2] = position[2] - nextposition[2];
          var positionprogress = [];
          positionprogress[0] = positionspan[0] * (elapsedtimespan / timespan);
          positionprogress[1] = positionspan[1] * (elapsedtimespan / timespan);
          positionprogress[2] = positionspan[2] * (elapsedtimespan / timespan);
          movedData.push((0, _extends3.default)({
            position: [position[0] - positionprogress[0], position[1] - positionprogress[1], position[2] - positionprogress[2]]
          }, getOptionFunction(props, i, j), {
            movesbaseidx: i
          }));
        }
      }
    }
  }
  return movedData;
};

var getClickedObjectToBeRemoved = exports.getClickedObjectToBeRemoved = function getClickedObjectToBeRemoved(movedData, clickedObject) {
  if (!clickedObject) {
    return false;
  }
  for (var i = 0, lengthi = movedData.length; i < lengthi; i += 1) {
    var movesbaseidx = movedData[i].movesbaseidx;

    if (clickedObject && clickedObject.object.movesbaseidx === movesbaseidx) {
      return false;
    }
  }
  return true;
};

var analyzelinemapData = exports.analyzelinemapData = function analyzelinemapData(nonmapView, linemapData) {
  if (!nonmapView) return linemapData;
  var xMin = Infinity;
  var yMin = Infinity;
  var xMax = -Infinity;
  var yMax = -Infinity;
  for (var i = 0, lengthi = linemapData.length; i < lengthi; i += 1) {
    var _linemapData$i = linemapData[i],
        sourcePosition = _linemapData$i.sourcePosition,
        targetPosition = _linemapData$i.targetPosition;

    xMin = Math.min(xMin, sourcePosition[0], targetPosition[0]);
    yMin = Math.min(yMin, sourcePosition[1], targetPosition[1]);
    xMax = Math.max(xMax, sourcePosition[0], targetPosition[0]);
    yMax = Math.max(yMax, sourcePosition[1], targetPosition[1]);
  }
  var xMid = scaleInfo.xMid || (xMin + xMax) / 2;
  var yMid = scaleInfo.yMid || (yMin + yMax) / 2;
  var scaleZ = scaleInfo.scaleZ || getLongitiudeDegree(yMid);
  for (var j = 0, lengthj = linemapData.length; j < lengthj; j += 1) {
    var _linemapData$j = linemapData[j],
        _sourcePosition = _linemapData$j.sourcePosition,
        _targetPosition = _linemapData$j.targetPosition;

    _sourcePosition[0] = (_sourcePosition[0] - xMid) / scaleZ;
    _sourcePosition[1] = (_sourcePosition[1] - yMid) / scaleZ;
    _sourcePosition[2] /= DEGREE_SCALE;
    _targetPosition[0] = (_targetPosition[0] - xMid) / scaleZ;
    _targetPosition[1] = (_targetPosition[1] - yMid) / scaleZ;
    _targetPosition[2] /= DEGREE_SCALE;
  }
  if (!scaleInfo.xMid) scaleInfo.xMid = xMid;
  if (!scaleInfo.yMid) scaleInfo.yMid = yMid;
  if (!scaleInfo.scaleZ) scaleInfo.scaleZ = scaleZ;
  return linemapData;
};

var defaultMapStateToProps = exports.defaultMapStateToProps = function defaultMapStateToProps(state) {
  return getContainerProp(state);
};

var connectToHarmowareVis = exports.connectToHarmowareVis = function connectToHarmowareVis(App) {
  var moreActions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var mapStateToProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultMapStateToProps;

  var extendedActions = (0, _assign2.default)({}, Actions, moreActions);

  function mapDispatchToProps(dispatch) {
    return { actions: (0, _redux.bindActionCreators)(extendedActions, dispatch) };
  }

  return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(App);
};

var getCombinedReducer = exports.getCombinedReducer = function getCombinedReducer(combined) {
  return (0, _redux.combineReducers)((0, _extends3.default)({ base: _reducers2.default }, combined));
};