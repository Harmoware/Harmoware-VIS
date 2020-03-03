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
    var assignData = {};
    assignData.settime = state.settime + (min * 60);
    if (assignData.settime <= (state.timeBegin - state.leading)) {
        assignData.settime = (state.timeBegin - state.leading);
    }
    assignData.starttimestamp = Date.now() - (((assignData.settime - state.timeBegin) / state.timeLength) * state.loopTime);
    return Object.assign({}, state, assignData);
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
        var assignData_1 = {};
        assignData_1.settime = (state.timeBegin - state.leading);
        assignData_1.starttimestamp = now - (((assignData_1.settime - state.timeBegin) / state.timeLength) * state.loopTime);
        var setProps_1 = __assign(__assign({}, props), assignData_1);
        assignData_1.movedData = getMoveObjects(setProps_1);
        if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
            assignData_1.depotsData = getDepots(setProps_1);
        }
        return Object.assign({}, state, assignData_1);
    }
    var beforeSettime = state.settime;
    var assignData = {};
    assignData.settime = ((((now - state.starttimestamp) % state.loopTime) /
        state.loopTime) * state.timeLength) + state.timeBegin;
    if (beforeSettime > assignData.settime) {
        console.log(beforeSettime + " " + assignData.settime);
    }
    assignData.beforeFrameTimestamp = now;
    var setProps = __assign(__assign({}, props), assignData);
    assignData.movedData = getMoveObjects(setProps);
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        assignData.depotsData = getDepots(setProps);
    }
    return Object.assign({}, state, assignData);
});
reducer.case(decreaseTime, function (state, props) {
    var now = Date.now();
    var beforeFrameElapsed = now - state.beforeFrameTimestamp;
    var assignData = {};
    assignData.starttimestamp = state.starttimestamp + (beforeFrameElapsed * 2);
    assignData.settime = ((((now - state.starttimestamp) % state.loopTime) /
        state.loopTime) * state.timeLength) + state.timeBegin;
    if (assignData.settime <= (state.timeBegin - state.leading)) {
        assignData.settime = state.timeBegin + state.timeLength;
        assignData.starttimestamp = now - (((assignData.settime - state.timeBegin) / state.timeLength) * state.loopTime);
    }
    assignData.beforeFrameTimestamp = now;
    var setProps = __assign(__assign({}, props), assignData);
    assignData.movedData = getMoveObjects(setProps);
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        assignData.depotsData = getDepots(setProps);
    }
    return Object.assign({}, state, assignData);
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
    var assignData = {};
    assignData.beforeFrameTimestamp = Date.now();
    var setProps = __assign(__assign({}, props), assignData);
    assignData.movedData = getMoveObjects(setProps);
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        assignData.depotsData = getDepots(setProps);
    }
    return Object.assign({}, state, assignData);
});
reducer.case(setMovesBase, function (state, base) {
    var analyzeData = analyzeMovesBase(base);
    var assignData = {};
    assignData.timeBegin = analyzeData.timeBegin;
    assignData.bounds = analyzeData.bounds;
    assignData.viewport = Object.assign({}, state.viewport, analyzeData.viewport);
    assignData.settime =
        analyzeData.timeBegin - (analyzeData.movesbase.length === 0 ? 0 : state.leading);
    if (analyzeData.timeLength > 0) {
        assignData.timeLength = analyzeData.timeLength + state.trailing;
    }
    else {
        assignData.timeLength = analyzeData.timeLength;
    }
    assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
    // starttimestampはDate.now()の値でいいが、スタート時はleading分の余白時間を付加する
    assignData.starttimestamp = Date.now() + calcLoopTime(state.leading, state.secperhour);
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        assignData.depotsData = getDepots(__assign(__assign({}, state), { bounds: analyzeData.bounds }));
    }
    assignData.movesbase = analyzeData.movesbase;
    assignData.movedData = [];
    return Object.assign({}, state, assignData);
});
reducer.case(setDepotsBase, function (state, depotsBase) {
    var assignData = {};
    assignData.depotsBase = depotsBase;
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        assignData.depotsData = getDepots(__assign(__assign({}, state), { depotsBase: depotsBase }));
    }
    return Object.assign({}, state, assignData);
});
reducer.case(setAnimatePause, function (state, animatePause) {
    var assignData = {};
    assignData.animatePause = animatePause;
    assignData.starttimestamp = (Date.now() - (((state.settime - state.timeBegin) / state.timeLength) * state.loopTime));
    return Object.assign({}, state, assignData);
});
reducer.case(setAnimateReverse, function (state, animateReverse) {
    return Object.assign({}, state, {
        animateReverse: animateReverse
    });
});
reducer.case(setSecPerHour, function (state, secperhour) {
    var assignData = {};
    assignData.secperhour = secperhour;
    assignData.loopTime = calcLoopTime(state.timeLength, secperhour);
    if (!state.animatePause) {
        assignData.starttimestamp =
            (Date.now() - (((state.settime - state.timeBegin) / state.timeLength) * assignData.loopTime));
    }
    return Object.assign({}, state, assignData);
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
    var assignData = {};
    if (state.movesbase.length === 0 || analyzeData.timeLength === 0) { //初回？
        assignData.timeBegin = analyzeData.timeBegin;
        assignData.timeLength = analyzeData.timeLength;
        assignData.bounds = analyzeData.bounds;
        assignData.movesbase = analyzeData.movesbase;
        assignData.movedData = [];
        assignData.settime = analyzeData.timeBegin - state.leading;
        if (assignData.timeLength > 0) {
            assignData.timeLength = assignData.timeLength + state.trailing;
        }
        assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
        // starttimestampはDate.now()の値でいいが、スタート時はleading分の余白時間を付加する
        assignData.starttimestamp = Date.now() + calcLoopTime(state.leading, state.secperhour);
        assignData.viewport = Object.assign({}, state.viewport, { bearing: 0, zoom: state.defaultZoom, pitch: state.defaultPitch }, analyzeData.viewport);
        if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
            assignData.depotsData = getDepots(__assign(__assign({}, state), assignData));
        }
        return Object.assign({}, state, assignData);
    }
    assignData.movesbase = analyzeData.movesbase;
    assignData.movedData = [];
    var startState = {};
    startState.timeLength = analyzeData.timeLength;
    if (startState.timeLength > 0) {
        startState.timeLength = startState.timeLength + state.trailing;
    }
    if (analyzeData.timeBegin !== state.timeBegin || startState.timeLength !== state.timeLength) {
        startState.timeBegin = analyzeData.timeBegin;
        startState.loopTime = calcLoopTime(startState.timeLength, state.secperhour);
        startState.starttimestamp =
            (Date.now() - (((state.settime - startState.timeBegin) / startState.timeLength) * startState.loopTime));
        return Object.assign({}, state, startState, assignData);
    }
    return Object.assign({}, state, assignData);
});
reducer.default(function (state) { return state; });
export default reducer.build();
//# sourceMappingURL=index.js.map