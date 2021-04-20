var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import InteractiveMap, { FlyToInterpolator } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapController } from '@deck.gl/core';
var MapGl = function (props) {
    var mapboxAddLayerValue = props.mapboxAddLayerValue, otherProps = __rest(props, ["mapboxAddLayerValue"]);
    var _a = React.useState(false), execflg = _a[0], setFlg = _a[1];
    var _b = React.useState(props.mapStyle), prevStyle = _b[0], setStyle = _b[1];
    var interactiveMapRef = React.useRef(null);
    var map = interactiveMapRef.current && interactiveMapRef.current.getMap();
    if (map && !execflg && mapboxAddLayerValue) {
        setFlg(true);
        map.on('load', function () {
            for (var _i = 0, mapboxAddLayerValue_1 = mapboxAddLayerValue; _i < mapboxAddLayerValue_1.length; _i++) {
                var LayerValuemapElement = mapboxAddLayerValue_1[_i];
                if (!map.getLayer(LayerValuemapElement.id)) {
                    map.addLayer(LayerValuemapElement);
                }
            }
        });
    }
    if (prevStyle !== props.mapStyle) {
        setStyle(props.mapStyle);
        if (map && mapboxAddLayerValue) {
            map.on('styledata', function () {
                for (var _i = 0, mapboxAddLayerValue_2 = mapboxAddLayerValue; _i < mapboxAddLayerValue_2.length; _i++) {
                    var LayerValuemapElement = mapboxAddLayerValue_2[_i];
                    if (!map.getLayer(LayerValuemapElement.id)) {
                        map.addLayer(LayerValuemapElement);
                    }
                }
            });
        }
    }
    return (React.createElement(InteractiveMap, __assign({}, otherProps, { ref: interactiveMapRef })));
};
var HarmoVisLayers = /** @class */ (function (_super) {
    __extends(HarmoVisLayers, _super);
    function HarmoVisLayers(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { transition: false };
        return _this;
    }
    HarmoVisLayers.prototype.componentDidUpdate = function (prevProps) {
        if (!this.state.transition) {
            this.setState({ transition: true });
        }
        var transitionDuration = this.props.viewport.transitionDuration;
        if (transitionDuration !== prevProps.viewport.transitionDuration) {
            if (transitionDuration !== undefined) {
                this.props.actions.setViewport({
                    transitionDuration: undefined,
                    transitionInterpolator: undefined
                });
            }
        }
    };
    HarmoVisLayers.prototype.initialize = function (gl) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };
    HarmoVisLayers.prototype.render = function () {
        var props = this.props;
        var actions = props.actions, visible = props.visible, viewport = props.viewport, mapStyle = props.mapStyle, mapboxApiAccessToken = props.mapboxApiAccessToken, layers = props.layers, mapGlComponents = props.mapGlComponents, flytoArgument = props.flytoArgument, mapboxAddLayerValue = props.mapboxAddLayerValue;
        var onViewportChange = props.onViewportChange || actions.setViewport;
        var transitionDuration = this.state.transition ?
            (viewport.transitionDuration || props.transitionDuration) : undefined;
        var transitionInterpolator = viewport.transitionInterpolator ||
            props.transitionInterpolator || new FlyToInterpolator(flytoArgument);
        var transitionInterruption = viewport.transitionInterruption ||
            props.transitionInterruption;
        if (visible) {
            return (React.createElement(MapGl, __assign({}, viewport, { mapStyle: mapStyle, onViewportChange: onViewportChange, mapboxApiAccessToken: mapboxApiAccessToken, visible: visible, transitionDuration: transitionDuration, transitionInterpolator: transitionInterpolator, transitionInterruption: transitionInterruption, mapboxAddLayerValue: mapboxAddLayerValue }),
                mapGlComponents,
                React.createElement(DeckGL, { viewState: viewport, layers: layers, onWebGLInitialized: this.initialize })));
        }
        else {
            var viewState = __assign(__assign({}, viewport), { transitionDuration: transitionDuration, transitionInterpolator: transitionInterpolator, transitionInterruption: transitionInterruption });
            return (React.createElement(DeckGL, { controller: { type: MapController }, onViewStateChange: function (v) { return onViewportChange(v.viewState); }, viewState: viewState, layers: layers, onWebGLInitialized: this.initialize }));
        }
    };
    HarmoVisLayers.defaultProps = {
        visible: true,
        mapStyle: 'mapbox://styles/mapbox/dark-v8',
        mapGlComponents: null,
        mapboxAddLayerValue: [{
                "id": "3d-buildings",
                "source": "composite",
                "source-layer": "building",
                "filter": ["==", "extrude", "true"],
                "type": "fill-extrusion",
                "paint": {
                    "fill-extrusion-color": "#888",
                    "fill-extrusion-height": [
                        "interpolate", ["linear"], ["zoom"],
                        5, 0, 5.05, ["get", "height"]
                    ],
                    "fill-extrusion-base": [
                        "interpolate", ["linear"], ["zoom"],
                        5, 0, 5.05, ["get", "min_height"]
                    ],
                    "fill-extrusion-opacity": .6
                },
            }],
        flytoArgument: null,
        transitionDuration: undefined,
        transitionInterpolator: undefined,
        transitionInterruption: undefined,
    };
    return HarmoVisLayers;
}(React.Component));
export default HarmoVisLayers;
//# sourceMappingURL=harmovislayers.js.map