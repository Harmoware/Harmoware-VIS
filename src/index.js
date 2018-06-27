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
  setSecPerHour,
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
import LinemapInput from './components/linemap-input';
import AddMinutesButton from './components/addminutes-button';
import ElapsedTimeRange from './components/elapsedtime-range';
import PlayButton from './components/play-button';
import PauseButton from './components/pause-button';
import ReverseButton from './components/reverse-button';
import ForwardButton from './components/forward-button';
import SimulationDateTime from './components/simulation-date-time';
import SpeedRange from './components/speed-range';
import HarmoVisLayers from './components/harmovislayers';
import HarmoVisNonMapLayers from './components/harmovis-nonmap-layers';
import MovesLayer from './layers/moves-layer';
import MovesNonmapLayer from './layers/moves-nonmap-layer';
import DepotsLayer from './layers/depots-layer';
import FixedPointLayer from './layers/fixed-point-layer';
import CubeGraphLayer from './layers/cubegraph-layer';
import XbandmeshLayer from './layers/xbandmesh-layer';
import LineMapLayer from './layers/line-map-layer';
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
  setSecPerHour,
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
  LinemapInput,
  AddMinutesButton,
  PlayButton,
  PauseButton,
  ForwardButton,
  ReverseButton,
  ElapsedTimeRange,
  SpeedRange,
  SimulationDateTime,
  HarmoVisLayers,
  HarmoVisNonMapLayers,
  // constants
  settings,
  // container
  Container,
  // layers
  MovesLayer,
  MovesNonmapLayer,
  DepotsLayer,
  FixedPointLayer,
  CubeGraphLayer,
  XbandmeshLayer,
  LineMapLayer,
  // library
  getContainerProp,
  connectToHarmowareVis,
  // reducer
  reducer
};
