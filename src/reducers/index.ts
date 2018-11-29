import { analyzeMovesBase, analyzeDepotsBase, analyzelinemapData,
  getMoveObjects, getDepots, calcLoopTime } from '../library';
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { BasedState as State } from '../types';
import { addMinutes, setViewport, setLightSettings, setTimeStamp, 
  setTime, increaseTime, decreaseTime, setLeading, setTrailing, setFrameTimestamp, setMovesBase, setDepotsBase, 
  setAnimatePause, setAnimateReverse, setSecPerHour, setClicked, 
  setRoutePaths, setDefaultPitch, setMovesOptionFunc, setDepotsOptionFunc, 
  setNonmapView, setLinemapData, setLoading, setInputFilename, updateMovesBase } from '../actions';

const initialState: State = {
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
    lookAt: [0, 0, 0], // nonmap
    distance: 200, // nonmap
    rotationX: 60, // nonmap
    rotationY: 0, // nonmap
    fov: 50, // nonmap
    minDistance: 0, // nonmap
    maxDistance: 500, // nonmap
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

const reducer = reducerWithInitialState<State>(initialState);

reducer.case(addMinutes, (state, min) => {
  let settime = state.settime + (min * 60);
  if (settime <= (0 - state.leading)) {
    settime = (0 - state.leading);
  }
  const starttimestamp = Date.now() - ((settime / state.timeLength) * state.loopTime);
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
  const latestProps = props;
  const starttimestamp = (Date.now() + calcLoopTime(state.leading, state.secperhour));
  const setProps = { ...latestProps, starttimestamp };
  const depotsData = getDepots(setProps);
  return Object.assign({}, state, {
    starttimestamp, depotsData
  });
});

reducer.case(setTime, (state, time) => {
  const settime = time;
  const starttimestamp = Date.now() - ((settime / state.timeLength) * state.loopTime);
  return Object.assign({}, state, {
    settime, starttimestamp
  });
});

reducer.case(increaseTime, (state, props) => {
  const latestProps = props;
  const now = Date.now();
  if ((now - state.starttimestamp) > state.loopTime) {
    console.log('settime overlap.');
    const settime = (0 - state.leading);
    const starttimestamp = now - ((settime / state.timeLength) * state.loopTime);
    const setProps = { ...latestProps, settime, starttimestamp };
    const movedData = getMoveObjects(setProps);
    const depotsData = getDepots(setProps);
    return Object.assign({}, state, {
      settime, starttimestamp, movedData, depotsData
    });
  }
  const beforeSettime = state.settime;
  const settime = (((now - state.starttimestamp) % state.loopTime) /
    state.loopTime) * state.timeLength;
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
  let settime = (((now - state.starttimestamp) % state.loopTime) /
    state.loopTime) * state.timeLength;
  if (settime <= (0 - state.leading)) {
    settime = state.timeLength;
    starttimestamp = now - ((settime / state.timeLength) * state.loopTime);
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
  const analyzeData = analyzeMovesBase(state.nonmapView, base);
  const settime = state.leading * -1;
  const { timeBegin, bounds, movesbase } = analyzeData;
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
  if (state.nonmapView && state.depotsBaseOriginal.length > 0) {
    const depotsBaseOriginal = JSON.parse(state.depotsBaseOriginal);
    depotsBase =
      analyzeDepotsBase(state.nonmapView, depotsBaseOriginal);
  }
  let linemapData = state.linemapData;
  if (state.nonmapView && state.linemapDataOriginal.length > 0) {
    const linemapDataOriginal = JSON.parse(state.linemapDataOriginal);
    linemapData =
    analyzelinemapData(state.nonmapView, linemapDataOriginal);
  }
  return Object.assign({}, state, {
    timeBegin,
    timeLength,
    bounds,
    movesbase,
    viewport,
    settime,
    loopTime,
    starttimestamp,
    depotsBase,
    linemapData
  });
});

reducer.case(setDepotsBase, (state, depots) => {
  const depotsBaseOriginal = JSON.stringify(depots);
  const depotsBase = analyzeDepotsBase(state.nonmapView, depots);
  return Object.assign({}, state, {
    depotsBase, depotsBaseOriginal
  });
});

reducer.case(setAnimatePause, (state, pause) => {
  const animatePause = pause;
  const starttimestamp = (Date.now() - ((state.settime / state.timeLength) * state.loopTime));
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
    starttimestamp = (Date.now() - ((state.settime / state.timeLength) * loopTime));
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

reducer.case(setNonmapView, (state, nonmapView) => {
  return Object.assign({}, state, {
    nonmapView
  });
});

reducer.case(setLinemapData, (state, mapData) => {
  const linemapDataOriginal = JSON.stringify(mapData);
  const linemapData = 
  analyzelinemapData(state.nonmapView, mapData);
  return Object.assign({}, state, {
    linemapData, linemapDataOriginal
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
  const analyzeData = analyzeMovesBase(false, base);
  const { timeBegin, bounds, movesbase } = analyzeData;
  let { timeLength } = analyzeData;
  if(state.movesbase.length === 0 || timeLength === 0){ //初回？
    const settime = state.leading * -1;
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
    return Object.assign({}, state, {
      timeBegin, timeLength, bounds,
      movesbase, viewport, settime,
      loopTime, starttimestamp,
      depotsBase, linemapData
    });
  }
  let startState = {};
  if (timeLength > 0) {
    timeLength += state.trailing;
  }
  if(timeBegin !== state.timeBegin || timeLength !== state.timeLength){
    const loopTime = calcLoopTime(timeLength, state.secperhour);
    const starttimestamp = (Date.now() - ((state.settime / timeLength) * loopTime));
    startState = Object.assign({}, startState, {
      timeBegin, timeLength, loopTime, starttimestamp
    });
  }
  return Object.assign({}, state, startState, { movesbase });
});

reducer.default((state, ation) => state);

export default reducer.build();
