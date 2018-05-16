// @flow

import {
  addMinutes,
  setTime,
  setLeading,
  setTrailing,
  setViewport,
  setLightSettings,
  setMovesBase,
  setDepotsBase,
  setAnimatePause,
  setAnimateReverse,
  setSecPerMin,
  setClicked,
  setRoutePaths,
  setDefaultZoom,
  setDefaultPitch,
  setMovesOptionFunc,
  setDepotsOptionFunc,
  setRainfall,
} from './actions';

import MovesInput from './components/moves-input';
import DepotsInput from './components/depots-input';
import XbandDataInput from './components/xbanddata-input';
import AddMinutesButton from './components/addminutes-button';
import ElapsedTimeRange from './components/elapsedtime-range';
import PlayButton from './components/play-button';
import PauseButton from './components/pause-button';
import ReverseButton from './components/reverse-button';
import ForwardButton from './components/forward-button';
import SimulationDateTime from './components/simulation-date-time';
import SpeedRange from './components/speed-range';
import HarmoVisLayers from './components/harmovislayers';
import MovesLayer from './layers/moves-layer';
import DepotsLayer from './layers/depots-layer';
import CubeGraphLayer from './layers/cubegraph-layer';
import XbandmeshLayer from './layers/xbandmesh-layer';
import * as settings from './constants/settings';
import Container from './containers';
import baseReducer from './reducers';
import { connectToHarmowareVis, getContainerProp } from './library';

const reducer = {
  base: baseReducer
};

const Actions = {
  addMinutes,
  setTime,
  setLeading,
  setTrailing,
  setViewport,
  setLightSettings,
  setMovesBase,
  setDepotsBase,
  setAnimatePause,
  setAnimateReverse,
  setSecPerMin,
  setClicked,
  setRoutePaths,
  setDefaultZoom,
  setDefaultPitch,
  setMovesOptionFunc,
  setDepotsOptionFunc,
  setRainfall,
};

export {
  // actions
  Actions,
  // components
  MovesInput,
  DepotsInput,
  XbandDataInput,
  AddMinutesButton,
  PlayButton,
  PauseButton,
  ForwardButton,
  ReverseButton,
  ElapsedTimeRange,
  SpeedRange,
  SimulationDateTime,
  HarmoVisLayers,
  // constants
  settings,
  // container
  Container,
  // layers
  MovesLayer,
  DepotsLayer,
  CubeGraphLayer,
  XbandmeshLayer,
  // library
  getContainerProp,
  connectToHarmowareVis,
  // reducer
  reducer
};
