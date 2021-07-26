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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { analyzeMovesBase, getMoveObjects, getDepots, safeCheck, safeAdd, safeSubtract } from '../library';
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { addMinutes, setViewport, setDefaultViewport, setTimeStamp, setTime, increaseTime, decreaseTime, setLeading, setTrailing, setFrameTimestamp, setMovesBase, setDepotsBase, setAnimatePause, setAnimateReverse, setSecPerHour, setClicked, setRoutePaths, setDefaultPitch, setMovesOptionFunc, setDepotsOptionFunc, setLinemapData, setLoading, setInputFilename, updateMovesBase, setNoLoop, setInitialViewChange, setIconGradationChange, setTimeBegin, setTimeLength, addMovesBaseData } from '../actions';
var initialState = {
    viewport: {
        longitude: 136.906428,
        latitude: 35.181453,
        zoom: 11.1,
        maxZoom: 18,
        minZoom: 5,
        pitch: 30,
        bearing: 0,
        maxPitch: undefined,
        minPitch: undefined,
        width: window.innerWidth,
        height: window.innerHeight,
        transitionDuration: undefined,
        transitionInterpolator: undefined,
        transitionInterruption: undefined,
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
    loopEndPause: false,
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
    inputFileName: {},
    noLoop: false,
    initialViewChange: true,
    iconGradation: false
};
var parameter = {
    coefficient: 0
};
var calcLoopTime = // LoopTime とは１ループにかける時間（ミリ秒）
 function (timeLength, secperhour) { return (timeLength / 3.6) * secperhour; };
var reducer = reducerWithInitialState(initialState);
var assign = Object.assign;
reducer.case(addMinutes, function (state, min) {
    var assignData = {};
    assignData.loopEndPause = false;
    assignData.settime = safeAdd(state.settime, (min * 60));
    if (assignData.settime < safeSubtract(state.timeBegin, state.leading)) {
        assignData.settime = safeSubtract(state.timeBegin, state.leading);
    }
    if (assignData.settime > (state.timeBegin + state.timeLength)) {
        assignData.settime = (state.timeBegin + state.timeLength);
    }
    assignData.starttimestamp = Date.now() -
        (((assignData.settime - state.timeBegin) / state.timeLength) * state.loopTime);
    return assign({}, state, assignData);
});
reducer.case(setViewport, function (state, view) {
    var viewport = assign({}, state.viewport, view);
    return assign({}, state, {
        viewport: viewport
    });
});
reducer.case(setDefaultViewport, function (state, defViewport) {
    if (defViewport === void 0) { defViewport = {}; }
    var defaultZoom = defViewport.defaultZoom, defaultPitch = defViewport.defaultPitch;
    var zoom = defaultZoom === undefined ? state.defaultZoom : defaultZoom;
    var pitch = defaultPitch === undefined ? state.defaultPitch : defaultPitch;
    var viewport = assign({}, state.viewport, { bearing: 0, zoom: zoom, pitch: pitch });
    return assign({}, state, {
        viewport: viewport, defaultZoom: zoom, defaultPitch: pitch
    });
});
reducer.case(setTimeStamp, function (state, props) {
    var starttimestamp = (Date.now() + calcLoopTime(state.leading, state.secperhour));
    return assign({}, state, {
        starttimestamp: starttimestamp, loopEndPause: false
    });
});
reducer.case(setTime, function (state, settime) {
    var starttimestamp = Date.now() - ((safeSubtract(settime, state.timeBegin) / state.timeLength) * state.loopTime);
    return assign({}, state, {
        settime: settime, starttimestamp: starttimestamp, loopEndPause: false
    });
});
reducer.case(increaseTime, function (state, props) {
    var assignData = {};
    var now = Date.now();
    var difference = now - state.starttimestamp;
    if (state.noLoop) {
        var margins = calcLoopTime(state.leading + state.trailing, state.secperhour);
        if (difference >= (state.loopTime - margins)) {
            return assign({}, state, { loopEndPause: true });
        }
    }
    if (difference >= state.loopTime) {
        console.log('settime overlap.');
        assignData.settime = safeSubtract(state.timeBegin, state.leading);
        assignData.starttimestamp = now - ((safeSubtract(assignData.settime, state.timeBegin) / state.timeLength) * state.loopTime);
        var setProps_1 = __assign(__assign({}, props), assignData);
        var movedData_1 = getMoveObjects(setProps_1);
        if (movedData_1) {
            assignData.movedData = movedData_1;
            if (assignData.movedData.length === 0) {
                assignData.clickedObject = null;
                assignData.routePaths = [];
            }
        }
        if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
            var depotsData = getDepots(setProps_1);
            if (depotsData) {
                assignData.depotsData = depotsData;
            }
        }
        return assign({}, state, assignData);
    }
    else {
        //    assignData.settime = ((difference / state.loopTime) * state.timeLength) + state.timeBegin;
        assignData.settime = safeAdd((difference * parameter.coefficient), state.timeBegin);
    }
    if (state.settime > assignData.settime) {
        console.log(state.settime + " " + assignData.settime);
    }
    assignData.beforeFrameTimestamp = now;
    var setProps = __assign(__assign({}, props), assignData);
    var movedData = getMoveObjects(setProps);
    if (movedData) {
        assignData.movedData = movedData;
        if (assignData.movedData.length === 0) {
            assignData.clickedObject = null;
            assignData.routePaths = [];
        }
    }
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        var depotsData = getDepots(setProps);
        if (depotsData) {
            assignData.depotsData = depotsData;
        }
    }
    return assign({}, state, assignData);
});
reducer.case(decreaseTime, function (state, props) {
    var now = Date.now();
    var beforeFrameElapsed = now - state.beforeFrameTimestamp;
    var assignData = {};
    assignData.starttimestamp = state.starttimestamp + (beforeFrameElapsed << 1);
    assignData.settime = safeAdd(((now - state.starttimestamp) % state.loopTime) * parameter.coefficient, state.timeBegin);
    if (assignData.settime <= safeSubtract(state.timeBegin, state.leading)) {
        if (state.noLoop) {
            return assign({}, state, { loopEndPause: true });
        }
        assignData.settime = safeAdd(state.timeBegin, state.timeLength);
        assignData.starttimestamp = now - ((safeSubtract(assignData.settime, state.timeBegin) / state.timeLength) * state.loopTime);
    }
    assignData.beforeFrameTimestamp = now;
    var setProps = __assign(__assign({}, props), assignData);
    var movedData = getMoveObjects(setProps);
    if (movedData) {
        assignData.movedData = movedData;
        if (assignData.movedData.length === 0) {
            assignData.clickedObject = null;
            assignData.routePaths = [];
        }
    }
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        var depotsData = getDepots(setProps);
        if (depotsData) {
            assignData.depotsData = depotsData;
        }
    }
    return assign({}, state, assignData);
});
reducer.case(setLeading, function (state, leading) {
    safeCheck(leading);
    return assign({}, state, {
        leading: leading
    });
});
reducer.case(setTrailing, function (state, trailing) {
    safeCheck(trailing);
    return assign({}, state, {
        trailing: trailing
    });
});
reducer.case(setFrameTimestamp, function (state, props) {
    var assignData = {};
    var now = Date.now();
    assignData.beforeFrameTimestamp = now;
    assignData.starttimestamp = now - ((safeSubtract(state.settime, state.timeBegin) / state.timeLength) * state.loopTime);
    var setProps = __assign(__assign({}, props), assignData);
    var movedData = getMoveObjects(setProps);
    if (movedData) {
        assignData.movedData = movedData;
        if (assignData.movedData.length === 0) {
            assignData.clickedObject = null;
            assignData.routePaths = [];
        }
    }
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        var depotsData = getDepots(setProps);
        if (depotsData) {
            assignData.depotsData = depotsData;
        }
    }
    return assign({}, state, assignData);
});
var setMovesBaseFunc = function (state, analyzeData) {
    var assignData = {};
    assignData.loopEndPause = false;
    assignData.timeBegin = analyzeData.timeBegin;
    assignData.bounds = analyzeData.bounds;
    if (analyzeData.viewport && state.initialViewChange && analyzeData.movesbase.length > 0) {
        assignData.viewport = assign({}, state.viewport, { bearing: 0, zoom: state.defaultZoom, pitch: state.defaultPitch }, analyzeData.viewport);
    }
    assignData.settime =
        safeSubtract(analyzeData.timeBegin, (analyzeData.movesbase.length === 0 ? 0 : state.leading));
    if (analyzeData.timeLength > 0) {
        assignData.timeLength = safeAdd(analyzeData.timeLength, state.trailing);
    }
    else {
        assignData.timeLength = analyzeData.timeLength;
    }
    assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
    parameter.coefficient = assignData.timeLength / assignData.loopTime;
    // starttimestampはDate.now()の値でいいが、スタート時はleading分の余白時間を付加する
    assignData.starttimestamp = Date.now() + calcLoopTime(state.leading, state.secperhour);
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        var depotsData = getDepots(__assign(__assign({}, state), assignData));
        if (depotsData) {
            assignData.depotsData = depotsData;
        }
    }
    assignData.movesbase = analyzeData.movesbase;
    assignData.movedData = [];
    console.log('setMovesBaseFunc');
    return assign({}, state, assignData);
};
reducer.case(setMovesBase, function (state, base) {
    var analyzeData = analyzeMovesBase(state, base, false);
    return setMovesBaseFunc(state, analyzeData);
});
reducer.case(setDepotsBase, function (state, depotsBase) {
    var assignData = {};
    assignData.depotsBase = depotsBase;
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        var depotsData = getDepots(__assign(__assign({}, state), { depotsBase: depotsBase }));
        if (depotsData) {
            assignData.depotsData = depotsData;
        }
    }
    return assign({}, state, assignData);
});
reducer.case(setAnimatePause, function (state, animatePause) {
    var assignData = {};
    assignData.animatePause = animatePause;
    assignData.loopEndPause = false;
    assignData.starttimestamp = (Date.now() - ((safeSubtract(state.settime, state.timeBegin) / state.timeLength) * state.loopTime));
    return assign({}, state, assignData);
});
reducer.case(setAnimateReverse, function (state, animateReverse) {
    return assign({}, state, {
        animateReverse: animateReverse, loopEndPause: false
    });
});
reducer.case(setSecPerHour, function (state, secperhour) {
    var assignData = {};
    assignData.loopEndPause = false;
    assignData.secperhour = secperhour;
    assignData.loopTime = calcLoopTime(state.timeLength, secperhour);
    parameter.coefficient = state.timeLength / assignData.loopTime;
    if (!state.animatePause) {
        assignData.starttimestamp =
            (Date.now() - ((safeSubtract(state.settime, state.timeBegin) / state.timeLength) * assignData.loopTime));
    }
    return assign({}, state, assignData);
});
reducer.case(setClicked, function (state, clickedObject) {
    return assign({}, state, {
        clickedObject: clickedObject
    });
});
reducer.case(setRoutePaths, function (state, routePaths) {
    return assign({}, state, {
        routePaths: routePaths
    });
});
reducer.case(setDefaultPitch, function (state, defaultPitch) {
    return assign({}, state, {
        defaultPitch: defaultPitch
    });
});
reducer.case(setMovesOptionFunc, function (state, getMovesOptionFunc) {
    return assign({}, state, {
        getMovesOptionFunc: getMovesOptionFunc
    });
});
reducer.case(setDepotsOptionFunc, function (state, getDepotsOptionFunc) {
    return assign({}, state, {
        getDepotsOptionFunc: getDepotsOptionFunc
    });
});
reducer.case(setLinemapData, function (state, linemapData) {
    return assign({}, state, {
        linemapData: linemapData
    });
});
reducer.case(setLoading, function (state, loading) {
    return assign({}, state, {
        loading: loading
    });
});
reducer.case(setInputFilename, function (state, fileName) {
    var inputFileName = assign({}, state.inputFileName, fileName);
    return assign({}, state, {
        inputFileName: inputFileName
    });
});
reducer.case(updateMovesBase, function (state, base) {
    var analyzeData = analyzeMovesBase(state, base, true);
    if (state.movesbase.length === 0) { //初回？
        return setMovesBaseFunc(state, analyzeData);
    }
    var assignData = {};
    assignData.loopEndPause = false;
    assignData.movesbase = analyzeData.movesbase;
    var startState = {};
    startState.timeLength = analyzeData.timeLength;
    if (startState.timeLength > 0) {
        startState.timeLength = safeAdd(startState.timeLength, state.trailing);
    }
    if (analyzeData.timeBegin !== state.timeBegin || startState.timeLength !== state.timeLength) {
        startState.timeBegin = analyzeData.timeBegin;
        startState.loopTime = calcLoopTime(startState.timeLength, state.secperhour);
        parameter.coefficient = startState.timeLength / startState.loopTime;
        startState.starttimestamp =
            (Date.now() - ((safeSubtract(state.settime, startState.timeBegin) / startState.timeLength) * startState.loopTime));
        return assign({}, state, startState, assignData);
    }
    return assign({}, state, assignData);
});
reducer.case(setNoLoop, function (state, noLoop) {
    return assign({}, state, {
        noLoop: noLoop, loopEndPause: false
    });
});
reducer.case(setInitialViewChange, function (state, initialViewChange) {
    return assign({}, state, {
        initialViewChange: initialViewChange
    });
});
reducer.case(setIconGradationChange, function (state, iconGradation) {
    return assign({}, state, {
        iconGradation: iconGradation
    });
});
reducer.case(setTimeBegin, function (state, timeBegin) {
    safeCheck(timeBegin);
    var assignData = {};
    var movesbaselength = state.movesbase.length;
    if (movesbaselength > 0) {
        var firstDeparturetime = state.movesbase.reduce(function (acc, cur) { return Math.min(acc, cur.departuretime); }, Number.MAX_SAFE_INTEGER);
        if (firstDeparturetime >= timeBegin) {
            assignData.timeBegin = timeBegin;
            assignData.timeLength = safeAdd(state.timeLength, safeSubtract(state.timeBegin, assignData.timeBegin));
            if (assignData.timeLength === 0) {
                assignData.settime = assignData.timeBegin;
            }
            else {
                assignData.settime = state.settime;
            }
            assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
            parameter.coefficient = assignData.timeLength / assignData.loopTime;
            assignData.starttimestamp =
                (Date.now() - ((safeSubtract(assignData.settime, assignData.timeBegin) / assignData.timeLength) * assignData.loopTime));
        }
    }
    else {
        if (state.timeLength === 0) {
            assignData.timeBegin = timeBegin;
            assignData.settime = assignData.timeBegin;
            assignData.starttimestamp =
                (Date.now() - ((safeSubtract(assignData.settime, assignData.timeBegin) / state.timeLength) * state.loopTime));
        }
        else if ((state.timeBegin + state.timeLength) >= timeBegin) {
            assignData.timeBegin = timeBegin;
            assignData.timeLength = safeAdd(state.timeLength, safeSubtract(state.timeBegin, assignData.timeBegin));
            if (assignData.timeLength === 0) {
                assignData.settime = assignData.timeBegin;
            }
            else {
                assignData.settime = state.settime;
            }
            assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
            parameter.coefficient = assignData.timeLength / assignData.loopTime;
            assignData.starttimestamp =
                (Date.now() - ((safeSubtract(assignData.settime, assignData.timeBegin) / assignData.timeLength) * assignData.loopTime));
        }
    }
    return assign({}, state, assignData);
});
reducer.case(setTimeLength, function (state, timeLength) {
    safeCheck(timeLength);
    var assignData = {};
    var movesbaselength = state.movesbase.length;
    if (timeLength >= 0) {
        if (movesbaselength > 0) {
            if (timeLength >= state.trailing) {
                var lastArrivaltime = state.movesbase.reduce(function (acc, cur) { return Math.max(acc, cur.arrivaltime); }, state.timeBegin);
                if (safeSubtract(safeAdd(state.timeBegin, timeLength), state.trailing) >= lastArrivaltime) {
                    assignData.timeLength = timeLength;
                    if (assignData.timeLength === 0) {
                        assignData.settime = state.timeBegin;
                    }
                    else {
                        assignData.settime = state.settime;
                    }
                    assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
                    parameter.coefficient = assignData.timeLength / assignData.loopTime;
                    assignData.starttimestamp =
                        (Date.now() - ((safeSubtract(assignData.settime, state.timeBegin) / assignData.timeLength) * assignData.loopTime));
                }
            }
        }
        else {
            assignData.timeLength = timeLength;
            if (assignData.timeLength === 0) {
                assignData.settime = state.timeBegin;
            }
            else {
                assignData.settime = state.settime;
            }
            assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
            parameter.coefficient = assignData.timeLength / assignData.loopTime;
            assignData.starttimestamp =
                (Date.now() - ((safeSubtract(assignData.settime, state.timeBegin) / assignData.timeLength) * assignData.loopTime));
        }
    }
    return assign({}, state, assignData);
});
reducer.case(addMovesBaseData, function (state, movesbase) {
    var movesbaseidxArray = movesbase.map(function (x) { return x.movesbaseidx; });
    var analyzeData = analyzeMovesBase(state, movesbase, true);
    if (state.movesbase.length === 0) { //初回？
        return setMovesBaseFunc(state, analyzeData);
    }
    var assignData = {};
    assignData.loopEndPause = false;
    assignData.movesbase = __spreadArray([], state.movesbase);
    for (var i = 0, lengthi = movesbaseidxArray.length; i < lengthi; i = (i + 1) | 0) {
        var movesbaseidx = movesbaseidxArray[i];
        if (movesbaseidx !== undefined && movesbaseidx < state.movesbase.length) {
            assignData.movesbase[movesbaseidx] = analyzeData.movesbase[i];
            assignData.movesbase[movesbaseidx].movesbaseidx = movesbaseidx;
        }
        else {
            var addidx = assignData.movesbase.length;
            assignData.movesbase.push(analyzeData.movesbase[i]);
            assignData.movesbase[addidx].movesbaseidx = addidx;
        }
    }
    var startState = {};
    if (analyzeData.timeBegin < state.timeBegin) {
        startState.timeBegin = analyzeData.timeBegin;
    }
    else {
        startState.timeBegin = state.timeBegin;
    }
    var analyzeEndTime = safeAdd(analyzeData.timeBegin, analyzeData.timeLength);
    var stateEndTime = safeAdd(state.timeBegin, state.timeLength);
    if (analyzeEndTime > stateEndTime) {
        startState.timeLength = safeSubtract(analyzeEndTime, startState.timeBegin);
    }
    else {
        startState.timeLength = safeSubtract(stateEndTime, startState.timeBegin);
    }
    if (startState.timeBegin !== state.timeBegin || startState.timeLength !== state.timeLength) {
        startState.loopTime = calcLoopTime(startState.timeLength, state.secperhour);
        parameter.coefficient = startState.timeLength / startState.loopTime;
        startState.starttimestamp =
            (Date.now() - ((safeSubtract(state.settime, startState.timeBegin) / startState.timeLength) * startState.loopTime));
        return assign({}, state, startState, assignData);
    }
    return assign({}, state, assignData);
});
reducer.default(function (state) { return state; });
export default reducer.build();
//# sourceMappingURL=index.js.map