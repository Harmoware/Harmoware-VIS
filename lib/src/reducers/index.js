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
import { analyzeMovesBase, getMoveObjects, getDepots, calcLoopTime } from '../library';
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { addMinutes, setViewport, setDefaultViewport, setTimeStamp, setTime, increaseTime, decreaseTime, setLeading, setTrailing, setFrameTimestamp, setMovesBase, setDepotsBase, setAnimatePause, setAnimateReverse, setSecPerHour, setClicked, setRoutePaths, setDefaultPitch, setMovesOptionFunc, setDepotsOptionFunc, setLinemapData, setLoading, setInputFilename, updateMovesBase } from '../actions';
var initialState = {
    viewport: {
        longitude: 136.906428,
        latitude: 35.181453,
        zoom: 10,
        maxZoom: 18,
        minZoom: 5,
        pitch: 30,
        bearing: 0,
        width: 500,
        height: 500,
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
    secperhour: 180,
    clickedObject: null,
    routePaths: [],
    defaultZoom: 11.1,
    defaultPitch: 30,
    getMovesOptionFunc: null,
    getDepotsOptionFunc: null,
    movedData: [],
    depotsData: [],
    linemapData: [],
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
reducer.case(setDefaultViewport, function (state) {
    var viewport = Object.assign({}, state.viewport, {
        bearing: 0, zoom: state.defaultZoom, pitch: state.defaultPitch
    });
    return Object.assign({}, state, {
        viewport: viewport
    });
});
reducer.case(setTimeStamp, function (state, props) {
    var starttimestamp = (Date.now() + calcLoopTime(state.leading, state.secperhour));
    return Object.assign({}, state, {
        starttimestamp: starttimestamp
    });
});
reducer.case(setTime, function (state, settime) {
    var starttimestamp = Date.now() - (((settime - state.timeBegin) / state.timeLength) * state.loopTime);
    return Object.assign({}, state, {
        settime: settime, starttimestamp: starttimestamp
    });
});
reducer.case(increaseTime, function (state, props) {
    var now = Date.now();
    if ((now - state.starttimestamp) > state.loopTime) {
        console.log('settime overlap.');
        var settime_1 = (state.timeBegin - state.leading);
        var starttimestamp = now - (((settime_1 - state.timeBegin) / state.timeLength) * state.loopTime);
        var setProps_1 = __assign(__assign({}, props), { settime: settime_1, starttimestamp: starttimestamp });
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
    var setProps = __assign(__assign({}, props), { settime: settime, beforeFrameTimestamp: beforeFrameTimestamp });
    var movedData = getMoveObjects(setProps);
    var depotsData = getDepots(setProps);
    return Object.assign({}, state, {
        settime: settime, beforeFrameTimestamp: beforeFrameTimestamp, movedData: movedData, depotsData: depotsData
    });
});
reducer.case(decreaseTime, function (state, props) {
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
    var setProps = __assign(__assign({}, props), { settime: settime, starttimestamp: starttimestamp, beforeFrameTimestamp: beforeFrameTimestamp });
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
    var beforeFrameTimestamp = Date.now();
    var setProps = __assign(__assign({}, props), { beforeFrameTimestamp: beforeFrameTimestamp });
    var movedData = getMoveObjects(setProps);
    var depotsData = getDepots(setProps);
    return Object.assign({}, state, {
        beforeFrameTimestamp: beforeFrameTimestamp, movedData: movedData, depotsData: depotsData
    });
});
reducer.case(setMovesBase, function (state, base) {
    var analyzeData = analyzeMovesBase(base);
    var timeBegin = analyzeData.timeBegin, bounds = analyzeData.bounds, movesbase = analyzeData.movesbase, view = analyzeData.viewport;
    var viewport = Object.assign({}, state.viewport, view);
    var settime = timeBegin - (movesbase.length === 0 ? 0 : state.leading);
    var timeLength = analyzeData.timeLength;
    if (timeLength > 0) {
        timeLength += state.trailing;
    }
    var loopTime = calcLoopTime(timeLength, state.secperhour);
    // starttimestampはDate.now()の値でいいが、スタート時はleading分の余白時間を付加する
    var starttimestamp = Date.now() + calcLoopTime(state.leading, state.secperhour);
    var depotsBase = state.depotsBase;
    var setState = __assign(__assign({}, state), { bounds: bounds });
    var depotsData = getDepots(setState);
    var linemapData = state.linemapData;
    return Object.assign({}, state, {
        timeBegin: timeBegin,
        timeLength: timeLength,
        bounds: bounds,
        movesbase: movesbase,
        movedData: [],
        settime: settime,
        loopTime: loopTime,
        starttimestamp: starttimestamp,
        depotsBase: depotsBase,
        depotsData: depotsData,
        linemapData: linemapData,
        viewport: viewport
    });
});
reducer.case(setDepotsBase, function (state, depotsBase) {
    var setState = __assign(__assign({}, state), { depotsBase: depotsBase });
    var depotsData = getDepots(setState);
    return Object.assign({}, state, {
        depotsBase: depotsBase, depotsData: depotsData
    });
});
reducer.case(setAnimatePause, function (state, animatePause) {
    var starttimestamp = (Date.now() - (((state.settime - state.timeBegin) / state.timeLength) * state.loopTime));
    return Object.assign({}, state, {
        animatePause: animatePause, starttimestamp: starttimestamp
    });
});
reducer.case(setAnimateReverse, function (state, animateReverse) {
    return Object.assign({}, state, {
        animateReverse: animateReverse
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
reducer.case(setLinemapData, function (state, linemapData) {
    return Object.assign({}, state, {
        linemapData: linemapData
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
    var analyzeData = analyzeMovesBase(base);
    var timeBegin = analyzeData.timeBegin, bounds = analyzeData.bounds, movesbase = analyzeData.movesbase, view = analyzeData.viewport;
    var timeLength = analyzeData.timeLength;
    if (state.movesbase.length === 0 || timeLength === 0) { //初回？
        var settime = timeBegin - state.leading;
        if (timeLength > 0) {
            timeLength += state.trailing;
        }
        var loopTime = calcLoopTime(timeLength, state.secperhour);
        // starttimestampはDate.now()の値でいいが、スタート時はleading分の余白時間を付加する
        var starttimestamp = Date.now() + calcLoopTime(state.leading, state.secperhour);
        var depotsBase = state.depotsBase;
        var linemapData = state.linemapData;
        var setState = __assign(__assign({}, state), { bounds: bounds });
        var depotsData = getDepots(setState);
        var viewport = Object.assign({}, state.viewport, { bearing: 0, zoom: state.defaultZoom, pitch: state.defaultPitch }, view);
        return Object.assign({}, state, {
            timeBegin: timeBegin, timeLength: timeLength, bounds: bounds,
            movesbase: movesbase, movedData: [], settime: settime,
            loopTime: loopTime, starttimestamp: starttimestamp,
            depotsBase: depotsBase, depotsData: depotsData, linemapData: linemapData, viewport: viewport
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
    return Object.assign({}, state, startState, { movesbase: movesbase, movedData: [] });
});
reducer.default(function (state) { return state; });
export default reducer.build();
//# sourceMappingURL=index.js.map