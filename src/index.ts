

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

import { BasedState, BasedProps, Bounds, ClickedObject, Depotsbase, DepotsData, LightSettings,
  MovedData, Movesbase, RoutePaths, Viewport, LineMapData, ActionsInterface, InputEvent } from './types';

import MovesInput from './components/moves-input';
import DepotsInput from './components/depots-input';
import LinemapInput from './components/linemap-input';
import LoadingIcon from './components/loading-icon';
import AddMinutesButton from './components/addminutes-button';
import ElapsedTimeRange from './components/elapsedtime-range';
import ElapsedTimeValue from './components/elapsedtime-value';
import PlayButton from './components/play-button';
import PauseButton from './components/pause-button';
import ReverseButton from './components/reverse-button';
import ForwardButton from './components/forward-button';
import SimulationDateTime from './components/simulation-date-time';
import SpeedRange from './components/speed-range';
import SpeedValue from './components/speed-value';
import HarmoVisLayers from './components/harmovislayers';
import HarmoVisNonMapLayers from './components/harmovis-nonmap-layers';
import NavigationButton from './components/navigation-button';
import MovesLayer from './layers/moves-layer';
import MovesNonmapLayer from './layers/moves-nonmap-layer';
import DepotsLayer from './layers/depots-layer';
import FixedPointLayer from './layers/fixed-point-layer';
import LineMapLayer from './layers/line-map-layer';
import * as settings from './constants/settings';
import Container from './containers';
import reducer from './reducers';
import { connectToHarmowareVis, getContainerProp, getCombinedReducer } from './library';

const Actions: ActionsInterface = {
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
  ActionsInterface,
  // state
  BasedState,
  BasedProps,
  Bounds,
  ClickedObject,
  Depotsbase,
  DepotsData,
  LightSettings,
  MovedData,
  Movesbase,
  RoutePaths,
  Viewport,
  LineMapData,
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
  ElapsedTimeValue,
  SpeedRange,
  SpeedValue,
  SimulationDateTime,
  HarmoVisLayers,
  HarmoVisNonMapLayers,
  NavigationButton,
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
  // reducer
  reducer,
  // InputEvent
  InputEvent
};



