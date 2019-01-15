var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { call, put, takeEvery, select } from 'redux-saga/effects';
import Axios from 'axios';
import * as csvtojson from 'csvtojson';
import * as iconv from 'iconv-lite';
import { settings, Actions as baseActions, getContainerProp } from 'harmoware-vis';
import * as types from '../constants/action-types';
import { p02d, p04d, delaycolor } from '../library';
import * as moreActions from '../actions';
var Actions = Object.assign({}, baseActions, moreActions);
var COLOR1 = settings.COLOR1;
var DATAPATH = './data/';
var GRIDDATAPATH = './GridCellLayerData/';
var BUSSTOPSPATH = './BusStopsData/';
var ROUTESPATH = './routes/';
;
;
;
function fetchJSON(path, option) {
    if (option === void 0) { option = {}; }
    return new Promise(function (resolve /* , reject */) {
        Axios.get(path, option).then(function (data) {
            resolve(data);
        }).catch(function (error) {
            resolve(error);
        });
    });
}
function fetchCSV(path, useShiftJis) {
    if (useShiftJis === void 0) { useShiftJis = false; }
    return new Promise(function (resolve /* , reject */) {
        var option = {};
        if (useShiftJis) {
            option.responseType = 'arraybuffer';
        }
        Axios.get(path, option).then(function (res) {
            var data = res.data;
            if (useShiftJis) {
                data = iconv.decode(new Buffer(data), 'shift_jis').toString();
            }
            csvtojson().fromString(data).on('end_parsed', function (result) {
                resolve(Object.assign({}, res, {
                    data: result
                }));
            });
        }).catch(function (error) {
            resolve(error);
        });
    });
}
function fetchDataList(_a) {
    var data, children, leading, filelist, answer;
    var path = _a.path;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, put(Actions.setLoading(true))];
            case 1:
                _b.sent();
                return [4 /*yield*/, fetchJSON(path)];
            case 2:
                data = (_b.sent()).data;
                if (!!data) return [3 /*break*/, 4];
                return [4 /*yield*/, put(Actions.setLoading(false))];
            case 3:
                _b.sent();
                return [2 /*return*/];
            case 4:
                children = data.children, leading = data.leading;
                filelist = [];
                children.forEach(function (answer) {
                    filelist.push(answer.file);
                });
                answer = filelist[0];
                return [4 /*yield*/, put(Actions.setAnswers(filelist))];
            case 5:
                _b.sent();
                return [4 /*yield*/, put(Actions.setAnswer(answer))];
            case 6:
                _b.sent();
                if (!(typeof leading === 'number')) return [3 /*break*/, 8];
                return [4 /*yield*/, put(Actions.setLeading(leading))];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [4 /*yield*/, put(Actions.setLoading(false))];
            case 9:
                _b.sent();
                return [2 /*return*/];
        }
    });
}
function fetchDataByAnswer(_a) {
    var fileextension, data, timeBegin_1, timeLength_1, bounds, busmovesbasedic, movesbase_1, timeBegin, timeLength, trips, d, strYmdBegin, fileYmd, movesbase_2, data, bustripscsv;
    var answer = _a.answer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fileextension = answer.split('.');
                if (!(fileextension[1] === 'json')) return [3 /*break*/, 18];
                return [4 /*yield*/, put(Actions.setLoading(true))];
            case 1:
                _b.sent();
                return [4 /*yield*/, fetchJSON("" + DATAPATH + answer)];
            case 2:
                data = (_b.sent()).data;
                if (!!data) return [3 /*break*/, 4];
                return [4 /*yield*/, put(Actions.setLoading(false))];
            case 3:
                _b.sent();
                return [2 /*return*/];
            case 4:
                if (!(typeof data.busmovesbase !== 'undefined')) return [3 /*break*/, 10];
                timeBegin_1 = data.timeBegin, timeLength_1 = data.timeLength, bounds = data.bounds, busmovesbasedic = data.busmovesbasedic;
                movesbase_1 = data.busmovesbase;
                return [4 /*yield*/, put(Actions.setBusTripsCsv([]))];
            case 5:
                _b.sent();
                return [4 /*yield*/, put(Actions.setBusTripIndex({}))];
            case 6:
                _b.sent();
                return [4 /*yield*/, put(Actions.setMovesBase({ timeBegin: timeBegin_1, timeLength: timeLength_1, bounds: bounds, movesbase: movesbase_1 }))];
            case 7:
                _b.sent();
                return [4 /*yield*/, put(Actions.setBusMovesBaseDic(busmovesbasedic))];
            case 8:
                _b.sent();
                return [4 /*yield*/, put(Actions.setLoading(false))];
            case 9:
                _b.sent();
                return [2 /*return*/];
            case 10:
                timeBegin = data.timeBegin, timeLength = data.timeLength, trips = data.trips;
                d = new Date(timeBegin * 1000);
                strYmdBegin = p02d(d.getFullYear()) + p02d(d.getMonth() + 1) + p02d(d.getDate());
                fileYmd = fileextension[0].split('-')[1].substr(0, 8);
                if (!(strYmdBegin !== fileYmd)) return [3 /*break*/, 12];
                return [4 /*yield*/, put(Actions.setLoading(false))];
            case 11:
                _b.sent();
                alert("date error\ntimeBegin=" + strYmdBegin + "\nfileneme=" + fileYmd);
                return [2 /*return*/];
            case 12:
                movesbase_2 = [];
                trips.forEach(function (trip) {
                    var segments = trip.segments, colorSpec = trip.color;
                    var operation = [];
                    segments.forEach(function (tripsegment, idx) {
                        var longitude = tripsegment[0], latitude = tripsegment[1], elapsedtime = tripsegment[2];
                        var color = (colorSpec && colorSpec[idx]) ? colorSpec[idx] : COLOR1;
                        operation.push({ elapsedtime: elapsedtime, longitude: longitude, latitude: latitude, color: color });
                        if (!(idx < (segments.length - 1) && (segments[idx + 1][2] - tripsegment[2]) <= 10)) {
                            operation.push({ elapsedtime: (elapsedtime + 10), longitude: longitude, latitude: latitude, color: color });
                        }
                    });
                    movesbase_2.push({
                        departuretime: segments[0][2],
                        arrivaltime: segments[segments.length - 1][2],
                        operation: operation
                    });
                });
                return [4 /*yield*/, put(Actions.setBusTripsCsv([]))];
            case 13:
                _b.sent();
                return [4 /*yield*/, put(Actions.setBusTripIndex({}))];
            case 14:
                _b.sent();
                return [4 /*yield*/, put(Actions.setMovesBase({ timeBegin: timeBegin, timeLength: timeLength, movesbase: movesbase_2 }))];
            case 15:
                _b.sent();
                return [4 /*yield*/, put(Actions.setBusMovesBaseDic({}))];
            case 16:
                _b.sent();
                return [4 /*yield*/, put(Actions.setLoading(false))];
            case 17:
                _b.sent();
                return [3 /*break*/, 26];
            case 18:
                if (!(fileextension[1] === 'csv')) return [3 /*break*/, 26];
                return [4 /*yield*/, put(Actions.setLoading(true))];
            case 19:
                _b.sent();
                return [4 /*yield*/, fetchCSV("" + DATAPATH + answer, true)];
            case 20:
                data = (_b.sent()).data;
                if (!!data) return [3 /*break*/, 22];
                return [4 /*yield*/, put(Actions.setLoading(false))];
            case 21:
                _b.sent();
                return [2 /*return*/];
            case 22:
                bustripscsv = data.map(function (current) {
                    return {
                        diagramid: current.ダイヤＩＤ,
                        routecode: current.路線コード,
                        systemcode: current.系統コード,
                        direction: current.上下コード || current.上下,
                        systemname: current.系統表示名,
                        timetable: current.所定発時刻,
                        actualdep: current.実績発時刻,
                        busstopcode: current.停留所コード,
                        busstoporder: current.並び順
                    };
                });
                return [4 /*yield*/, put(Actions.setBusTripsCsv(bustripscsv))];
            case 23:
                _b.sent();
                return [4 /*yield*/, put(Actions.setBusTripIndex({}))];
            case 24:
                _b.sent();
                return [4 /*yield*/, put(Actions.setLoading(false))];
            case 25:
                _b.sent();
                _b.label = 26;
            case 26: return [2 /*return*/];
        }
    });
}
function fetchBusstopCSV() {
    var busstopscsv, _a, data, conversionData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = getContainerProp;
                return [4 /*yield*/, select()];
            case 1:
                busstopscsv = _a.apply(void 0, [_b.sent()]).busstopscsv;
                if (!(busstopscsv.length === 0)) return [3 /*break*/, 7];
                return [4 /*yield*/, put(Actions.setLoading(true))];
            case 2:
                _b.sent();
                return [4 /*yield*/, fetchCSV(BUSSTOPSPATH + "busstops.csv")];
            case 3:
                data = (_b.sent()).data;
                if (!data) return [3 /*break*/, 5];
                conversionData = data.map(function (current) {
                    return {
                        code: current.停留所コード,
                        name: current.停留所名,
                        longitude: Number(current.経度),
                        latitude: Number(current.緯度),
                    };
                });
                return [4 /*yield*/, put(Actions.setBusstopsCsv(conversionData))];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [4 /*yield*/, put(Actions.setLoading(false))];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}
function fetchBusstopRoutesJSON() {
    var busroutes, _a, data;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = getContainerProp;
                return [4 /*yield*/, select()];
            case 1:
                busroutes = _a.apply(void 0, [_b.sent()]).busroutes;
                if (!(Object.keys(busroutes).length === 0)) return [3 /*break*/, 7];
                return [4 /*yield*/, put(Actions.setLoading(true))];
            case 2:
                _b.sent();
                return [4 /*yield*/, fetchJSON(ROUTESPATH + "busroutes.json")];
            case 3:
                data = (_b.sent()).data;
                if (!data) return [3 /*break*/, 5];
                return [4 /*yield*/, put(Actions.setBusRoutes(data))];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [4 /*yield*/, put(Actions.setLoading(false))];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}
function fetchRoutesJSON() {
    var routesdata, _a, data, dep_station_code_1, des_station_code_1, route, routesdict_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = getContainerProp;
                return [4 /*yield*/, select()];
            case 1:
                routesdata = _a.apply(void 0, [_b.sent()]).routesdata;
                if (!(Object.keys(routesdata).length === 0)) return [3 /*break*/, 7];
                return [4 /*yield*/, put(Actions.setLoading(true))];
            case 2:
                _b.sent();
                return [4 /*yield*/, fetchJSON(ROUTESPATH + "routes.json")];
            case 3:
                data = (_b.sent()).data;
                if (!data) return [3 /*break*/, 5];
                dep_station_code_1 = data.dep_station_code, des_station_code_1 = data.des_station_code, route = data.route;
                routesdict_1 = {};
                route.forEach(function (current, idx) {
                    routesdict_1[p04d(dep_station_code_1[idx]) + p04d(des_station_code_1[idx])] = current;
                });
                return [4 /*yield*/, put(Actions.setRoutesData(routesdict_1))];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [4 /*yield*/, put(Actions.setLoading(false))];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}
function fetchBusstopsOption() {
    var answer, _a, bsoptFname, data;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = getContainerProp;
                return [4 /*yield*/, select()];
            case 1:
                answer = _a.apply(void 0, [_b.sent()]).answer;
                bsoptFname = answer.split('.')[0] + "-option";
                return [4 /*yield*/, put(Actions.setLoading(true))];
            case 2:
                _b.sent();
                return [4 /*yield*/, fetchJSON("" + BUSSTOPSPATH + bsoptFname + ".json")];
            case 3:
                data = (_b.sent()).data;
                if (!data) return [3 /*break*/, 7];
                return [4 /*yield*/, put(Actions.setBusOption(data))];
            case 4:
                _b.sent();
                return [4 /*yield*/, put(Actions.setBsoptFname(bsoptFname))];
            case 5:
                _b.sent();
                return [4 /*yield*/, put(Actions.setArchBase([]))];
            case 6:
                _b.sent();
                return [3 /*break*/, 11];
            case 7: return [4 /*yield*/, put(Actions.setBusOption({}))];
            case 8:
                _b.sent();
                return [4 /*yield*/, put(Actions.setBsoptFname(''))];
            case 9:
                _b.sent();
                return [4 /*yield*/, put(Actions.setArchBase([]))];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11: return [4 /*yield*/, put(Actions.setLoading(false))];
            case 12:
                _b.sent();
                return [2 /*return*/];
        }
    });
}
function setupByCSV() {
    var _a, bustripscsv, busstopscsv, routesdata, busroutes, answer, busoption, _b, fileextension, fileymd, ymd, savediagramid, savebusinfo, savebusstatus, tripbase, busmovesbase, busmovesbasedic, busmovesoption, busoptionlist, bssidx;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = getContainerProp;
                return [4 /*yield*/, select()];
            case 1:
                _a = _b.apply(void 0, [_c.sent()]), bustripscsv = _a.bustripscsv, busstopscsv = _a.busstopscsv, routesdata = _a.routesdata, busroutes = _a.busroutes, answer = _a.answer, busoption = _a.busoption;
                fileextension = answer.split('.');
                if (fileextension[1] !== 'csv') {
                    return [2 /*return*/];
                }
                if (!bustripscsv || bustripscsv.length === 0) {
                    return [2 /*return*/];
                }
                fileymd = fileextension[0].split('-')[1];
                ymd = [
                    Number(fileymd.substr(0, 4)),
                    Number(fileymd.substr(4, 2)) - 1,
                    Number(fileymd.substr(6, 2))
                ];
                savediagramid = '';
                savebusinfo = {};
                savebusstatus = [];
                tripbase = [];
                busmovesbase = [];
                busmovesbasedic = {};
                busmovesoption = (busoption || {}).busmovesoption;
                busoptionlist = null;
                bustripscsv.forEach(function (csvdata) {
                    var diagramid = csvdata.diagramid, routecode = csvdata.routecode, systemcode = csvdata.systemcode, direction = csvdata.direction, systemname = csvdata.systemname, timetable = csvdata.timetable, actualdep = csvdata.actualdep, busstopcode = csvdata.busstopcode, busstoporder = csvdata.busstoporder;
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
                        var tiemConversion = function (ndate, sTime) {
                            var hms = sTime.split(':').map(function (current) { return Number(current); });
                            return new Date(ndate[0], ndate[1], ndate[2], hms[0], hms[1], hms[2] || 0).getTime();
                        };
                        var dtime = tiemConversion(ymd, actualdep);
                        var dtime2 = tiemConversion(ymd, timetable);
                        var delaysec = (dtime - dtime2) / 1000;
                        var busprop = busoptionlist ?
                            (busoptionlist[busstopcode + busstoporder] ||
                                busoptionlist[busstopcode] || null) : null;
                        var pushdata = {
                            busstopcode: busstopcode,
                            elapsedtime: dtime / 1000,
                            order: Number(busstoporder) - 1,
                            delaysec: delaysec, busprop: busprop
                        };
                        savebusstatus.push(pushdata);
                    }
                });
                if (savebusstatus.length > 0) {
                    tripbase.push({ diagramid: savediagramid, businfo: savebusinfo, busstatus: savebusstatus });
                }
                if (tripbase.length === 0) {
                    return [2 /*return*/];
                }
                bssidx = {};
                busstopscsv.forEach(function (current, idx) {
                    bssidx[current.code] = idx;
                });
                tripbase.forEach(function (trip, idx) {
                    var diagramid = trip.diagramid, businfo = trip.businfo, busstatus = trip.busstatus;
                    var systemcode = businfo.systemcode, direction = businfo.direction, systemname = businfo.systemname, timetable = businfo.timetable;
                    var operation = [];
                    var savebusoption = null;
                    var color = COLOR1;
                    var busclass = { systemcode: systemcode, direction: direction, systemname: systemname, diagramid: diagramid, timetable: timetable };
                    for (var j = 0, lengthj = busstatus.length; j < lengthj; j += 1) {
                        var _a = busstatus[j], busstopcode = _a.busstopcode, elapsedtime = _a.elapsedtime, order = _a.order, delaysec = _a.delaysec, busprop = _a.busprop;
                        if (bssidx[busstopcode]) {
                            var busstoplocation = busstopscsv[bssidx[busstopcode]];
                            var longitude = busstoplocation.longitude, latitude = busstoplocation.latitude;
                            operation.push({
                                elapsedtime: elapsedtime - 10,
                                longitude: longitude, latitude: latitude, color: color, delaysec: delaysec,
                                busprop: savebusoption
                            });
                            savebusoption = busprop;
                            operation.push({
                                elapsedtime: elapsedtime,
                                longitude: longitude, latitude: latitude, color: color, delaysec: delaysec,
                                busprop: savebusoption
                            });
                            if (j < busstatus.length - 1 && busstopcode !== busstatus[j + 1].busstopcode) {
                                var busrouteskey = systemcode + "-" + direction;
                                var _b = busstatus[j + 1], nextbusstopcode = _b.busstopcode, nextelapsedtime = _b.elapsedtime, nextorder = _b.order, nextdelaysec = _b.delaysec;
                                var bsorderlist = [];
                                if (busroutes[busrouteskey]) {
                                    var wkbusroute = busroutes[busrouteskey];
                                    for (var k = order; k < nextorder; k += 1) {
                                        if (wkbusroute[k] !== wkbusroute[k + 1]) {
                                            bsorderlist.push({ busstopcode: p04d(wkbusroute[k]),
                                                nextbusstopcode: p04d(wkbusroute[k + 1]) });
                                        }
                                    }
                                }
                                else {
                                    bsorderlist.push({ busstopcode: p04d(busstopcode),
                                        nextbusstopcode: p04d(nextbusstopcode) });
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
                                        }
                                        else {
                                            route = [];
                                            break;
                                        }
                                    }
                                    else {
                                        route = [];
                                        break;
                                    }
                                }
                                var st = elapsedtime;
                                var et = nextelapsedtime - 10;
                                var dt = et - st;
                                for (var p = 0; p < route.length; p += 1) {
                                    var rt = route[p];
                                    if (rt[2] > 0 && rt[2] < distance) {
                                        operation.push({
                                            elapsedtime: st + (dt * (rt[2] / distance)),
                                            longitude: Number(rt[1]), latitude: Number(rt[0]), color: color,
                                            delaysec: Math.floor(delaysec + ((nextdelaysec - delaysec) *
                                                (rt[2] / distance))),
                                            busprop: savebusoption
                                        });
                                    }
                                }
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
                return [4 /*yield*/, put(Actions.setMovesBase({ movesbase: busmovesbase }))];
            case 2:
                _c.sent();
                return [4 /*yield*/, put(Actions.setBusMovesBaseDic(busmovesbasedic))];
            case 3:
                _c.sent();
                return [2 /*return*/];
        }
    });
}
function setupByBusstopCSV() {
    var _a, busstopscsv, busoption, _b, busstopsoption, optionlist, option, depotsBase;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = getContainerProp;
                return [4 /*yield*/, select()];
            case 1:
                _a = _b.apply(void 0, [_c.sent()]), busstopscsv = _a.busstopscsv, busoption = _a.busoption;
                if (!!busoption.busstopsoption) return [3 /*break*/, 3];
                return [4 /*yield*/, put(Actions.setDepotsBase(busstopscsv))];
            case 2:
                _c.sent();
                return [2 /*return*/];
            case 3:
                busstopsoption = busoption.busstopsoption;
                optionlist = [];
                Object.keys(busstopsoption).forEach(function (time) {
                    var optionvalue = busstopsoption[time];
                    optionvalue.forEach(function (option) {
                        var bscode = option.bscode, elevation = option.elevation, color = option.color, memo = option.memo;
                        optionlist.push({ time: Number(time),
                            bscode: bscode,
                            elevation: elevation || null,
                            color: color || null,
                            memo: memo || null
                        });
                    });
                });
                optionlist.sort(function (a, b) { return (a.time - b.time); });
                option = {};
                optionlist.forEach(function (optiondata) {
                    var bscode = optiondata.bscode, time = optiondata.time, elevation = optiondata.elevation, color = optiondata.color, memo = optiondata.memo;
                    if (typeof option[bscode] === 'undefined') {
                        option[bscode] = { stime: time, etime: time, data: [{ time: time, elevation: elevation, color: color, memo: memo }] };
                    }
                    else {
                        var optionvalue = option[bscode];
                        optionvalue.stime = Math.min(optionvalue.stime, time);
                        optionvalue.etime = Math.max(optionvalue.etime, time);
                        optionvalue.data.push({ time: time, elevation: elevation, color: color, memo: memo });
                    }
                });
                depotsBase = [];
                busstopscsv.forEach(function (csvdata) {
                    if (csvdata.code in option) {
                        depotsBase.push(Object.assign({}, csvdata, { option: option[csvdata.code] }));
                    }
                    else {
                        depotsBase.push(Object.assign({}, csvdata));
                    }
                });
                return [4 /*yield*/, put(Actions.setDepotsBase(depotsBase))];
            case 4:
                _c.sent();
                return [2 /*return*/];
        }
    });
}
function setupFetch(_a) {
    var answer = _a.answer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, call(fetchDataByAnswer, { answer: answer })];
            case 1:
                _b.sent();
                return [4 /*yield*/, call(fetchBusstopsOption)];
            case 2:
                _b.sent();
                return [4 /*yield*/, call(fetchBusstopCSV)];
            case 3:
                _b.sent();
                return [4 /*yield*/, call(fetchBusstopRoutesJSON)];
            case 4:
                _b.sent();
                return [4 /*yield*/, call(fetchRoutesJSON)];
            case 5:
                _b.sent();
                return [4 /*yield*/, call(setupByCSV)];
            case 6:
                _b.sent();
                return [4 /*yield*/, call(setupByBusstopCSV)];
            case 7:
                _b.sent();
                return [2 /*return*/];
        }
    });
}
function initializeFetch(_a) {
    var answer, _b;
    var path = _a.path;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, call(fetchDataList, { path: path })];
            case 1:
                _c.sent();
                _b = getContainerProp;
                return [4 /*yield*/, select()];
            case 2:
                answer = _b.apply(void 0, [_c.sent()]).answer;
                return [4 /*yield*/, call(setupFetch, { answer: answer })];
            case 3:
                _c.sent();
                return [2 /*return*/];
        }
    });
}
function updateRoute(_a) {
    var _b, object, layer, movesbaseidx, id, _c, delayheight, movesbase, _d, delayrange, _e, retel, routePaths, _f, operation, busclass, delaysecmax, j, _g, longitude, latitude, delaysec, _h, nextlongitude, nextlatitude, nextdelaysec, j, _j, longitude, latitude, color, _k, nextlongitude, nextlatitude;
    var el = _a.el, sw = _a.sw;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                if (!el) {
                    return [2 /*return*/];
                }
                _b = el[0], object = _b.object, layer = _b.layer;
                movesbaseidx = object.movesbaseidx;
                id = layer.id;
                _d = getContainerProp;
                return [4 /*yield*/, select()];
            case 1:
                _c = _d.apply(void 0, [_l.sent()]), delayheight = _c.delayheight, movesbase = _c.movesbase;
                _e = getContainerProp;
                return [4 /*yield*/, select()];
            case 2:
                delayrange = _e.apply(void 0, [_l.sent()]).delayrange;
                retel = null;
                routePaths = [];
                _f = movesbase[movesbaseidx], operation = _f.operation, busclass = _f.busclass;
                if (!busclass) return [3 /*break*/, 5];
                if (!sw) return [3 /*break*/, 4];
                delaysecmax = operation.reduce(function (prev, current) { return Math.max(prev, current.delaysec); }, 0);
                delayrange = Math.floor(delaysecmax / 60) + 1;
                if (delayrange > 120) {
                    delayrange = 120;
                }
                return [4 /*yield*/, put(Actions.setDelayRange(delayrange))];
            case 3:
                _l.sent();
                _l.label = 4;
            case 4:
                for (j = 0; j < (operation.length - 1); j += 1) {
                    _g = operation[j], longitude = _g.longitude, latitude = _g.latitude, delaysec = _g.delaysec;
                    _h = operation[j + 1], nextlongitude = _h.longitude, nextlatitude = _h.latitude, nextdelaysec = _h.delaysec;
                    routePaths.push({
                        sourcePosition: [longitude, latitude, ((delaysec / 2) * delayheight) + 2],
                        targetPosition: [nextlongitude, nextlatitude,
                            ((nextdelaysec / 2) * delayheight) + 2],
                        color: delaycolor(delaysec, delayrange)
                    });
                }
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, put(Actions.setDelayRange(1))];
            case 6:
                _l.sent();
                for (j = 0; j < (operation.length - 1); j += 1) {
                    _j = operation[j], longitude = _j.longitude, latitude = _j.latitude, color = _j.color;
                    _k = operation[j + 1], nextlongitude = _k.longitude, nextlatitude = _k.latitude;
                    routePaths.push({
                        movesbaseidx: movesbaseidx,
                        sourcePosition: [longitude, latitude, 0],
                        targetPosition: [nextlongitude, nextlatitude, 0],
                        color: color || COLOR1
                    });
                }
                _l.label = 7;
            case 7:
                retel = [{ object: object, layer: { id: id } }];
                return [4 /*yield*/, put(Actions.setClicked(retel))];
            case 8:
                _l.sent();
                return [4 /*yield*/, put(Actions.setRoutePaths(routePaths))];
            case 9:
                _l.sent();
                return [2 /*return*/];
        }
    });
}
function updateRainfall(_a) {
    var d, year, month, day, hour, min, nextXbandFname, data;
    var settime = _a.settime, xbandCellSize = _a.xbandCellSize, answer = _a.answer, xbandFname = _a.xbandFname;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(xbandCellSize === 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, put(Actions.setXbandFname(''))];
            case 1:
                _b.sent();
                return [2 /*return*/];
            case 2:
                d = new Date(settime * 1000);
                year = d.getFullYear();
                month = d.getMonth() + 1;
                day = d.getDate();
                hour = d.getHours();
                min = d.getMinutes();
                nextXbandFname = answer.split('-')[0] + "-" + p02d(year) + p02d(month) + p02d(day) + "-" + p02d(hour) + p02d(min);
                if (nextXbandFname === xbandFname) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, put(Actions.setXbandFname(nextXbandFname))];
            case 3:
                _b.sent();
                return [4 /*yield*/, put(Actions.setLoading(true))];
            case 4:
                _b.sent();
                return [4 /*yield*/, fetchJSON("" + GRIDDATAPATH + nextXbandFname + ".json")];
            case 5:
                data = (_b.sent()).data;
                if (!data) return [3 /*break*/, 7];
                return [4 /*yield*/, put(Actions.setRainfall(data))];
            case 6:
                _b.sent();
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, put(Actions.setRainfall([]))];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9: return [4 /*yield*/, put(Actions.setLoading(false))];
            case 10:
                _b.sent();
                return [2 /*return*/];
        }
    });
}
export default function rootSaga() {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, takeEvery(types.FETCHDATALIST, fetchDataList)];
            case 1:
                _a.sent();
                return [4 /*yield*/, takeEvery(types.FETCHDATABYANSWER, fetchDataByAnswer)];
            case 2:
                _a.sent();
                return [4 /*yield*/, takeEvery(types.FETCHBUSSTOPCSV, fetchBusstopCSV)];
            case 3:
                _a.sent();
                return [4 /*yield*/, takeEvery(types.FETCHBUSSTOPROUTESJSON, fetchBusstopRoutesJSON)];
            case 4:
                _a.sent();
                return [4 /*yield*/, takeEvery(types.FETCHROUTESJSON, fetchRoutesJSON)];
            case 5:
                _a.sent();
                return [4 /*yield*/, takeEvery(types.FETCHBUSSTOPSOPTION, fetchBusstopsOption)];
            case 6:
                _a.sent();
                return [4 /*yield*/, takeEvery(types.INITIALIZEFETCH, initializeFetch)];
            case 7:
                _a.sent();
                return [4 /*yield*/, takeEvery(types.SETUPFETCH, setupFetch)];
            case 8:
                _a.sent();
                return [4 /*yield*/, takeEvery(types.UPDATEROUTE, updateRoute)];
            case 9:
                _a.sent();
                return [4 /*yield*/, takeEvery(types.UPDATERAINFALL, updateRainfall)];
            case 10:
                _a.sent();
                return [2 /*return*/];
        }
    });
}
//# sourceMappingURL=index.js.map