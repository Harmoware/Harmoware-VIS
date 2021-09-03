import { analyzeMovesBase, getMoveObjects, getDepots, safeCheck, safeAdd, safeSubtract } from '../library';
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { addMinutes, setViewport, setDefaultViewport, setTimeStamp, setTime, increaseTime, decreaseTime, setLeading, setTrailing, setFrameTimestamp, setMovesBase, setDepotsBase, setAnimatePause, setAnimateReverse, setSecPerHour, setMultiplySpeed, setClicked, setRoutePaths, setDefaultPitch, setMovesOptionFunc, setDepotsOptionFunc, setLinemapData, setLoading, setInputFilename, updateMovesBase, setNoLoop, setInitialViewChange, setIconGradationChange, setTimeBegin, setTimeLength, addMovesBaseData } from '../actions';
const initialState = {
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
        transitionDuration: 0,
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
    multiplySpeed: 20,
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
const parameter = {
    coefficient: 0
};
const calcLoopTime = // LoopTime とは１ループにかける時間（ミリ秒）
 (timeLength, secperhour) => (timeLength / 3.6) * secperhour;
const reducer = reducerWithInitialState(initialState);
const assign = Object.assign;
reducer.case(addMinutes, (state, min) => {
    const assignData = {};
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
reducer.case(setViewport, (state, view) => {
    const viewport = assign({}, state.viewport, view);
    return assign({}, state, {
        viewport
    });
});
reducer.case(setDefaultViewport, (state, defViewport = {}) => {
    const { defaultZoom, defaultPitch } = defViewport;
    const zoom = defaultZoom === undefined ? state.defaultZoom : defaultZoom;
    const pitch = defaultPitch === undefined ? state.defaultPitch : defaultPitch;
    const viewport = assign({}, state.viewport, { bearing: 0, zoom, pitch });
    return assign({}, state, {
        viewport, defaultZoom: zoom, defaultPitch: pitch
    });
});
reducer.case(setTimeStamp, (state, props) => {
    const starttimestamp = (Date.now() + calcLoopTime(state.leading, state.secperhour));
    return assign({}, state, {
        starttimestamp, loopEndPause: false
    });
});
reducer.case(setTime, (state, settime) => {
    const starttimestamp = Date.now() - ((safeSubtract(settime, state.timeBegin) / state.timeLength) * state.loopTime);
    return assign({}, state, {
        settime, starttimestamp, loopEndPause: false
    });
});
reducer.case(increaseTime, (state, props) => {
    const assignData = {};
    const now = Date.now();
    const difference = now - state.starttimestamp;
    if (state.noLoop) {
        const margins = calcLoopTime(state.leading + state.trailing, state.secperhour);
        if (difference >= (state.loopTime - margins)) {
            return assign({}, state, { loopEndPause: true });
        }
    }
    if (difference >= state.loopTime) {
        console.log('settime overlap.');
        assignData.settime = safeSubtract(state.timeBegin, state.leading);
        assignData.starttimestamp = now - ((safeSubtract(assignData.settime, state.timeBegin) / state.timeLength) * state.loopTime);
        const setProps = Object.assign(Object.assign({}, props), assignData);
        const movedData = getMoveObjects(setProps);
        if (movedData) {
            assignData.movedData = movedData;
            if (assignData.movedData.length === 0) {
                assignData.clickedObject = null;
                assignData.routePaths = [];
            }
        }
        if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
            const depotsData = getDepots(setProps);
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
        console.log(`${state.settime} ${assignData.settime}`);
    }
    assignData.beforeFrameTimestamp = now;
    const setProps = Object.assign(Object.assign({}, props), assignData);
    const movedData = getMoveObjects(setProps);
    if (movedData) {
        assignData.movedData = movedData;
        if (assignData.movedData.length === 0) {
            assignData.clickedObject = null;
            assignData.routePaths = [];
        }
    }
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        const depotsData = getDepots(setProps);
        if (depotsData) {
            assignData.depotsData = depotsData;
        }
    }
    return assign({}, state, assignData);
});
reducer.case(decreaseTime, (state, props) => {
    const now = Date.now();
    const beforeFrameElapsed = now - state.beforeFrameTimestamp;
    const assignData = {};
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
    const setProps = Object.assign(Object.assign({}, props), assignData);
    const movedData = getMoveObjects(setProps);
    if (movedData) {
        assignData.movedData = movedData;
        if (assignData.movedData.length === 0) {
            assignData.clickedObject = null;
            assignData.routePaths = [];
        }
    }
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        const depotsData = getDepots(setProps);
        if (depotsData) {
            assignData.depotsData = depotsData;
        }
    }
    return assign({}, state, assignData);
});
reducer.case(setLeading, (state, leading) => {
    safeCheck(leading);
    return assign({}, state, {
        leading
    });
});
reducer.case(setTrailing, (state, trailing) => {
    safeCheck(trailing);
    return assign({}, state, {
        trailing
    });
});
reducer.case(setFrameTimestamp, (state, props) => {
    const assignData = {};
    const now = Date.now();
    assignData.beforeFrameTimestamp = now;
    assignData.starttimestamp = now - ((safeSubtract(state.settime, state.timeBegin) / state.timeLength) * state.loopTime);
    const setProps = Object.assign(Object.assign({}, props), assignData);
    const movedData = getMoveObjects(setProps);
    if (movedData) {
        assignData.movedData = movedData;
        if (assignData.movedData.length === 0) {
            assignData.clickedObject = null;
            assignData.routePaths = [];
        }
    }
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        const depotsData = getDepots(setProps);
        if (depotsData) {
            assignData.depotsData = depotsData;
        }
    }
    return assign({}, state, assignData);
});
const setMovesBaseFunc = (state, analyzeData) => {
    const assignData = {};
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
        const depotsData = getDepots(Object.assign(Object.assign({}, state), assignData));
        if (depotsData) {
            assignData.depotsData = depotsData;
        }
    }
    assignData.movesbase = analyzeData.movesbase;
    assignData.movedData = [];
    console.log('setMovesBaseFunc');
    return assign({}, state, assignData);
};
reducer.case(setMovesBase, (state, base) => {
    const analyzeData = analyzeMovesBase(state, base, false);
    return setMovesBaseFunc(state, analyzeData);
});
reducer.case(setDepotsBase, (state, depotsBase) => {
    const assignData = {};
    assignData.depotsBase = depotsBase;
    if (state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc) {
        const depotsData = getDepots(Object.assign(Object.assign({}, state), { depotsBase }));
        if (depotsData) {
            assignData.depotsData = depotsData;
        }
    }
    return assign({}, state, assignData);
});
reducer.case(setAnimatePause, (state, animatePause) => {
    const assignData = {};
    assignData.animatePause = animatePause;
    assignData.loopEndPause = false;
    assignData.starttimestamp = (Date.now() - ((safeSubtract(state.settime, state.timeBegin) / state.timeLength) * state.loopTime));
    return assign({}, state, assignData);
});
reducer.case(setAnimateReverse, (state, animateReverse) => {
    return assign({}, state, {
        animateReverse, loopEndPause: false
    });
});
reducer.case(setSecPerHour, (state, secperhour) => {
    if (secperhour === 0) {
        console.log('secperhour set zero!');
        return state;
    }
    const assignData = {};
    assignData.loopEndPause = false;
    assignData.secperhour = secperhour;
    assignData.multiplySpeed = 3600 / secperhour;
    assignData.loopTime = calcLoopTime(state.timeLength, secperhour);
    parameter.coefficient = state.timeLength / assignData.loopTime;
    if (!state.animatePause) {
        assignData.starttimestamp =
            (Date.now() - ((safeSubtract(state.settime, state.timeBegin) / state.timeLength) * assignData.loopTime));
    }
    return assign({}, state, assignData);
});
reducer.case(setMultiplySpeed, (state, multiplySpeed) => {
    if (multiplySpeed === 0) {
        console.log('secperhour set zero!');
        return state;
    }
    const assignData = {};
    assignData.loopEndPause = false;
    assignData.multiplySpeed = multiplySpeed;
    assignData.secperhour = 3600 / multiplySpeed;
    assignData.loopTime = calcLoopTime(state.timeLength, assignData.secperhour);
    parameter.coefficient = state.timeLength / assignData.loopTime;
    if (!state.animatePause) {
        assignData.starttimestamp =
            (Date.now() - ((safeSubtract(state.settime, state.timeBegin) / state.timeLength) * assignData.loopTime));
    }
    return assign({}, state, assignData);
});
reducer.case(setClicked, (state, clickedObject) => {
    return assign({}, state, {
        clickedObject
    });
});
reducer.case(setRoutePaths, (state, routePaths) => {
    return assign({}, state, {
        routePaths
    });
});
reducer.case(setDefaultPitch, (state, defaultPitch) => {
    return assign({}, state, {
        defaultPitch
    });
});
reducer.case(setMovesOptionFunc, (state, getMovesOptionFunc) => {
    return assign({}, state, {
        getMovesOptionFunc
    });
});
reducer.case(setDepotsOptionFunc, (state, getDepotsOptionFunc) => {
    return assign({}, state, {
        getDepotsOptionFunc
    });
});
reducer.case(setLinemapData, (state, linemapData) => {
    return assign({}, state, {
        linemapData
    });
});
reducer.case(setLoading, (state, loading) => {
    return assign({}, state, {
        loading
    });
});
reducer.case(setInputFilename, (state, fileName) => {
    const inputFileName = assign({}, state.inputFileName, fileName);
    return assign({}, state, {
        inputFileName
    });
});
reducer.case(updateMovesBase, (state, base) => {
    const analyzeData = analyzeMovesBase(state, base, true);
    if (state.movesbase.length === 0) { //初回？
        return setMovesBaseFunc(state, analyzeData);
    }
    const assignData = {};
    assignData.loopEndPause = false;
    assignData.movesbase = analyzeData.movesbase;
    const startState = {};
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
reducer.case(setNoLoop, (state, noLoop) => {
    return assign({}, state, {
        noLoop, loopEndPause: false
    });
});
reducer.case(setInitialViewChange, (state, initialViewChange) => {
    return assign({}, state, {
        initialViewChange
    });
});
reducer.case(setIconGradationChange, (state, iconGradation) => {
    return assign({}, state, {
        iconGradation
    });
});
reducer.case(setTimeBegin, (state, timeBegin) => {
    safeCheck(timeBegin);
    const assignData = {};
    const movesbaselength = state.movesbase.length;
    if (movesbaselength > 0) {
        const firstDeparturetime = state.movesbase.reduce((acc, cur) => Math.min(acc, cur.departuretime), Number.MAX_SAFE_INTEGER);
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
reducer.case(setTimeLength, (state, timeLength) => {
    safeCheck(timeLength);
    const assignData = {};
    const movesbaselength = state.movesbase.length;
    if (timeLength >= 0) {
        if (movesbaselength > 0) {
            if (timeLength >= state.trailing) {
                const lastArrivaltime = state.movesbase.reduce((acc, cur) => Math.max(acc, cur.arrivaltime), state.timeBegin);
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
reducer.case(addMovesBaseData, (state, movesbase) => {
    const movesbaseidxArray = movesbase.map(x => x.movesbaseidx);
    const analyzeData = analyzeMovesBase(state, movesbase, true);
    if (state.movesbase.length === 0) { //初回？
        return setMovesBaseFunc(state, analyzeData);
    }
    const assignData = {};
    assignData.loopEndPause = false;
    assignData.movesbase = [...state.movesbase];
    for (let i = 0, lengthi = movesbaseidxArray.length; i < lengthi; i = (i + 1) | 0) {
        const movesbaseidx = movesbaseidxArray[i];
        if (movesbaseidx !== undefined && movesbaseidx < state.movesbase.length) {
            assignData.movesbase[movesbaseidx] = analyzeData.movesbase[i];
            assignData.movesbase[movesbaseidx].movesbaseidx = movesbaseidx;
        }
        else {
            const addidx = assignData.movesbase.length;
            assignData.movesbase.push(analyzeData.movesbase[i]);
            assignData.movesbase[addidx].movesbaseidx = addidx;
        }
    }
    const startState = {};
    if (analyzeData.timeBegin < state.timeBegin) {
        startState.timeBegin = analyzeData.timeBegin;
    }
    else {
        startState.timeBegin = state.timeBegin;
    }
    const analyzeEndTime = safeAdd(analyzeData.timeBegin, analyzeData.timeLength);
    const stateEndTime = safeAdd(state.timeBegin, state.timeLength);
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
reducer.default((state) => state);
export default reducer.build();
//# sourceMappingURL=index.js.map