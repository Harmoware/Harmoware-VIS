'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = {
  MAPBOX_TOKEN: '******',
  DATAPATH: './data/',
  GRIDDATAPATH: './GridCellLayerData/',
  BUSSTOPSPATH: './BusStopsData/',
  ROUTESPATH: './routes/'
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    default:
      return state;
  }
};