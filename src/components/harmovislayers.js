var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import MapGL from 'react-map-gl';
import DeckGL from 'deck.gl';
var HarmoVisLayers = /** @class */ (function (_super) {
    __extends(HarmoVisLayers, _super);
    function HarmoVisLayers() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HarmoVisLayers.prototype.componentDidMount = function () {
        this.props.actions.setNonmapView(false);
    };
    HarmoVisLayers.prototype.initialize = function (gl) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };
    HarmoVisLayers.prototype.render = function () {
        var _a = this.props, viewport = _a.viewport, mapStyle = _a.mapStyle, actions = _a.actions, mapboxApiAccessToken = _a.mapboxApiAccessToken, layers = _a.layers;
        var onChangeViewport = this.props.onChangeViewport || actions.setViewport;
        return (React.createElement(MapGL, __assign({}, viewport, { mapStyle: mapStyle, perspectiveEnabled: true, onChangeViewport: onChangeViewport, mapboxApiAccessToken: mapboxApiAccessToken }),
            React.createElement(DeckGL, __assign({}, viewport, { layers: layers, onWebGLInitialized: this.initialize }))));
    };
    HarmoVisLayers.defaultProps = {
        mapStyle: 'mapbox://styles/mapbox/dark-v8',
    };
    return HarmoVisLayers;
}(React.Component));
export default HarmoVisLayers;
//# sourceMappingURL=harmovislayers.js.map