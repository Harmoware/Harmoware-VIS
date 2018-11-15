/// <reference types="typescript" />

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
declare const Actions: {
    addMinutes: (min: number) => {
        type: string;
        min: number;
    };
    setTime: (time: number) => {
        type: string;
        time: number;
    };
    setLeading: (leading: number) => {
        type: string;
        leading: number;
    };
    setTrailing: (trailing: number) => {
        type: string;
        trailing: number;
    };
    setViewport: (viewport: import("./types").Viewport) => {
        type: string;
        viewport: import("./types").Viewport;
    };
    setLightSettings: (lightSettings: import("./types").LightSettings) => {
        type: string;
        lightSettings: import("./types").LightSettings;
    };
    setMovesBase: (base: import("./types").Movesbase[] | import("./types").MovesbaseFile) => {
        type: string;
        base: import("./types").Movesbase[] | import("./types").MovesbaseFile;
    };
    setDepotsBase: (depotsBase: import("./types").Depotsbase[]) => {
        type: string;
        depotsBase: import("./types").Depotsbase[];
    };
    setAnimatePause: (pause: boolean) => {
        type: string;
        pause: boolean;
    };
    setAnimateReverse: (reverse: boolean) => {
        type: string;
        reverse: boolean;
    };
    setSecPerHour: (secperhour: number) => {
        type: string;
        secperhour: number;
    };
    setClicked: (clickedObject: import("./types").ClickedObject[]) => {
        type: string;
        clickedObject: import("./types").ClickedObject[];
    };
    setRoutePaths: (paths: import("./types").RoutePaths[]) => {
        type: string;
        paths: import("./types").RoutePaths[];
    };
    setDefaultZoom: (defaultZoom: number) => {
        type: string;
        defaultZoom: number;
    };
    setDefaultPitch: (defaultPitch: number) => {
        type: string;
        defaultPitch: number;
    };
    setMovesOptionFunc: (func: (props: import("./types").BasedProps, i: number, j: number) => any) => {
        type: string;
        func: (props: import("./types").BasedProps, i: number, j: number) => any;
    };
    setDepotsOptionFunc: (func: (props: import("./types").BasedProps, i: number) => any) => {
        type: string;
        func: (props: import("./types").BasedProps, i: number) => any;
    };
    setLoading: (loading: boolean) => {
        type: string;
        loading: boolean;
    };
};
export { Actions, MovesInput, DepotsInput, LinemapInput, LoadingIcon, AddMinutesButton, PlayButton, PauseButton, ForwardButton, ReverseButton, ElapsedTimeRange, ElapsedTimeValue, SpeedRange, SpeedValue, SimulationDateTime, HarmoVisLayers, HarmoVisNonMapLayers, NavigationButton, settings, Container, MovesLayer, MovesNonmapLayer, DepotsLayer, FixedPointLayer, LineMapLayer, getContainerProp, connectToHarmowareVis, getCombinedReducer, reducer };
export * from "./types";
