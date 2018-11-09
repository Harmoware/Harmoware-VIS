import * as types from '../constants/action-types';
/** saga * */
export var fetchDataList = function (path) { return ({ type: types.FETCHDATALIST, path: path }); };
export var fetchDataByAnswer = function (answer) { return ({ type: types.FETCHDATABYANSWER, answer: answer }); };
export var fetchBusstopCSV = function () { return ({ type: types.FETCHBUSSTOPCSV }); };
export var fetchBusstopRoutesJSON = function () { return ({ type: types.FETCHBUSSTOPROUTESJSON }); };
export var fetchRoutesJSON = function () { return ({ type: types.FETCHROUTESJSON }); };
export var fetchBusstopsOption = function () { return ({ type: types.FETCHBUSSTOPSOPTION }); };
export var initializeFetch = function (path) { return ({ type: types.INITIALIZEFETCH, path: path }); };
export var setupFetch = function (answer) { return ({ type: types.SETUPFETCH, answer: answer }); };
export var updateRoute = function (el, sw) { return ({ type: types.UPDATEROUTE, el: el, sw: sw }); };
export var updateRainfall = function (settime, timeBegin, xbandCellSize, answer, xbandFname) { return ({ type: types.UPDATERAINFALL, settime: settime, timeBegin: timeBegin, xbandCellSize: xbandCellSize, answer: answer, xbandFname: xbandFname }); };
/** reducer * */
export var setDelayHeight = function (height) { return ({ type: types.SETDELAYHEIGHT, height: height }); };
export var setScaleElevation = function (elevation) { return ({ type: types.SETSCALEELEVATION, elevation: elevation }); };
export var setCellSize = function (xbandCellSize) { return ({ type: types.SETCELLSIZE, xbandCellSize: xbandCellSize }); };
export var setXbandFname = function (xbandFname) { return ({ type: types.SETXBANDFNAME, xbandFname: xbandFname }); };
export var setDelayRange = function (delayrange) { return ({ type: types.SETDELAYRANGE, delayrange: delayrange }); };
export var setBsoptFname = function (name) { return ({ type: types.SETBSOPTFNAME, name: name }); };
export var setSelectedBusstop = function (busstop) { return ({ type: types.SETSELECTEDBUSSTOP, busstop: busstop }); };
export var setSelectedBus = function (selectedBus) { return ({ type: types.SETSELECTEDBUS, selectedBus: selectedBus }); };
export var setAnswers = function (answers) { return ({ type: types.SETANSWERS, answers: answers }); };
export var setAnswer = function (answer) { return ({ type: types.SETANSWER, answer: answer }); };
export var setHovered = function (hovered) { return ({ type: types.SETHOVERED, hovered: hovered }); };
export var setBusOption = function (option) { return ({ type: types.SETBUSOPTION, option: option }); };
export var setBusMovesBaseDic = function (dic) { return ({ type: types.SETBUSMOVESBASEDIC, dic: dic }); };
export var setRoutesData = function (routes) { return ({ type: types.SETROUTESDATA, routes: routes }); };
export var setBusTripsCsv = function (csv) { return ({ type: types.SETBUSTRIPSCSV, csv: csv }); };
export var setBusstopsCsv = function (csv) { return ({ type: types.SETBUSSTOPSCSV, csv: csv }); };
export var setBusRoutes = function (routes) { return ({ type: types.SETBUSROUTES, routes: routes }); };
export var setBusTripIndex = function (bustripindex) { return ({ type: types.SETBUSTRIPINDEX, bustripindex: bustripindex }); };
export var setArchBase = function (archbase) { return ({ type: types.SETARCHBASE, archbase: archbase }); };
export var setRainfall = function (rainfall) { return ({ type: types.SETRAINFALL, rainfall: rainfall }); };
//# sourceMappingURL=index.js.map