import * as types from '../constants/action-types';
export var addMinutes = function (min) { return ({ type: types.ADDMINUTES, min: min }); };
export var increaseTime = function (props) { return ({ type: types.INCREASETIME, props: props }); };
export var decreaseTime = function (props) { return ({ type: types.DECREASETIME, props: props }); };
export var setFrameTimestamp = function (props) { return ({ type: types.SETFRAMETIMESTAMP, props: props }); };
export var setTimeStamp = function (props) { return ({ type: types.SETTIMESTAMP, props: props }); };
export var setTime = function (time) { return ({ type: types.SETTIME, time: time }); };
export var setLeading = function (leading) { return ({ type: types.SETLEADING, leading: leading }); };
export var setTrailing = function (trailing) {
    return ({ type: types.SETTRAILING, trailing: trailing });
};
export var setViewport = function (viewport) {
    return ({ type: types.SETVIEWPORT, viewport: viewport });
};
export var setLightSettings = function (lightSettings) {
    return ({ type: types.SETLIGHTSETTINGS, lightSettings: lightSettings });
};
export var setMovesBase = function (base) {
    return ({ type: types.SETMOVESBASE, base: base });
};
export var setDepotsBase = function (depotsBase) {
    return ({ type: types.SETDEPOTSBASE, depotsBase: depotsBase });
};
export var setAnimatePause = function (pause) { return ({ type: types.SETANIMATEPAUSE, pause: pause }); };
export var setAnimateReverse = function (reverse) {
    return ({ type: types.SETANIMATEREVERSE, reverse: reverse });
};
export var setSecPerHour = function (secperhour) {
    return ({ type: types.SETSECPERHOUR, secperhour: secperhour });
};
export var setClicked = function (clickedObject) {
    return ({ type: types.SETCLICKED, clickedObject: clickedObject });
};
export var setRoutePaths = function (paths) {
    return ({ type: types.SETROUTEPATHS, paths: paths });
};
export var setDefaultZoom = function (defaultZoom) {
    return ({ type: types.SETDEFAULTZOOM, defaultZoom: defaultZoom });
};
export var setDefaultPitch = function (defaultPitch) {
    return ({ type: types.SETDEFAULTPITCH, defaultPitch: defaultPitch });
};
export var setMovesOptionFunc = function (func) {
    return ({ type: types.SETMOVESOPTIONFUNC, func: func });
};
export var setDepotsOptionFunc = function (func) {
    return ({ type: types.SETDEPOTSOPTIONFUNC, func: func });
};
export var setNonmapView = function (nonmapView) {
    return ({ type: types.SETNONMAPVIEW, nonmapView: nonmapView });
};
export var setLinemapData = function (linemapData) {
    return ({ type: types.SETLINEMAPDATA, linemapData: linemapData });
};
export var setLoading = function (loading) {
    return ({ type: types.SETLOADING, loading: loading });
};
export var setInputFilename = function (inputFileName) {
    return ({ type: types.SETINPUTFILENAME, inputFileName: inputFileName });
};
//# sourceMappingURL=index.js.map