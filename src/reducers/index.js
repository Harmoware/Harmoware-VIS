// @flow

import * as types from '../constants/action-types';
import { analyzeMovesBase, analyzeDepotsBase, analyzelinemapData,
  getMoveObjects, getDepots, calcLoopTime } from '../library';
import type { BasedState as State, AnalyzedBaseData, ActionTypes } from '../types';

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
};

export default (state: State = initialState, action: ActionTypes) => {
  switch (action.type) {
    case types.SETVIEWPORT:
      return (() => {
        const viewport = Object.assign({}, state.viewport, action.viewport);
        return Object.assign({}, state, {
          viewport
        });
      })();
    case types.SETLIGHTSETTINGS:
      return (() => {
        const lightSettings = Object.assign({}, state.lightSettings, action.lightSettings);
        return Object.assign({}, state, {
          lightSettings
        });
      })();
    case types.ADDMINUTES:
      return (() => {
        let settime = state.settime + (action.min * 60);
        if (settime <= (0 - state.leading)) {
          settime = (0 - state.leading);
        }
        const starttimestamp = Date.now() - ((settime / state.timeLength) * state.loopTime);
        return Object.assign({}, state, {
          settime, starttimestamp
        });
      })();
    case types.SETTIMESTAMP:
      return (() => {
        const latestProps = action.props;
        const starttimestamp = (Date.now() + calcLoopTime(state.leading, state.secperhour));
        const setProps = { ...latestProps, starttimestamp };
        const depotsData = getDepots(setProps);
        return Object.assign({}, state, {
          starttimestamp, depotsData
        });
      })();
    case types.SETTIME:
      return (() => {
        const settime = action.time;
        const starttimestamp = Date.now() - ((settime / state.timeLength) * state.loopTime);
        return Object.assign({}, state, {
          settime, starttimestamp
        });
      })();
    case types.INCREASETIME:
      return (() => {
        const latestProps = action.props;
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
      })();
    case types.DECREASETIME:
      return (() => {
        const latestProps = action.props;
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
      })();
    case types.SETLEADING:
      return (() => {
        const leading = action.leading;
        return Object.assign({}, state, {
          leading
        });
      })();
    case types.SETTRAILING:
      return (() => {
        const trailing = action.trailing;
        return Object.assign({}, state, {
          trailing
        });
      })();
    case types.SETFRAMETIMESTAMP:
      return (() => {
        const latestProps = action.props;
        const beforeFrameTimestamp = Date.now();
        const setProps = { ...latestProps, beforeFrameTimestamp };
        const movedData = getMoveObjects(setProps);
        const depotsData = getDepots(setProps);
        return Object.assign({}, state, {
          beforeFrameTimestamp, movedData, depotsData
        });
      })();
    case types.SETMOVESBASE:
      return (() => {
        const analyzeData: AnalyzedBaseData = analyzeMovesBase(state.nonmapView, action.base);
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
      })();
    case types.SETDEPOTSBASE:
      return (() => {
        const depotsBaseOriginal = JSON.stringify(action.depotsBase);
        const depotsBase = analyzeDepotsBase(state.nonmapView, action.depotsBase);
        return Object.assign({}, state, {
          depotsBase, depotsBaseOriginal
        });
      })();
    case types.SETANIMATEPAUSE:
      return (() => {
        const animatePause = action.pause;
        const starttimestamp = (Date.now() - ((state.settime / state.timeLength) * state.loopTime));
        return Object.assign({}, state, {
          animatePause, starttimestamp
        });
      })();
    case types.SETANIMATEREVERSE:
      return (() => {
        const animateReverse = action.reverse;
        return Object.assign({}, state, {
          animateReverse
        });
      })();
    case types.SETSECPERHOUR:
      return (() => {
        const secperhour = action.secperhour;
        const loopTime = calcLoopTime(state.timeLength, secperhour);
        let starttimestamp = state.starttimestamp;
        if (!state.animatePause) {
          starttimestamp = (Date.now() - ((state.settime / state.timeLength) * loopTime));
        }
        return Object.assign({}, state, {
          secperhour, loopTime, starttimestamp
        });
      })();
    case types.SETCLICKED:
      return (() => {
        const clickedObject = action.clickedObject;
        return Object.assign({}, state, {
          clickedObject
        });
      })();
    case types.SETROUTEPATHS:
      return (() => {
        const routePaths = action.paths;
        return Object.assign({}, state, {
          routePaths
        });
      })();
    case types.SETDEFAULTZOOM:
      return (() => {
        const defaultZoom = action.defaultZoom;
        return Object.assign({}, state, {
          defaultZoom
        });
      })();
    case types.SETDEFAULTPITCH:
      return (() => {
        const defaultPitch = action.defaultPitch;
        return Object.assign({}, state, {
          defaultPitch
        });
      })();
    case types.SETMOVESOPTIONFUNC:
      return (() => {
        const getMovesOptionFunc = action.func;
        return Object.assign({}, state, {
          getMovesOptionFunc
        });
      })();
    case types.SETDEPOTSOPTIONFUNC:
      return (() => {
        const getDepotsOptionFunc = action.func;
        return Object.assign({}, state, {
          getDepotsOptionFunc
        });
      })();
    case types.SETNONMAPVIEW:
      return (() => {
        const nonmapView = action.nonmapView;
        return Object.assign({}, state, {
          nonmapView
        });
      })();
    case types.SETLINEMAPDATA:
      return (() => {
        const linemapDataOriginal = JSON.stringify(action.linemapData);
        const linemapData =
        analyzelinemapData(state.nonmapView, action.linemapData);
        return Object.assign({}, state, {
          linemapData, linemapDataOriginal
        });
      })();
    default:
      return state;
  }
};
