'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = exports.connectToHarmowareVis = exports.getContainerProp = exports.LineMapLayer = exports.XbandmeshLayer = exports.CubeGraphLayer = exports.FixedPointLayer = exports.DepotsLayer = exports.MovesNonmapLayer = exports.MovesLayer = exports.Container = exports.settings = exports.HarmoVisNonMapLayers = exports.HarmoVisLayers = exports.SimulationDateTime = exports.SpeedRange = exports.ElapsedTimeRange = exports.ReverseButton = exports.ForwardButton = exports.PauseButton = exports.PlayButton = exports.AddMinutesButton = exports.LinemapInput = exports.XbandDataInput = exports.DepotsInput = exports.MovesInput = exports.Actions = undefined;

var _actions = require('./actions');

var _movesInput = require('./components/moves-input');

var _movesInput2 = _interopRequireDefault(_movesInput);

var _depotsInput = require('./components/depots-input');

var _depotsInput2 = _interopRequireDefault(_depotsInput);

var _xbanddataInput = require('./components/xbanddata-input');

var _xbanddataInput2 = _interopRequireDefault(_xbanddataInput);

var _linemapInput = require('./components/linemap-input');

var _linemapInput2 = _interopRequireDefault(_linemapInput);

var _addminutesButton = require('./components/addminutes-button');

var _addminutesButton2 = _interopRequireDefault(_addminutesButton);

var _elapsedtimeRange = require('./components/elapsedtime-range');

var _elapsedtimeRange2 = _interopRequireDefault(_elapsedtimeRange);

var _playButton = require('./components/play-button');

var _playButton2 = _interopRequireDefault(_playButton);

var _pauseButton = require('./components/pause-button');

var _pauseButton2 = _interopRequireDefault(_pauseButton);

var _reverseButton = require('./components/reverse-button');

var _reverseButton2 = _interopRequireDefault(_reverseButton);

var _forwardButton = require('./components/forward-button');

var _forwardButton2 = _interopRequireDefault(_forwardButton);

var _simulationDateTime = require('./components/simulation-date-time');

var _simulationDateTime2 = _interopRequireDefault(_simulationDateTime);

var _speedRange = require('./components/speed-range');

var _speedRange2 = _interopRequireDefault(_speedRange);

var _harmovislayers = require('./components/harmovislayers');

var _harmovislayers2 = _interopRequireDefault(_harmovislayers);

var _harmovisNonmapLayers = require('./components/harmovis-nonmap-layers');

var _harmovisNonmapLayers2 = _interopRequireDefault(_harmovisNonmapLayers);

var _movesLayer = require('./layers/moves-layer');

var _movesLayer2 = _interopRequireDefault(_movesLayer);

var _movesNonmapLayer = require('./layers/moves-nonmap-layer');

var _movesNonmapLayer2 = _interopRequireDefault(_movesNonmapLayer);

var _depotsLayer = require('./layers/depots-layer');

var _depotsLayer2 = _interopRequireDefault(_depotsLayer);

var _fixedPointLayer = require('./layers/fixed-point-layer');

var _fixedPointLayer2 = _interopRequireDefault(_fixedPointLayer);

var _cubegraphLayer = require('./layers/cubegraph-layer');

var _cubegraphLayer2 = _interopRequireDefault(_cubegraphLayer);

var _xbandmeshLayer = require('./layers/xbandmesh-layer');

var _xbandmeshLayer2 = _interopRequireDefault(_xbandmeshLayer);

var _lineMapLayer = require('./layers/line-map-layer');

var _lineMapLayer2 = _interopRequireDefault(_lineMapLayer);

var _settings = require('./constants/settings');

var settings = _interopRequireWildcard(_settings);

var _containers = require('./containers');

var _containers2 = _interopRequireDefault(_containers);

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _library = require('./library');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducer = {
  base: _reducers2.default
};

var Actions = {
  addMinutes: _actions.addMinutes,
  setTime: _actions.setTime,
  setLeading: _actions.setLeading,
  setTrailing: _actions.setTrailing,
  setViewport: _actions.setViewport,
  setLightSettings: _actions.setLightSettings,
  setMovesBase: _actions.setMovesBase,
  setDepotsBase: _actions.setDepotsBase,
  setAnimatePause: _actions.setAnimatePause,
  setAnimateReverse: _actions.setAnimateReverse,
  setSecPerHour: _actions.setSecPerHour,
  setClicked: _actions.setClicked,
  setRoutePaths: _actions.setRoutePaths,
  setDefaultZoom: _actions.setDefaultZoom,
  setDefaultPitch: _actions.setDefaultPitch,
  setMovesOptionFunc: _actions.setMovesOptionFunc,
  setDepotsOptionFunc: _actions.setDepotsOptionFunc,
  setRainfall: _actions.setRainfall
};

exports.Actions = Actions;
exports.MovesInput = _movesInput2.default;
exports.DepotsInput = _depotsInput2.default;
exports.XbandDataInput = _xbanddataInput2.default;
exports.LinemapInput = _linemapInput2.default;
exports.AddMinutesButton = _addminutesButton2.default;
exports.PlayButton = _playButton2.default;
exports.PauseButton = _pauseButton2.default;
exports.ForwardButton = _forwardButton2.default;
exports.ReverseButton = _reverseButton2.default;
exports.ElapsedTimeRange = _elapsedtimeRange2.default;
exports.SpeedRange = _speedRange2.default;
exports.SimulationDateTime = _simulationDateTime2.default;
exports.HarmoVisLayers = _harmovislayers2.default;
exports.HarmoVisNonMapLayers = _harmovisNonmapLayers2.default;
exports.settings = settings;
exports.Container = _containers2.default;
exports.MovesLayer = _movesLayer2.default;
exports.MovesNonmapLayer = _movesNonmapLayer2.default;
exports.DepotsLayer = _depotsLayer2.default;
exports.FixedPointLayer = _fixedPointLayer2.default;
exports.CubeGraphLayer = _cubegraphLayer2.default;
exports.XbandmeshLayer = _xbandmeshLayer2.default;
exports.LineMapLayer = _lineMapLayer2.default;
exports.getContainerProp = _library.getContainerProp;
exports.connectToHarmowareVis = _library.connectToHarmowareVis;
exports.reducer = reducer;