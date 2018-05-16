'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = rootSaga;

var _effects = require('redux-saga/effects');

var _d3Request = require('d3-request');

var _actionTypes = require('../constants/action-types');

var types = _interopRequireWildcard(_actionTypes);

var _actions = require('../actions');

var actions = _interopRequireWildcard(_actions);

var _settings = require('../constants/settings');

var _lib = require('../lib/');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(fetchDataList),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(fetchDataByAnswer),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(fetchBusstopCSV),
    _marked4 = /*#__PURE__*/_regenerator2.default.mark(fetchBusstopRoutesJSON),
    _marked5 = /*#__PURE__*/_regenerator2.default.mark(fetchRoutesJSON),
    _marked6 = /*#__PURE__*/_regenerator2.default.mark(fetchBusstopsOption),
    _marked7 = /*#__PURE__*/_regenerator2.default.mark(setupByCSV),
    _marked8 = /*#__PURE__*/_regenerator2.default.mark(setupByBusstopCSV),
    _marked9 = /*#__PURE__*/_regenerator2.default.mark(setupFetch),
    _marked10 = /*#__PURE__*/_regenerator2.default.mark(initializeFetch),
    _marked11 = /*#__PURE__*/_regenerator2.default.mark(updateRoute),
    _marked12 = /*#__PURE__*/_regenerator2.default.mark(updateRainfall),
    _marked13 = /*#__PURE__*/_regenerator2.default.mark(rootSaga);

function fetchJSON(path) {
  return new _promise2.default(function (resolve /* , reject */) {
    (0, _d3Request.json)(path, function (error, response) {
      if (error) {
        resolve(null);
      } else {
        resolve(response);
      }
    });
  });
}

function fetchCSV(path) {
  return new _promise2.default(function (resolve /* , reject */) {
    (0, _d3Request.csv)(path).get(function (error, response) {
      if (error) {
        resolve(null);
      } else {
        resolve(response);
      }
    });
  });
}

function fetchShiftJisCSV(path) {
  return new _promise2.default(function (resolve /* , reject */) {
    (0, _d3Request.csv)(path).mimeType('text/csv; charset=shift_jis').get(function (error, response) {
      if (error) {
        resolve(null);
      } else {
        resolve(response);
      }
    });
  });
}

function fetchDataList(_ref) {
  var path = _ref.path;
  var response, children, leading, filelist, answer;
  return _regenerator2.default.wrap(function fetchDataList$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return fetchJSON(path);

        case 2:
          response = _context.sent;

          if (response) {
            _context.next = 5;
            break;
          }

          return _context.abrupt('return');

        case 5:
          children = response.children, leading = response.leading;
          filelist = [];

          children.forEach(function (answer) {
            filelist.push(answer.file);
          });
          answer = filelist[0];
          _context.next = 11;
          return (0, _effects.put)(actions.setAnswers(filelist));

        case 11:
          _context.next = 13;
          return (0, _effects.put)(actions.setAnswer(answer));

        case 13:
          if (!(typeof leading === 'number')) {
            _context.next = 16;
            break;
          }

          _context.next = 16;
          return (0, _effects.put)(actions.setLeading(leading));

        case 16:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

function fetchDataByAnswer(_ref2) {
  var answer = _ref2.answer;

  var fileextension, _getContainerProp, DATAPATH, secpermin, leading, trailing, response, timeBegin, timeLength, resbounds, trips, d, strYmdBegin, fileYmd, bounds, loopTime, starttimestamp, busmovesbase, _response, bustripscsv;

  return _regenerator2.default.wrap(function fetchDataByAnswer$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          fileextension = answer.split('.');
          _context2.t0 = _lib.getContainerProp;
          _context2.next = 4;
          return (0, _effects.select)();

        case 4:
          _context2.t1 = _context2.sent;
          _getContainerProp = (0, _context2.t0)(_context2.t1);
          DATAPATH = _getContainerProp.DATAPATH;
          secpermin = _getContainerProp.secpermin;
          leading = _getContainerProp.leading;
          trailing = _getContainerProp.trailing;

          if (!(fileextension[1] === 'json')) {
            _context2.next = 38;
            break;
          }

          _context2.next = 13;
          return fetchJSON(DATAPATH + answer);

        case 13:
          response = _context2.sent;

          if (response) {
            _context2.next = 16;
            break;
          }

          return _context2.abrupt('return');

        case 16:
          timeBegin = response.timeBegin, timeLength = response.timeLength, resbounds = response.bounds, trips = response.trips;
          d = new Date(timeBegin * 1000);
          strYmdBegin = (0, _lib.p02d)(d.getFullYear()) + (0, _lib.p02d)(d.getMonth() + 1) + (0, _lib.p02d)(d.getDate());
          fileYmd = fileextension[0].split('-')[1].substr(0, 8);

          if (!(strYmdBegin !== fileYmd)) {
            _context2.next = 23;
            break;
          }

          alert('date error\ntimeBegin=' + strYmdBegin + '\nfileneme=' + fileYmd);
          return _context2.abrupt('return');

        case 23:
          bounds = {
            westlongitiude: resbounds[0],
            southlatitude: resbounds[1],
            eastlongitiude: resbounds[2],
            northlatitude: resbounds[3] };
          loopTime = (timeLength + trailing) / 60 * 1000 * secpermin;
          starttimestamp = Date.now() + leading / 60 * 1000 * secpermin;
          busmovesbase = [];

          trips.forEach(function (trip) {
            var segments = trip.segments,
                color = trip.color;

            var operation = [];
            segments.forEach(function (tripsegment, idx) {
              var tripcolor = color[idx] || _settings.COLOR1;
              operation.push({
                elapsedtime: tripsegment[2],
                longitude: tripsegment[0],
                latitude: tripsegment[1],
                color: [tripcolor[0], tripcolor[1], tripcolor[2]] });
              operation.push({
                elapsedtime: tripsegment[2] + 10,
                longitude: tripsegment[0],
                latitude: tripsegment[1],
                color: [tripcolor[0], tripcolor[1], tripcolor[2]] });
            });
            busmovesbase.push({
              departuretime: segments[0][2],
              arrivaltime: segments[segments.length - 1][2],
              operation: operation
            });
          });
          _context2.next = 30;
          return (0, _effects.put)(actions.setViewport({
            longitiude: (bounds.westlongitiude + bounds.eastlongitiude) / 2,
            latitude: (bounds.southlatitude + bounds.southlatitude + bounds.northlatitude) / 3,
            zoom: _settings.DEFAULTZOOM,
            pitch: _settings.DEFAULTPITCH,
            bearing: 0
          }));

        case 30:
          _context2.next = 32;
          return (0, _effects.put)(actions.setTimeSettings({
            timeBegin: timeBegin,
            timeLength: timeLength + trailing,
            loopTime: loopTime,
            starttimestamp: starttimestamp
          }));

        case 32:
          _context2.next = 34;
          return (0, _effects.put)(actions.setBusTripsCsv([]));

        case 34:
          _context2.next = 36;
          return (0, _effects.put)(actions.setBusMovesData({ bounds: bounds, busmovesbase: busmovesbase, busmovesbasedic: [] }));

        case 36:
          _context2.next = 47;
          break;

        case 38:
          if (!(fileextension[1] === 'csv')) {
            _context2.next = 47;
            break;
          }

          _context2.next = 41;
          return fetchShiftJisCSV(DATAPATH + answer);

        case 41:
          _response = _context2.sent;

          if (_response) {
            _context2.next = 44;
            break;
          }

          return _context2.abrupt('return');

        case 44:
          bustripscsv = _response.map(function (current) {
            var returnvalue = {
              diagramid: current.ダイヤＩＤ,
              routecode: current.路線コード,
              systemcode: current.系統コード,
              direction: current.上下コード || current.上下,
              systemname: current.系統表示名,
              timetable: current.所定発時刻,
              actualdep: current.実績発時刻,
              busstopcode: current.停留所コード,
              busstoporder: current.並び順 };
            return returnvalue;
          });
          _context2.next = 47;
          return (0, _effects.put)(actions.setBusTripsCsv(bustripscsv));

        case 47:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this);
}

function fetchBusstopCSV() {
  var _getContainerProp2, BUSSTOPSPATH, busstopscsv, response, conversionData;

  return _regenerator2.default.wrap(function fetchBusstopCSV$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.t0 = _lib.getContainerProp;
          _context3.next = 3;
          return (0, _effects.select)();

        case 3:
          _context3.t1 = _context3.sent;
          _getContainerProp2 = (0, _context3.t0)(_context3.t1);
          BUSSTOPSPATH = _getContainerProp2.BUSSTOPSPATH;
          busstopscsv = _getContainerProp2.busstopscsv;

          if (!(busstopscsv.length === 0)) {
            _context3.next = 15;
            break;
          }

          _context3.next = 10;
          return fetchCSV(BUSSTOPSPATH + 'busstops.csv');

        case 10:
          response = _context3.sent;

          if (!response) {
            _context3.next = 15;
            break;
          }

          conversionData = response.map(function (current) {
            var returnvalue = {
              code: current.停留所コード,
              name: current.停留所名,
              longitude: current.経度,
              latitude: current.緯度 };
            return returnvalue;
          });
          _context3.next = 15;
          return (0, _effects.put)(actions.setBusstopsCsv(conversionData));

        case 15:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3, this);
}

function fetchBusstopRoutesJSON() {
  var _getContainerProp3, ROUTESPATH, busroutes, response;

  return _regenerator2.default.wrap(function fetchBusstopRoutesJSON$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.t0 = _lib.getContainerProp;
          _context4.next = 3;
          return (0, _effects.select)();

        case 3:
          _context4.t1 = _context4.sent;
          _getContainerProp3 = (0, _context4.t0)(_context4.t1);
          ROUTESPATH = _getContainerProp3.ROUTESPATH;
          busroutes = _getContainerProp3.busroutes;

          if (!((0, _keys2.default)(busroutes).length === 0)) {
            _context4.next = 14;
            break;
          }

          _context4.next = 10;
          return fetchJSON(ROUTESPATH + 'busroutes.json');

        case 10:
          response = _context4.sent;

          if (!response) {
            _context4.next = 14;
            break;
          }

          _context4.next = 14;
          return (0, _effects.put)(actions.setBusRoutes(response));

        case 14:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked4, this);
}

function fetchRoutesJSON() {
  var _getContainerProp4, ROUTESPATH, routesdata, response, dep_station_code, des_station_code, route, routesdict;

  return _regenerator2.default.wrap(function fetchRoutesJSON$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.t0 = _lib.getContainerProp;
          _context5.next = 3;
          return (0, _effects.select)();

        case 3:
          _context5.t1 = _context5.sent;
          _getContainerProp4 = (0, _context5.t0)(_context5.t1);
          ROUTESPATH = _getContainerProp4.ROUTESPATH;
          routesdata = _getContainerProp4.routesdata;

          if (!((0, _keys2.default)(routesdata).length === 0)) {
            _context5.next = 17;
            break;
          }

          _context5.next = 10;
          return fetchJSON(ROUTESPATH + 'routes.json');

        case 10:
          response = _context5.sent;

          if (!response) {
            _context5.next = 17;
            break;
          }

          dep_station_code = response.dep_station_code, des_station_code = response.des_station_code, route = response.route;
          routesdict = {};

          route.forEach(function (current, idx) {
            routesdict[(0, _lib.p04d)(String(dep_station_code[idx])) + (0, _lib.p04d)(String(des_station_code[idx]))] = current;
          });
          _context5.next = 17;
          return (0, _effects.put)(actions.setRoutesData(routesdict));

        case 17:
        case 'end':
          return _context5.stop();
      }
    }
  }, _marked5, this);
}

function fetchBusstopsOption() {
  var _getContainerProp5, BUSSTOPSPATH, answer, bsoptFname, response;

  return _regenerator2.default.wrap(function fetchBusstopsOption$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.t0 = _lib.getContainerProp;
          _context6.next = 3;
          return (0, _effects.select)();

        case 3:
          _context6.t1 = _context6.sent;
          _getContainerProp5 = (0, _context6.t0)(_context6.t1);
          BUSSTOPSPATH = _getContainerProp5.BUSSTOPSPATH;
          answer = _getContainerProp5.answer;
          bsoptFname = answer.split('.')[0] + '-option';
          _context6.next = 10;
          return fetchJSON('' + BUSSTOPSPATH + bsoptFname + '.json');

        case 10:
          response = _context6.sent;

          if (!response) {
            _context6.next = 18;
            break;
          }

          _context6.next = 14;
          return (0, _effects.put)(actions.setBusOption(response));

        case 14:
          _context6.next = 16;
          return (0, _effects.put)(actions.setBsoptFname(bsoptFname));

        case 16:
          _context6.next = 22;
          break;

        case 18:
          _context6.next = 20;
          return (0, _effects.put)(actions.setBusOption({}));

        case 20:
          _context6.next = 22;
          return (0, _effects.put)(actions.setBsoptFname(''));

        case 22:
        case 'end':
          return _context6.stop();
      }
    }
  }, _marked6, this);
}

function setupByCSV() {
  var _getContainerProp6, bustripscsv, secpermin, busstopscsv, routesdata, busroutes, answer, leading, trailing, busoption, fileextension, fileymd, ymd, savediagramid, savebusinfo, savebusstatus, tripbase, busmovesbase, busmovesbasedic, busmovesoption, busoptionlist, timespan, bssidx, bounds;

  return _regenerator2.default.wrap(function setupByCSV$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.t0 = _lib.getContainerProp;
          _context7.next = 3;
          return (0, _effects.select)();

        case 3:
          _context7.t1 = _context7.sent;
          _getContainerProp6 = (0, _context7.t0)(_context7.t1);
          bustripscsv = _getContainerProp6.bustripscsv;
          secpermin = _getContainerProp6.secpermin;
          busstopscsv = _getContainerProp6.busstopscsv;
          routesdata = _getContainerProp6.routesdata;
          busroutes = _getContainerProp6.busroutes;
          answer = _getContainerProp6.answer;
          leading = _getContainerProp6.leading;
          trailing = _getContainerProp6.trailing;
          busoption = _getContainerProp6.busoption;
          fileextension = answer.split('.');

          if (!(fileextension[1] !== 'csv')) {
            _context7.next = 17;
            break;
          }

          return _context7.abrupt('return');

        case 17:
          if (!(!bustripscsv || bustripscsv.length === 0)) {
            _context7.next = 19;
            break;
          }

          return _context7.abrupt('return');

        case 19:
          fileymd = fileextension[0].split('-')[1];
          ymd = [parseInt(fileymd.substr(0, 4), 10), parseInt(fileymd.substr(4, 2), 10) - 1, parseInt(fileymd.substr(6, 2), 10)];
          savediagramid = '';
          savebusinfo = {};
          savebusstatus = [];
          tripbase = [];
          busmovesbase = [];
          busmovesbasedic = [];
          busmovesoption = busoption.busmovesoption || {};
          busoptionlist = null;
          timespan = { departure: 0, arrival: 0 };


          bustripscsv.forEach(function (csvdata) {
            var diagramid = csvdata.diagramid,
                routecode = csvdata.routecode,
                systemcode = csvdata.systemcode,
                direction = csvdata.direction,
                systemname = csvdata.systemname,
                timetable = csvdata.timetable,
                actualdep = csvdata.actualdep,
                busstopcode = csvdata.busstopcode,
                busstoporder = csvdata.busstoporder;

            if (savediagramid !== diagramid) {
              if (savebusstatus.length > 0) {
                tripbase.push({ diagramid: savediagramid, businfo: savebusinfo, busstatus: savebusstatus });
              }
              savediagramid = diagramid;
              busoptionlist = busmovesoption[savediagramid] || null;
              savebusinfo = { routecode: routecode, systemcode: systemcode, direction: direction, systemname: systemname, timetable: timetable };
              savebusstatus = [];
            }
            if (timetable.match(/\d{1,2}:\d\d/) && actualdep.match(/\d{1,2}:\d\d:\d\d/)) {
              var tiemConversion = function tiemConversion(ndate, sTime) {
                var hms = sTime.split(':').map(function (current) {
                  return parseInt(current, 10);
                });
                return new (Function.prototype.bind.apply(Date, [null].concat((0, _toConsumableArray3.default)(ndate), [hms[0], hms[1], hms[2] || 0])))().getTime();
              };
              var dtime = tiemConversion(ymd, actualdep);
              if (timespan.departure === 0 && timespan.arrival === 0) {
                timespan.departure = dtime;
                timespan.arrival = dtime;
              } else {
                timespan.departure = Math.min(timespan.departure, dtime);
                timespan.arrival = Math.max(timespan.arrival, dtime);
              }
              var dtime2 = tiemConversion(ymd, timetable);
              var delaysec = (dtime - dtime2) / 1000;
              var busprop = busoptionlist ? busoptionlist[busstopcode + busstoporder] || busoptionlist[busstopcode] || null : null;
              var pushdata = {
                busstopcode: busstopcode,
                elapsedtime: dtime / 1000,
                order: parseInt(busstoporder, 10) - 1,
                delaysec: delaysec,
                busprop: busprop
              };
              savebusstatus.push(pushdata);
            }
          });
          if (savebusstatus.length > 0) {
            tripbase.push({ diagramid: savediagramid, businfo: savebusinfo, busstatus: savebusstatus });
          }
          timespan.departure /= 1000;
          timespan.arrival /= 1000;

          if (!(tripbase.length === 0)) {
            _context7.next = 36;
            break;
          }

          return _context7.abrupt('return');

        case 36:
          bssidx = {};

          busstopscsv.forEach(function (current, idx) {
            bssidx[current.code] = idx;
          });

          bounds = { westlongitiude: 0, southlatitude: 0, eastlongitiude: 0, northlatitude: 0 };

          tripbase.forEach(function (trip, idx) {
            var diagramid = trip.diagramid,
                businfo = trip.businfo,
                busstatus = trip.busstatus;
            var systemcode = businfo.systemcode,
                direction = businfo.direction,
                systemname = businfo.systemname,
                timetable = businfo.timetable;

            var operation = [];
            var savebusoption = null;
            var busclass = { systemcode: systemcode, direction: direction, systemname: systemname, diagramid: diagramid, timetable: timetable };
            for (var j = 0, lengthj = busstatus.length; j < lengthj; j += 1) {
              var _busstatus$j = busstatus[j],
                  busstopcode = _busstatus$j.busstopcode,
                  elapsedtime = _busstatus$j.elapsedtime,
                  order = _busstatus$j.order,
                  delaysec = _busstatus$j.delaysec,
                  busprop = _busstatus$j.busprop;

              if (bssidx[busstopcode]) {
                var busstoplocation = busstopscsv[bssidx[busstopcode]];
                operation.push({
                  elapsedtime: elapsedtime - timespan.departure - 10, // 各経過時間 - min経過時間
                  longitude: busstoplocation.longitude,
                  latitude: busstoplocation.latitude,
                  color: _settings.COLOR1,
                  delaysec: delaysec,
                  busprop: savebusoption });

                savebusoption = busprop;
                operation.push({
                  elapsedtime: elapsedtime - timespan.departure, // 各経過時間 - min経過時間(+10はバス停停車の仮時間)
                  longitude: busstoplocation.longitude,
                  latitude: busstoplocation.latitude,
                  color: _settings.COLOR1,
                  delaysec: delaysec,
                  busprop: savebusoption });

                if (j < busstatus.length - 1 && busstopcode !== busstatus[j + 1].busstopcode) {
                  var busrouteskey = systemcode + '-' + direction;
                  var _busstatus = busstatus[j + 1],
                      nextbusstopcode = _busstatus.busstopcode,
                      nextelapsedtime = _busstatus.elapsedtime,
                      nextorder = _busstatus.order,
                      nextdelaysec = _busstatus.delaysec;

                  var bsorderlist = [];
                  if (busroutes[busrouteskey]) {
                    var wkbusroute = busroutes[busrouteskey];
                    for (var k = order; k < nextorder; k += 1) {
                      if (wkbusroute[k] !== wkbusroute[k + 1]) {
                        bsorderlist.push({ busstopcode: wkbusroute[k],
                          nextbusstopcode: wkbusroute[k + 1] });
                      }
                    }
                  } else {
                    bsorderlist.push({ busstopcode: busstopcode, nextbusstopcode: nextbusstopcode });
                  }

                  var distance = 0;
                  var route = [];
                  for (var m = 0; m < bsorderlist.length; m += 1) {
                    var bsslist = bsorderlist[m];
                    if (routesdata[bsslist.busstopcode + bsslist.nextbusstopcode]) {
                      var routedata = JSON.parse(routesdata[bsslist.busstopcode + bsslist.nextbusstopcode]);
                      if (routedata.result === 'success') {
                        for (var n = 0; n < routedata.route.length; n += 1) {
                          var wkroute = routedata.route[n];
                          if (wkroute[2] < routedata.distance) {
                            route.push([wkroute[0], wkroute[1], distance + wkroute[2]]);
                          }
                        }
                        distance += routedata.distance;
                      } else {
                        route = [];
                        break;
                      }
                    } else {
                      route = [];
                      break;
                    }
                  }

                  var st = elapsedtime - timespan.departure;
                  var et = nextelapsedtime - timespan.departure - 10;
                  var dt = et - st;
                  for (var p = 0; p < route.length; p += 1) {
                    var rt = route[p];
                    if (rt[2] > 0 && rt[2] < distance) {
                      operation.push({
                        elapsedtime: st + dt * (rt[2] / distance), // 経過時間
                        longitude: String(rt[1]),
                        latitude: String(rt[0]),
                        color: _settings.COLOR1,
                        delaysec: Math.floor(delaysec + (nextdelaysec - delaysec) * (rt[2] / distance)),
                        busprop: savebusoption });
                    }
                  }
                }
                if (bounds.westlongitiude === 0 && bounds.southlatitude === 0 && bounds.eastlongitiude === 0 && bounds.northlatitude === 0) {
                  bounds.westlongitiude = busstoplocation.longitude;
                  bounds.southlatitude = busstoplocation.latitude;
                  bounds.eastlongitiude = busstoplocation.longitude;
                  bounds.northlatitude = busstoplocation.latitude;
                } else {
                  bounds.westlongitiude = Math.min(bounds.westlongitiude, busstoplocation.longitude);
                  bounds.southlatitude = Math.min(bounds.southlatitude, busstoplocation.latitude);
                  bounds.eastlongitiude = Math.max(bounds.eastlongitiude, busstoplocation.longitude);
                  bounds.northlatitude = Math.max(bounds.northlatitude, busstoplocation.latitude);
                }
              }
            }
            if (operation.length > 0) {
              busmovesbase.push({
                departuretime: operation[0].elapsedtime,
                arrivaltime: operation[operation.length - 1].elapsedtime,
                busclass: busclass,
                operation: operation
              });
              busmovesbasedic[diagramid] = idx;
            }
          });
          _context7.next = 42;
          return (0, _effects.put)(actions.setBusMovesData({ bounds: bounds, busmovesbase: busmovesbase, busmovesbasedic: busmovesbasedic }));

        case 42:
          _context7.next = 44;
          return (0, _effects.put)(actions.setTimeSettings({
            timeBegin: timespan.departure,
            timeLength: timespan.arrival - timespan.departure + trailing,
            loopTime: (timespan.arrival - timespan.departure + trailing) / 60 * 1000 * secpermin,
            starttimestamp: Date.now() + leading / 60 * 1000 * secpermin
          }));

        case 44:
          _context7.next = 46;
          return (0, _effects.put)(actions.setViewport({
            longitude: (bounds.westlongitiude + bounds.eastlongitiude) / 2,
            latitude: (bounds.southlatitude + bounds.southlatitude + bounds.northlatitude) / 3,
            zoom: _settings.DEFAULTZOOM,
            pitch: _settings.DEFAULTPITCH,
            bearing: 0
          }));

        case 46:
        case 'end':
          return _context7.stop();
      }
    }
  }, _marked7, this);
}

function setupByBusstopCSV() {
  var _getContainerProp7, busstopscsv, busoption, busstopsoption, optionlist, optiontimerange, optionlistbase, busstopsbase;

  return _regenerator2.default.wrap(function setupByBusstopCSV$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.t0 = _lib.getContainerProp;
          _context8.next = 3;
          return (0, _effects.select)();

        case 3:
          _context8.t1 = _context8.sent;
          _getContainerProp7 = (0, _context8.t0)(_context8.t1);
          busstopscsv = _getContainerProp7.busstopscsv;
          busoption = _getContainerProp7.busoption;

          if (busoption.busstopsoption) {
            _context8.next = 11;
            break;
          }

          _context8.next = 10;
          return (0, _effects.put)(actions.setBusstopsBase(busstopscsv));

        case 10:
          return _context8.abrupt('return');

        case 11:
          busstopsoption = busoption.busstopsoption;
          optionlist = [];

          (0, _keys2.default)(busstopsoption).forEach(function (time) {
            var optionvalue = busstopsoption[time];
            optionvalue.forEach(function (option) {
              var bscode = option.bscode,
                  elevation = option.elevation,
                  color = option.color,
                  memo = option.memo;

              optionlist.push({ time: parseInt(time, 10),
                bscode: bscode,
                elevation: elevation || null,
                color: color || null,
                memo: memo || null
              });
            });
          });
          optionlist.sort(function (a, b) {
            return a.time - b.time;
          });
          optiontimerange = {};
          optionlistbase = {};

          optionlist.forEach(function (option) {
            var bscode = option.bscode,
                time = option.time,
                elevation = option.elevation,
                color = option.color,
                memo = option.memo;

            if (optiontimerange[bscode]) {
              var timerange = optiontimerange[bscode];
              timerange.stime = Math.min(timerange.stime, time);
              timerange.etime = Math.max(timerange.etime, time);
            } else {
              var _timerange = { stime: time, etime: time };
              optiontimerange[bscode] = _timerange;
            }
            var pushdata = { time: time, elevation: elevation, color: color, memo: memo };
            if (optionlistbase[bscode]) {
              optionlistbase[bscode].push(pushdata);
            } else {
              optionlistbase[bscode] = [pushdata];
            }
          });
          busstopsbase = [];

          busstopscsv.forEach(function (csvdata) {
            busstopsbase.push((0, _extends3.default)({}, csvdata, {
              optionrange: optiontimerange[csvdata.code] || null,
              optiondata: optionlistbase[csvdata.code] || null
            }));
          });
          _context8.next = 22;
          return (0, _effects.put)(actions.setBusstopsBase(busstopsbase));

        case 22:
        case 'end':
          return _context8.stop();
      }
    }
  }, _marked8, this);
}

function setupFetch(_ref3) {
  var answer = _ref3.answer;
  return _regenerator2.default.wrap(function setupFetch$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return (0, _effects.call)(fetchDataByAnswer, { answer: answer });

        case 2:
          _context9.next = 4;
          return (0, _effects.call)(fetchBusstopsOption);

        case 4:
          _context9.next = 6;
          return (0, _effects.call)(fetchBusstopCSV);

        case 6:
          _context9.next = 8;
          return (0, _effects.call)(fetchBusstopRoutesJSON);

        case 8:
          _context9.next = 10;
          return (0, _effects.call)(fetchRoutesJSON);

        case 10:
          _context9.next = 12;
          return (0, _effects.call)(setupByCSV);

        case 12:
          _context9.next = 14;
          return (0, _effects.call)(setupByBusstopCSV);

        case 14:
        case 'end':
          return _context9.stop();
      }
    }
  }, _marked9, this);
}

function initializeFetch(_ref4) {
  var path = _ref4.path;

  var _getContainerProp8, answer;

  return _regenerator2.default.wrap(function initializeFetch$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return (0, _effects.call)(fetchDataList, { path: path });

        case 2:
          _context10.t0 = _lib.getContainerProp;
          _context10.next = 5;
          return (0, _effects.select)();

        case 5:
          _context10.t1 = _context10.sent;
          _getContainerProp8 = (0, _context10.t0)(_context10.t1);
          answer = _getContainerProp8.answer;
          _context10.next = 10;
          return (0, _effects.call)(setupFetch, { answer: answer });

        case 10:
        case 'end':
          return _context10.stop();
      }
    }
  }, _marked10, this);
}

function updateRoute(_ref5) {
  var el = _ref5.el,
      sw = _ref5.sw;

  var object, layer, code, name, memo, busmovesbaseidx, id, _getContainerProp9, delayheight, busmovesbase, _getContainerProp10, delayrange, retel, routePaths, _busmovesbase$busmove, operation, busclass, systemcode, direction, systemname, timetable, delaysecmax, j, _operation$j, longitude, latitude, delaysec, _operation, nextlongitude, nextlatitude, nextdelaysec, _j, _operation$_j, color, _operation2;

  return _regenerator2.default.wrap(function updateRoute$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          if (el) {
            _context11.next = 2;
            break;
          }

          return _context11.abrupt('return');

        case 2:
          object = el.object, layer = el.layer;
          code = object.code, name = object.name, memo = object.memo, busmovesbaseidx = object.busmovesbaseidx;
          id = layer.id;
          _context11.t0 = _lib.getContainerProp;
          _context11.next = 8;
          return (0, _effects.select)();

        case 8:
          _context11.t1 = _context11.sent;
          _getContainerProp9 = (0, _context11.t0)(_context11.t1);
          delayheight = _getContainerProp9.delayheight;
          busmovesbase = _getContainerProp9.busmovesbase;
          _context11.t2 = _lib.getContainerProp;
          _context11.next = 15;
          return (0, _effects.select)();

        case 15:
          _context11.t3 = _context11.sent;
          _getContainerProp10 = (0, _context11.t2)(_context11.t3);
          delayrange = _getContainerProp10.delayrange;
          retel = null;
          routePaths = [];
          _busmovesbase$busmove = busmovesbase[busmovesbaseidx], operation = _busmovesbase$busmove.operation, busclass = _busmovesbase$busmove.busclass;

          if (!busclass) {
            _context11.next = 33;
            break;
          }

          systemcode = busclass.systemcode, direction = busclass.direction, systemname = busclass.systemname, timetable = busclass.timetable;

          if (!sw) {
            _context11.next = 29;
            break;
          }

          delaysecmax = operation.reduce(function (prev, current) {
            return Math.max(prev, current.delaysec);
          }, 0);

          delayrange = Math.floor(delaysecmax / 60) + 1;
          if (delayrange > 120) {
            delayrange = 120;
          }
          _context11.next = 29;
          return (0, _effects.put)(actions.setDelayRange(delayrange));

        case 29:
          for (j = 0; j < operation.length - 1; j += 1) {
            _operation$j = operation[j], longitude = _operation$j.longitude, latitude = _operation$j.latitude, delaysec = _operation$j.delaysec;
            _operation = operation[j + 1], nextlongitude = _operation.longitude, nextlatitude = _operation.latitude, nextdelaysec = _operation.delaysec;

            routePaths.push({
              sourcePosition: [longitude, latitude, delaysec / 2 * delayheight + 2],
              targetPosition: [nextlongitude, nextlatitude, nextdelaysec / 2 * delayheight + 2],
              color: (0, _lib.delaycolor)(delaysec, delayrange)
            });
          }
          retel = {
            object: {
              code: code,
              name: systemcode + '-' + direction + ' ' + timetable + '\u767A ' + systemname,
              memo: memo,
              busmovesbaseidx: busmovesbaseidx },
            layer: { id: id }
          };
          _context11.next = 37;
          break;

        case 33:
          _context11.next = 35;
          return (0, _effects.put)(actions.setDelayRange(1));

        case 35:
          for (_j = 0; _j < operation.length - 1; _j += 1) {
            _operation$_j = operation[_j], longitude = _operation$_j.longitude, latitude = _operation$_j.latitude, color = _operation$_j.color;
            _operation2 = operation[_j + 1], nextlongitude = _operation2.longitude, nextlatitude = _operation2.latitude;

            routePaths.push({
              sourcePosition: [longitude, latitude, 0],
              targetPosition: [nextlongitude, nextlatitude, 0],
              color: color || _settings.COLOR1
            });
          }
          retel = {
            object: { code: code, name: name, memo: memo, busmovesbaseidx: busmovesbaseidx },
            layer: { id: id }
          };

        case 37:
          _context11.next = 39;
          return (0, _effects.put)(actions.setClicked(retel));

        case 39:
          _context11.next = 41;
          return (0, _effects.put)(actions.setRoutePaths(routePaths));

        case 41:
        case 'end':
          return _context11.stop();
      }
    }
  }, _marked11, this);
}

function updateRainfall(_ref6) {
  var settime = _ref6.settime,
      timeBegin = _ref6.timeBegin,
      cellSize = _ref6.cellSize,
      answer = _ref6.answer,
      xbandFname = _ref6.xbandFname;

  var _getContainerProp11, GRIDDATAPATH, d, year, month, day, hour, min, nextXbandFname, response;

  return _regenerator2.default.wrap(function updateRainfall$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          if (!(cellSize === 0)) {
            _context12.next = 4;
            break;
          }

          _context12.next = 3;
          return (0, _effects.put)(actions.setXbandFname(''));

        case 3:
          return _context12.abrupt('return');

        case 4:
          _context12.t0 = _lib.getContainerProp;
          _context12.next = 7;
          return (0, _effects.select)();

        case 7:
          _context12.t1 = _context12.sent;
          _getContainerProp11 = (0, _context12.t0)(_context12.t1);
          GRIDDATAPATH = _getContainerProp11.GRIDDATAPATH;
          d = new Date((timeBegin + settime) * 1000);
          year = d.getFullYear();
          month = d.getMonth() + 1;
          day = d.getDate();
          hour = d.getHours();
          min = d.getMinutes();
          nextXbandFname = answer.split('-')[0] + '-' + (0, _lib.p02d)(year) + (0, _lib.p02d)(month) + (0, _lib.p02d)(day) + '-' + (0, _lib.p02d)(hour) + (0, _lib.p02d)(min);

          if (!(nextXbandFname === xbandFname)) {
            _context12.next = 19;
            break;
          }

          return _context12.abrupt('return');

        case 19:
          _context12.next = 21;
          return (0, _effects.put)(actions.setXbandFname(nextXbandFname));

        case 21:
          _context12.next = 23;
          return fetchJSON('' + GRIDDATAPATH + nextXbandFname + '.json');

        case 23:
          response = _context12.sent;

          if (!response) {
            _context12.next = 29;
            break;
          }

          _context12.next = 27;
          return (0, _effects.put)(actions.setRainfall(response));

        case 27:
          _context12.next = 31;
          break;

        case 29:
          _context12.next = 31;
          return (0, _effects.put)(actions.setRainfall([]));

        case 31:
        case 'end':
          return _context12.stop();
      }
    }
  }, _marked12, this);
}

function rootSaga() {
  return _regenerator2.default.wrap(function rootSaga$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return (0, _effects.takeEvery)(types.FETCHDATALIST, fetchDataList);

        case 2:
          _context13.next = 4;
          return (0, _effects.takeEvery)(types.FETCHDATABYANSWER, fetchDataByAnswer);

        case 4:
          _context13.next = 6;
          return (0, _effects.takeEvery)(types.FETCHBUSSTOPCSV, fetchBusstopCSV);

        case 6:
          _context13.next = 8;
          return (0, _effects.takeEvery)(types.FETCHBUSSTOPROUTESJSON, fetchBusstopRoutesJSON);

        case 8:
          _context13.next = 10;
          return (0, _effects.takeEvery)(types.FETCHROUTESJSON, fetchRoutesJSON);

        case 10:
          _context13.next = 12;
          return (0, _effects.takeEvery)(types.FETCHBUSSTOPSOPTION, fetchBusstopsOption);

        case 12:
          _context13.next = 14;
          return (0, _effects.takeEvery)(types.INITIALIZEFETCH, initializeFetch);

        case 14:
          _context13.next = 16;
          return (0, _effects.takeEvery)(types.SETUPFETCH, setupFetch);

        case 16:
          _context13.next = 18;
          return (0, _effects.takeEvery)(types.UPDATEROUTE, updateRoute);

        case 18:
          _context13.next = 20;
          return (0, _effects.takeEvery)(types.UPDATERAINFALL, updateRainfall);

        case 20:
        case 'end':
          return _context13.stop();
      }
    }
  }, _marked13, this);
}