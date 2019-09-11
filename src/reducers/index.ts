import { analyzeMovesBase, getMoveObjects, getDepots, calcLoopTime } from '../library';
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { BasedState } from '../types';
import { addMinutes, setViewport, setLightSettings, setTimeStamp, 
  setTime, increaseTime, decreaseTime, setLeading, setTrailing, setFrameTimestamp, setMovesBase, setDepotsBase, 
  setAnimatePause, setAnimateReverse, setSecPerHour, setClicked, 
  setRoutePaths, setDefaultPitch, setMovesOptionFunc, setDepotsOptionFunc, 
  setLinemapData, setLoading, setInputFilename, updateMovesBase } from '../actions';

const initialState: BasedState = {
  viewport: {
    longitude: 136.906428,
    latitude: 35.181453,
    zoom: 11.1,
    maxZoom: 16,
    minZoom: 5,
    pitch: 30,
    bearing: 0,
    width: 500, // 共通
    height: 500, // 共通
  },
  lightSettings: {
    lightsPosition: [0, 0, 8000, 0, 0, 8000],
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

const reducer = reducerWithInitialState<BasedState>(initialState);

reducer.case(addMinutes, (state, min) => {
  let settime = state.settime + (min * 60);
  if (settime <= (state.timeBegin - state.leading)) {
    settime = (state.timeBegin - state.leading);
  }
  const starttimestamp = Date.now() - (((settime - state.timeBegin) / state.timeLength) * state.loopTime);
  return Object.assign({}, state, {
    settime, starttimestamp
  });
});

reducer.case(setViewport, (state, view) => {
  const viewport = Object.assign({}, state.viewport, view);
  return Object.assign({}, state, {
    viewport
  });
});

reducer.case(setLightSettings, (state, light) => {
  const lightSettings = Object.assign({}, state.lightSettings, light);
  return Object.assign({}, state, {
    lightSettings
  });
});

reducer.case(setTimeStamp, (state, props) => {
  const starttimestamp = (Date.now() + calcLoopTime(state.leading, state.secperhour));
  return Object.assign({}, state, {
    starttimestamp
  });
});

reducer.case(setTime, (state, time) => {
  const settime = time;
  const starttimestamp = Date.now() - (((settime - state.timeBegin) / state.timeLength) * state.loopTime);
  return Object.assign({}, state, {
    settime, starttimestamp
  });
});

reducer.case(increaseTime, (state, props) => {
  const latestProps = props;
  const now = Date.now();
  if ((now - state.starttimestamp) > state.loopTime) {
    console.log('settime overlap.');
    const settime = (state.timeBegin - state.leading);
    const starttimestamp = now - (((settime - state.timeBegin) / state.timeLength) * state.loopTime);
    const setProps = { ...latestProps, settime, starttimestamp };
    const movedData = getMoveObjects(setProps);
    const depotsData = getDepots(setProps);
    return Object.assign({}, state, {
      settime, starttimestamp, movedData, depotsData
    });
  }
  const beforeSettime = state.settime;
  const settime = ((((now - state.starttimestamp) % state.loopTime) /
    state.loopTime) * state.timeLength) + state.timeBegin;
  if (beforeSettime > settime) {
    console.log(`${beforeSettime} ${settime}`);
  }
  const beforeFrameTimestamp = now;
  const setProps = { ...latestProps, settime, beforeFrameTimestamp };
  const movedData = getMoveObjects(setProps);
  const depotsData = getDepots(setProps);
  return Object.assign({}, state, {
    settime, beforeFrameTimestamp, movedData, depotsData
  });
});

reducer.case(decreaseTime, (state, props) => {
  const latestProps = props;
  const now = Date.now();
  const beforeFrameElapsed = now - state.beforeFrameTimestamp;
  let starttimestamp = state.starttimestamp + (beforeFrameElapsed * 2);
  let settime = ((((now - state.starttimestamp) % state.loopTime) /
    state.loopTime) * state.timeLength) + state.timeBegin;
  if (settime <= (state.timeBegin - state.leading)) {
    settime = state.timeBegin + state.timeLength;
    starttimestamp = now - (((settime - state.timeBegin) / state.timeLength) * state.loopTime);
  }
  const beforeFrameTimestamp = now;
  const setProps = { ...latestProps, settime, starttimestamp, beforeFrameTimestamp };
  const movedData = getMoveObjects(setProps);
  const depotsData = getDepots(setProps);
  return Object.assign({}, state, {
    settime, starttimestamp, beforeFrameTimestamp, movedData, depotsData
  });
});

reducer.case(setLeading, (state, leading) => {
  return Object.assign({}, state, {
    leading
  });
});

reducer.case(setTrailing, (state, trailing) => {
  return Object.assign({}, state, {
    trailing
  });
});

reducer.case(setFrameTimestamp, (state, props) => {
  const latestProps = props;
  const beforeFrameTimestamp = Date.now();
  const setProps = { ...latestProps, beforeFrameTimestamp };
  const movedData = getMoveObjects(setProps);
  const depotsData = getDepots(setProps);
  return Object.assign({}, state, {
    beforeFrameTimestamp, movedData, depotsData
  });
});

reducer.case(setMovesBase, (state, base) => {
  const analyzeData = analyzeMovesBase(base);
  const { timeBegin, bounds, movesbase } = analyzeData;
  const settime = timeBegin - state.leading;
  let { timeLength } = analyzeData;
  if (timeLength > 0) {
    timeLength += state.trailing;
  }
  const loopTime = calcLoopTime(timeLength, state.secperhour);
  // starttimestampはDate.now()の値でいいが、スタート時はleading分の余白時間を付加する
  const starttimestamp = Date.now() + calcLoopTime(state.leading, state.secperhour);
  const viewport = Object.assign({}, state.viewport,
    analyzeData.viewport,
    { zoom: state.defaultZoom, pitch: state.defaultPitch });
  let depotsBase = state.depotsBase;
  const setState = { ...state, bounds };
  const depotsData = getDepots(setState);
  let linemapData = state.linemapData;
  const lightSettings = Object.assign({}, state.lightSettings,
    {lightsPosition: [
      bounds.westlongitiude, bounds.northlatitude, 8000,
      bounds.eastlongitiude, bounds.southlatitude, 8000]});
  return Object.assign({}, state, {
    timeBegin,
    timeLength,
    bounds,
    lightSettings,
    movesbase,
    viewport,
    settime,
    loopTime,
    starttimestamp,
    depotsBase,
    depotsData,
    linemapData
  });
});

reducer.case(setDepotsBase, (state, depots) => {
  const depotsBase = depots;
  const setState = { ...state, depotsBase };
  const depotsData = getDepots(setState);
  return Object.assign({}, state, {
    depotsBase, depotsData
  });
});

reducer.case(setAnimatePause, (state, pause) => {
  const animatePause = pause;
  const starttimestamp = (Date.now() - (((state.settime - state.timeBegin) / state.timeLength) * state.loopTime));
  return Object.assign({}, state, {
    animatePause, starttimestamp
  });
});

reducer.case(setAnimateReverse, (state, reverse) => {
  return Object.assign({}, state, {
    animateReverse: reverse
  });
});

reducer.case(setSecPerHour, (state, secperhour) => {
  const loopTime = calcLoopTime(state.timeLength, secperhour);
  let starttimestamp = state.starttimestamp;
  if (!state.animatePause) {
    starttimestamp = (Date.now() - (((state.settime - state.timeBegin) / state.timeLength) * loopTime));
  }
  return Object.assign({}, state, {
    secperhour, loopTime, starttimestamp
  });
});

reducer.case(setClicked, (state, clickedObject) => {
  return Object.assign({}, state, {
    clickedObject
  });
});

reducer.case(setRoutePaths, (state, routePaths) => {
  return Object.assign({}, state, {
    routePaths
  });
});

reducer.case(setDefaultPitch, (state, defaultPitch) => {
  return Object.assign({}, state, {
    defaultPitch
  });
});

reducer.case(setMovesOptionFunc, (state, getMovesOptionFunc) => {
  return Object.assign({}, state, {
    getMovesOptionFunc
  });
});

reducer.case(setDepotsOptionFunc, (state, getDepotsOptionFunc) => {
  return Object.assign({}, state, {
    getDepotsOptionFunc
  });
});

reducer.case(setLinemapData, (state, mapData) => {
  const linemapData = mapData;
  return Object.assign({}, state, {
    linemapData
  });
});

reducer.case(setLoading, (state, loading) => {
  return Object.assign({}, state, {
    loading
  });
});

reducer.case(setInputFilename, (state, fileName) => {
  const inputFileName = Object.assign({}, state.inputFileName, fileName);
  return Object.assign({}, state, {
    inputFileName
  });
});

reducer.case(updateMovesBase, (state, base) => {
  const analyzeData = analyzeMovesBase(base);
  const { timeBegin, bounds, movesbase } = analyzeData;
  let { timeLength } = analyzeData;
  if(state.movesbase.length === 0 || timeLength === 0){ //初回？
    const settime = timeBegin - state.leading;
    if (timeLength > 0) {
      timeLength += state.trailing;
    }
    const loopTime = calcLoopTime(timeLength, state.secperhour);
    // starttimestampはDate.now()の値でいいが、スタート時はleading分の余白時間を付加する
    const starttimestamp = Date.now() + calcLoopTime(state.leading, state.secperhour);
    const viewport = Object.assign({}, state.viewport,
      analyzeData.viewport,
      { zoom: state.defaultZoom, pitch: state.defaultPitch });
    let depotsBase = state.depotsBase;
    let linemapData = state.linemapData;
    const setState = { ...state, bounds };
    const depotsData = getDepots(setState);
    return Object.assign({}, state, {
      timeBegin, timeLength, bounds,
      movesbase, viewport, settime,
      loopTime, starttimestamp,
      depotsBase, depotsData, linemapData
    });
  }
  let startState = {};
  if (timeLength > 0) {
    timeLength += state.trailing;
  }
  if(timeBegin !== state.timeBegin || timeLength !== state.timeLength){
    const loopTime = calcLoopTime(timeLength, state.secperhour);
    const starttimestamp = (Date.now() - (((state.settime - timeBegin) / timeLength) * loopTime));
    startState = Object.assign({}, startState, {
      timeBegin, timeLength, loopTime, starttimestamp
    });
  }
  return Object.assign({}, state, startState, { movesbase });
});

reducer.default((state) => state);

export default reducer.build();
