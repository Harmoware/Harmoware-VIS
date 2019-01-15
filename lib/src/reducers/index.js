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
import { analyzeMovesBase, analyzeDepotsBase, analyzelinemapData, getMoveObjects, getDepots, calcLoopTime } from '../library';
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { addMinutes, setViewport, setLightSettings, setTimeStamp, setTime, increaseTime, decreaseTime, setLeading, setTrailing, setFrameTimestamp, setMovesBase, setDepotsBase, setAnimatePause, setAnimateReverse, setSecPerHour, setClicked, setRoutePaths, setDefaultPitch, setMovesOptionFunc, setDepotsOptionFunc, setNonmapView, setLinemapData, setLoading, setInputFilename, updateMovesBase } from '../actions';
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
var reducer = reducerWithInitialState(initialState);
reducer.case(addMinutes, function (state, min) {
    var settime = state.settime + (min * 60);
    if (settime <= (state.timeBegin - state.leading)) {
        settime = (state.timeBegin - state.leading);
    }
    var starttimestamp = Date.now() - (((settime - state.timeBegin) / state.timeLength) * state.loopTime);
    return Object.assign({}, state, {
        settime: settime, starttimestamp: starttimestamp
    });
});
reducer.case(setViewport, function (state, view) {
    var viewport = Object.assign({}, state.viewport, view);
    return Object.assign({}, state, {
        viewport: viewport
    });
});
reducer.case(setLightSettings, function (state, light) {
    var lightSettings = Object.assign({}, state.lightSettings, light);
    return Object.assign({}, state, {
        lightSettings: lightSettings
    });
});
reducer.case(setTimeStamp, function (state, props) {
    var latestProps = props;
    var starttimestamp = (Date.now() + calcLoopTime(state.leading, state.secperhour));
    var setProps = __assign({}, latestProps, { starttimestamp: starttimestamp });
    var depotsData = getDepots(setProps);
    return Object.assign({}, state, {
        starttimestamp: starttimestamp, depotsData: depotsData
    });
});
reducer.case(setTime, function (state, time) {
    var settime = time;
    var starttimestamp = Date.now() - (((settime - state.timeBegin) / state.timeLength) * state.loopTime);
    return Object.assign({}, state, {
        settime: settime, starttimestamp: starttimestamp
    });
});
reducer.case(increaseTime, function (state, props) {
    var latestProps = props;
    var now = Date.now();
    if ((now - state.starttimestamp) > state.loopTime) {
        console.log('settime overlap.');
        var settime_1 = (state.timeBegin - state.leading);
        var starttimestamp = now - (((settime_1 - state.timeBegin) / state.timeLength) * state.loopTime);
        var setProps_1 = __assign({}, latestProps, { settime: settime_1, starttimestamp: starttimestamp });
        var movedData_1 = getMoveObjects(setProps_1);
        var depotsData_1 = getDepots(setProps_1);
        return Object.assign({}, state, {
            settime: settime_1, starttimestamp: starttimestamp, movedData: movedData_1, depotsData: depotsData_1
        });
    }
    var beforeSettime = state.settime;
    var settime = ((((now - state.starttimestamp) % state.loopTime) /
        state.loopTime) * state.timeLength) + state.timeBegin;
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
});
reducer.case(decreaseTime, function (state, props) {
    var latestProps = props;
    var now = Date.now();
    var beforeFrameElapsed = now - state.beforeFrameTimestamp;
    var starttimestamp = state.starttimestamp + (beforeFrameElapsed * 2);
    var settime = ((((now - state.starttimestamp) % state.loopTime) /
        state.loopTime) * state.timeLength) + state.timeBegin;
    if (settime <= (state.timeBegin - state.leading)) {
        settime = state.timeBegin + state.timeLength;
        starttimestamp = now - (((settime - state.timeBegin) / state.timeLength) * state.loopTime);
    }
    var beforeFrameTimestamp = now;
    var setProps = __assign({}, latestProps, { settime: settime, starttimestamp: starttimestamp, beforeFrameTimestamp: beforeFrameTimestamp });
    var movedData = getMoveObjects(setProps);
    var depotsData = getDepots(setProps);
    return Object.assign({}, state, {
        settime: settime, starttimestamp: starttimestamp, beforeFrameTimestamp: beforeFrameTimestamp, movedData: movedData, depotsData: depotsData
    });
});
reducer.case(setLeading, function (state, leading) {
    return Object.assign({}, state, {
        leading: leading
    });
});
reducer.case(setTrailing, function (state, trailing) {
    return Object.assign({}, state, {
        trailing: trailing
    });
});
reducer.case(setFrameTimestamp, function (state, props) {
    var latestProps = props;
    var beforeFrameTimestamp = Date.now();
    var setProps = __assign({}, latestProps, { beforeFrameTimestamp: beforeFrameTimestamp });
    var movedData = getMoveObjects(setProps);
    var depotsData = getDepots(setProps);
    return Object.assign({}, state, {
        beforeFrameTimestamp: beforeFrameTimestamp, movedData: movedData, depotsData: depotsData
    });
});
reducer.case(setMovesBase, function (state, base) {
    var analyzeData = analyzeMovesBase(state.nonmapView, base);
    var timeBegin = analyzeData.timeBegin, bounds = analyzeData.bounds, movesbase = analyzeData.movesbase;
    var settime = timeBegin - state.leading;
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
});
reducer.case(setDepotsBase, function (state, depots) {
    var depotsBaseOriginal = JSON.stringify(depots);
    var depotsBase = analyzeDepotsBase(state.nonmapView, depots);
    return Object.assign({}, state, {
        depotsBase: depotsBase, depotsBaseOriginal: depotsBaseOriginal
    });
});
reducer.case(setAnimatePause, function (state, pause) {
    var animatePause = pause;
    var starttimestamp = (Date.now() - (((state.settime - state.timeBegin) / state.timeLength) * state.loopTime));
    return Object.assign({}, state, {
        animatePause: animatePause, starttimestamp: starttimestamp
    });
});
reducer.case(setAnimateReverse, function (state, reverse) {
    return Object.assign({}, state, {
        animateReverse: reverse
    });
});
reducer.case(setSecPerHour, function (state, secperhour) {
    var loopTime = calcLoopTime(state.timeLength, secperhour);
    var starttimestamp = state.starttimestamp;
    if (!state.animatePause) {
        starttimestamp = (Date.now() - (((state.settime - state.timeBegin) / state.timeLength) * loopTime));
    }
    return Object.assign({}, state, {
        secperhour: secperhour, loopTime: loopTime, starttimestamp: starttimestamp
    });
});
reducer.case(setClicked, function (state, clickedObject) {
    return Object.assign({}, state, {
        clickedObject: clickedObject
    });
});
reducer.case(setRoutePaths, function (state, routePaths) {
    return Object.assign({}, state, {
        routePaths: routePaths
    });
});
reducer.case(setDefaultPitch, function (state, defaultPitch) {
    return Object.assign({}, state, {
        defaultPitch: defaultPitch
    });
});
reducer.case(setMovesOptionFunc, function (state, getMovesOptionFunc) {
    return Object.assign({}, state, {
        getMovesOptionFunc: getMovesOptionFunc
    });
});
reducer.case(setDepotsOptionFunc, function (state, getDepotsOptionFunc) {
    return Object.assign({}, state, {
        getDepotsOptionFunc: getDepotsOptionFunc
    });
});
reducer.case(setNonmapView, function (state, nonmapView) {
    return Object.assign({}, state, {
        nonmapView: nonmapView
    });
});
reducer.case(setLinemapData, function (state, mapData) {
    var linemapDataOriginal = JSON.stringify(mapData);
    var linemapData = analyzelinemapData(state.nonmapView, mapData);
    return Object.assign({}, state, {
        linemapData: linemapData, linemapDataOriginal: linemapDataOriginal
    });
});
reducer.case(setLoading, function (state, loading) {
    return Object.assign({}, state, {
        loading: loading
    });
});
reducer.case(setInputFilename, function (state, fileName) {
    var inputFileName = Object.assign({}, state.inputFileName, fileName);
    return Object.assign({}, state, {
        inputFileName: inputFileName
    });
});
reducer.case(updateMovesBase, function (state, base) {
    var analyzeData = analyzeMovesBase(false, base);
    var timeBegin = analyzeData.timeBegin, bounds = analyzeData.bounds, movesbase = analyzeData.movesbase;
    var timeLength = analyzeData.timeLength;
    if (state.movesbase.length === 0 || timeLength === 0) { //初回？
        var settime = timeBegin - state.leading;
        if (timeLength > 0) {
            timeLength += state.trailing;
        }
        var loopTime = calcLoopTime(timeLength, state.secperhour);
        // starttimestampはDate.now()の値でいいが、スタート時はleading分の余白時間を付加する
        var starttimestamp = Date.now() + calcLoopTime(state.leading, state.secperhour);
        var viewport = Object.assign({}, state.viewport, analyzeData.viewport, { zoom: state.defaultZoom, pitch: state.defaultPitch });
        var depotsBase = state.depotsBase;
        var linemapData = state.linemapData;
        return Object.assign({}, state, {
            timeBegin: timeBegin, timeLength: timeLength, bounds: bounds,
            movesbase: movesbase, viewport: viewport, settime: settime,
            loopTime: loopTime, starttimestamp: starttimestamp,
            depotsBase: depotsBase, linemapData: linemapData
        });
    }
    var startState = {};
    if (timeLength > 0) {
        timeLength += state.trailing;
    }
    if (timeBegin !== state.timeBegin || timeLength !== state.timeLength) {
        var loopTime = calcLoopTime(timeLength, state.secperhour);
        var starttimestamp = (Date.now() - (((state.settime - timeBegin) / timeLength) * loopTime));
        startState = Object.assign({}, startState, {
            timeBegin: timeBegin, timeLength: timeLength, loopTime: loopTime, starttimestamp: starttimestamp
        });
    }
    return Object.assign({}, state, startState, { movesbase: movesbase });
});
reducer.default(function (state) { return state; });
export default reducer.build();
//# sourceMappingURL=index.js.map