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
  setLoading,
} from './actions';

import MovesInput from './components/moves-input';
import DepotsInput from './components/depots-input';
import LinemapInput from './components/linemap-input';
import LoadingIcon from './components/loading-icon';
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
import LineMapLayer from './layers/line-map-layer';
import * as settings from './constants/settings';
import Container from './containers';
import reducer from './reducers';
import { connectToHarmowareVis, getContainerProp, getCombinedReducer, applyDefaultStyle } from './library';
import styles, { buttonClass, controllerClass, footerClass, headerClass } from './styles';

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
  setLoading,
};

export {
  // actions
  Actions,
  // components
  MovesInput,
  DepotsInput,
  LinemapInput,
  LoadingIcon,
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
  LineMapLayer,
  // library
  getContainerProp,
  connectToHarmowareVis,
  getCombinedReducer,
  applyDefaultStyle,
  // reducer
  reducer,
  // styles
  styles,
  buttonClass,
  controllerClass,
  footerClass,
  headerClass
};
