var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as types from '../constants/action-types';
import { analyzeMovesBase, analyzeDepotsBase, analyzelinemapData, getMoveObjects, getDepots, calcLoopTime } from '../library';
var initialState = {
    viewport: {
        longitude: 136.906428,
        latitude: 35.181453,
        zoom: 11.1,
        maxZoom: 16,
        minZoom: 5,
        pitch: 30,
        bearing: 0,
        width: 500,
        height: 500,
        lookAt: [0, 0, 0],
        distance: 200,
        rotationX: 60,
        rotationY: 0,
        fov: 50,
        minDistance: 0,
        maxDistance: 500,
    },
    lightSettings: {
        lightsPosition: [137.087638, 34.883046, 8000, 137.399026, 35.13819, 8000],
        ambientRatio: 0.2,
        diffuseRatio: 0.5,
        specularRatio: 0.3,
        lightsStrength: [1.0, 0.0, 2.0, 0.0],
        numberOfLights: 2,
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
    depotsBaseOriginal: '',
    bounds: {
        westlongitiude: 0,
        eastlongitiude: 0,
        southlatitude: 0,
        northlatitude: 0
    },
    animatePause: false,
    animateReverse: false,
    secperhour: 180,
    clickedObject: null,
    routePaths: [],
    defaultZoom: 11.1,
    defaultPitch: 30,
    getMovesOptionFunc: null,
    getDepotsOptionFunc: null,
    movedData: [],
    depotsData: [],
    nonmapView: false,
    linemapData: [],
    linemapDataOriginal: '',
    loading: false,
    inputFileName: {}
};
export default (function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case types.SETVIEWPORT:
            return (function () {
                var viewport = Object.assign({}, state.viewport, action.viewport);
                return Object.assign({}, state, {
                    viewport: viewport
                });
            })();
        case types.SETLIGHTSETTINGS:
            return (function () {
                var lightSettings = Object.assign({}, state.lightSettings, action.lightSettings);
                return Object.assign({}, state, {
                    lightSettings: lightSettings
                });
            })();
        case types.ADDMINUTES:
            return (function () {
                var settime = state.settime + (action.min * 60);
                if (settime <= (0 - state.leading)) {
                    settime = (0 - state.leading);
                }
                var starttimestamp = Date.now() - ((settime / state.timeLength) * state.loopTime);
                return Object.assign({}, state, {
                    settime: settime, starttimestamp: starttimestamp
                });
            })();
        case types.SETTIMESTAMP:
            return (function () {
                var latestProps = action.props;
                var starttimestamp = (Date.now() + calcLoopTime(state.leading, state.secperhour));
                var setProps = __assign({}, latestProps, { starttimestamp: starttimestamp });
                var depotsData = getDepots(setProps);
                return Object.assign({}, state, {
                    starttimestamp: starttimestamp, depotsData: depotsData
                });
            })();
        case types.SETTIME:
            return (function () {
                var settime = action.time;
                var starttimestamp = Date.now() - ((settime / state.timeLength) * state.loopTime);
                return Object.assign({}, state, {
                    settime: settime, starttimestamp: starttimestamp
                });
            })();
        case types.INCREASETIME:
            return (function () {
                var latestProps = action.props;
                var now = Date.now();
                if ((now - state.starttimestamp) > state.loopTime) {
                    console.log('settime overlap.');
                    var settime_1 = (0 - state.leading);
                    var starttimestamp = now - ((settime_1 / state.timeLength) * state.loopTime);
                    var setProps_1 = __assign({}, latestProps, { settime: settime_1, starttimestamp: starttimestamp });
                    var movedData_1 = getMoveObjects(setProps_1);
                    var depotsData_1 = getDepots(setProps_1);
                    return Object.assign({}, state, {
                        settime: settime_1, starttimestamp: starttimestamp, movedData: movedData_1, depotsData: depotsData_1
                    });
                }
                var beforeSettime = state.settime;
                var settime = (((now - state.starttimestamp) % state.loopTime) /
                    state.loopTime) * state.timeLength;
                if (beforeSettime > settime) {
                    console.log(beforeSettime + " " + settime);
                }
                var beforeFrameTimestamp = now;
                var setProps = __assign({}, latestProps, { settime: settime, beforeFrameTimestamp: beforeFrameTimestamp });
                var movedData = getMoveObjects(setProps);
                var depotsData = getDepots(setProps);
                return Object.assign({}, state, {
                    settime: settime, beforeFrameTimestamp: beforeFrameTimestamp, movedData: movedData, depotsData: depotsData
                });
            })();
        case types.DECREASETIME:
            return (function () {
                var latestProps = action.props;
                var now = Date.now();
                var beforeFrameElapsed = now - state.beforeFrameTimestamp;
                var starttimestamp = state.starttimestamp + (beforeFrameElapsed * 2);
                var settime = (((now - state.starttimestamp) % state.loopTime) /
                    state.loopTime) * state.timeLength;
                if (settime <= (0 - state.leading)) {
                    settime = state.timeLength;
                    starttimestamp = now - ((settime / state.timeLength) * state.loopTime);
                }
                var beforeFrameTimestamp = now;
                var setProps = __assign({}, latestProps, { settime: settime, starttimestamp: starttimestamp, beforeFrameTimestamp: beforeFrameTimestamp });
                var movedData = getMoveObjects(setProps);
                var depotsData = getDepots(setProps);
                return Object.assign({}, state, {
                    settime: settime, starttimestamp: starttimestamp, beforeFrameTimestamp: beforeFrameTimestamp, movedData: movedData, depotsData: depotsData
                });
            })();
        case types.SETLEADING:
            return (function () {
                var leading = action.leading;
                return Object.assign({}, state, {
                    leading: leading
                });
            })();
        case types.SETTRAILING:
            return (function () {
                var trailing = action.trailing;
                return Object.assign({}, state, {
                    trailing: trailing
                });
            })();
        case types.SETFRAMETIMESTAMP:
            return (function () {
                var latestProps = action.props;
                var beforeFrameTimestamp = Date.now();
                var setProps = __assign({}, latestProps, { beforeFrameTimestamp: beforeFrameTimestamp });
                var movedData = getMoveObjects(setProps);
                var depotsData = getDepots(setProps);
                return Object.assign({}, state, {
                    beforeFrameTimestamp: beforeFrameTimestamp, movedData: movedData, depotsData: depotsData
                });
            })();
        case types.SETMOVESBASE:
            return (function () {
                var analyzeData = analyzeMovesBase(state.nonmapView, action.base);
                var settime = state.leading * -1;
                var timeBegin = analyzeData.timeBegin, bounds = analyzeData.bounds, movesbase = analyzeData.movesbase;
                var timeLength = analyzeData.timeLength;
                if (timeLength > 0) {
                    timeLength += state.trailing;
                }
                var loopTime = calcLoopTime(timeLength, state.secperhour);
                // starttimestampはDate.now()の値でいいが、スタート時はleading分の余白時間を付加する
                var starttimestamp = Date.now() + calcLoopTime(state.leading, state.secperhour);
                var viewport = Object.assign({}, state.viewport, analyzeData.viewport, { zoom: state.defaultZoom, pitch: state.defaultPitch });
                var depotsBase = state.depotsBase;
                if (state.nonmapView && state.depotsBaseOriginal.length > 0) {
                    var depotsBaseOriginal = JSON.parse(state.depotsBaseOriginal);
                    depotsBase =
                        analyzeDepotsBase(state.nonmapView, depotsBaseOriginal);
                }
                var linemapData = state.linemapData;
                if (state.nonmapView && state.linemapDataOriginal.length > 0) {
                    var linemapDataOriginal = JSON.parse(state.linemapDataOriginal);
                    linemapData =
                        analyzelinemapData(state.nonmapView, linemapDataOriginal);
                }
                return Object.assign({}, state, {
                    timeBegin: timeBegin,
                    timeLength: timeLength,
                    bounds: bounds,
                    movesbase: movesbase,
                    viewport: viewport,
                    settime: settime,
                    loopTime: loopTime,
                    starttimestamp: starttimestamp,
                    depotsBase: depotsBase,
                    linemapData: linemapData
                });
            })();
        case types.SETDEPOTSBASE:
            return (function () {
                var depotsBaseOriginal = JSON.stringify(action.depotsBase);
                var depotsBase = analyzeDepotsBase(state.nonmapView, action.depotsBase);
                return Object.assign({}, state, {
                    depotsBase: depotsBase, depotsBaseOriginal: depotsBaseOriginal
                });
            })();
        case types.SETANIMATEPAUSE:
            return (function () {
                var animatePause = action.pause;
                var starttimestamp = (Date.now() - ((state.settime / state.timeLength) * state.loopTime));
                return Object.assign({}, state, {
                    animatePause: animatePause, starttimestamp: starttimestamp
                });
            })();
        case types.SETANIMATEREVERSE:
            return (function () {
                var animateReverse = action.reverse;
                return Object.assign({}, state, {
                    animateReverse: animateReverse
                });
            })();
        case types.SETSECPERHOUR:
            return (function () {
                var secperhour = action.secperhour;
                var loopTime = calcLoopTime(state.timeLength, secperhour);
                var starttimestamp = state.starttimestamp;
                if (!state.animatePause) {
                    starttimestamp = (Date.now() - ((state.settime / state.timeLength) * loopTime));
                }
                return Object.assign({}, state, {
                    secperhour: secperhour, loopTime: loopTime, starttimestamp: starttimestamp
                });
            })();
        case types.SETCLICKED:
            return (function () {
                var clickedObject = action.clickedObject;
                return Object.assign({}, state, {
                    clickedObject: clickedObject
                });
            })();
        case types.SETROUTEPATHS:
            return (function () {
                var routePaths = action.paths;
                return Object.assign({}, state, {
                    routePaths: routePaths
                });
            })();
        case types.SETDEFAULTZOOM:
            return (function () {
                var defaultZoom = action.defaultZoom;
                return Object.assign({}, state, {
                    defaultZoom: defaultZoom
                });
            })();
        case types.SETDEFAULTPITCH:
            return (function () {
                var defaultPitch = action.defaultPitch;
                return Object.assign({}, state, {
                    defaultPitch: defaultPitch
                });
            })();
        case types.SETMOVESOPTIONFUNC:
            return (function () {
                var getMovesOptionFunc = action.func;
                return Object.assign({}, state, {
                    getMovesOptionFunc: getMovesOptionFunc
                });
            })();
        case types.SETDEPOTSOPTIONFUNC:
            return (function () {
                var getDepotsOptionFunc = action.func;
                return Object.assign({}, state, {
                    getDepotsOptionFunc: getDepotsOptionFunc
                });
            })();
        case types.SETNONMAPVIEW:
            return (function () {
                var nonmapView = action.nonmapView;
                return Object.assign({}, state, {
                    nonmapView: nonmapView
                });
            })();
        case types.SETLINEMAPDATA:
            return (function () {
                var linemapDataOriginal = JSON.stringify(action.linemapData);
                var linemapData = analyzelinemapData(state.nonmapView, action.linemapData);
                return Object.assign({}, state, {
                    linemapData: linemapData, linemapDataOriginal: linemapDataOriginal
                });
            })();
        case types.SETLOADING:
            return (function () {
                var loading = action.loading;
                return Object.assign({}, state, {
                    loading: loading
                });
            })();
        case types.SETINPUTFILENAME:
            return (function () {
                var inputFileName = Object.assign({}, state.inputFileName, action.inputFileName);
                return Object.assign({}, state, {
                    inputFileName: inputFileName
                });
            })();
        default:
            return state;
    }
});
//# sourceMappingURL=index.js.map