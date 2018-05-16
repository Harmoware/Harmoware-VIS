'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectToHarmowareVis = exports.defaultMapStateToProps = exports.getClickedObjectToBeRemoved = exports.getMoveObjects = exports.getDepots = exports.analyzeMovesBase = exports.calcLoopTime = exports.getContainerProp = undefined;

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getContainerProp = exports.getContainerProp = function getContainerProp(state) {
  return (0, _extends3.default)({}, state.base);
};

var calcLoopTime = exports.calcLoopTime = function calcLoopTime(timeLength, secpermin) {
  return timeLength / 60 * 1000 * secpermin;
};

var analyzeMovesBase = exports.analyzeMovesBase = function analyzeMovesBase(inputData) {
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
  if (!baseTimeBegin || !baseTimeLength || !baseBounds) {
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
        var _operation$j = operation[j],
            longitude = _operation$j.longitude,
            latitude = _operation$j.latitude;

        if (!baseBounds) {
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
        var operation = basemovesbase[k].operation;

        for (var l = 0, lengthl = operation.length; l < lengthl; l += 1) {
          operation[l].elapsedtime -= timeBegin;
        }
      }
    }
  }
  var viewport = {
    longitude: (bounds.westlongitiude + bounds.eastlongitiude) / 2,
    latitude: (bounds.southlatitude + bounds.southlatitude + bounds.northlatitude) / 3
  };
  return { timeBegin: timeBegin, timeLength: timeLength, bounds: bounds, movesbase: movesbase, viewport: viewport };
};

var getDepots = exports.getDepots = function getDepots(props) {
  var depotsBase = props.depotsBase,
      bounds = props.bounds,
      getDepotsOptionFunc = props.getDepotsOptionFunc;

  var depotsData = [];
  var getOptionFunction = getDepotsOptionFunc || function () {};

  if (depotsBase.length > 0 && typeof bounds !== 'undefined' && (0, _keys2.default)(bounds).length > 0) {
    for (var i = 0, lengthi = depotsBase.length; i < lengthi; i += 1) {
      var _depotsBase$i = depotsBase[i],
          longitude = _depotsBase$i.longitude,
          latitude = _depotsBase$i.latitude;

      if (bounds.westlongitiude <= longitude && longitude <= bounds.eastlongitiude && bounds.southlatitude <= latitude && latitude <= bounds.northlatitude) {
        var itemmap = (0, _extends3.default)({
          position: [parseFloat(longitude), parseFloat(latitude), 1]
        }, getOptionFunction(props, i));
        depotsData.push(itemmap);
      }
    }
  }
  return depotsData;
};

var getMoveObjects = exports.getMoveObjects = function getMoveObjects(props) {
  var movesbase = props.movesbase,
      settime = props.settime,
      timeBegin = props.timeBegin,
      timeLength = props.timeLength,
      getMovesOptionFunc = props.getMovesOptionFunc;

  var movedData = [];
  var getOptionFunction = getMovesOptionFunc || function () {};

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
            longitude = _operation$j2.longitude,
            latitude = _operation$j2.latitude;
        var _operation = operation[j + 1],
            nextelapsedtime = _operation.elapsedtime,
            nextlongitude = _operation.longitude,
            nextlatitude = _operation.latitude;

        if (elapsedtime <= settime && settime < nextelapsedtime) {
          var elapsedtimespan = settime - elapsedtime;
          var timespan = nextelapsedtime - elapsedtime;
          var longitudespan = longitude - nextlongitude;
          var latitudespan = latitude - nextlatitude;
          var longitudeprogress = longitudespan * (elapsedtimespan / timespan);
          var latitudeprogress = latitudespan * (elapsedtimespan / timespan);
          movedData.push((0, _extends3.default)({
            position: [longitude - longitudeprogress, latitude - latitudeprogress, 3]
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