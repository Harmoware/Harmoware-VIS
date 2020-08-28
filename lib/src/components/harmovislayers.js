var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
import InteractiveMap, { FlyToInterpolator } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapController } from '@deck.gl/core';
var MapGl = /** @class */ (function (_super) {
    __extends(MapGl, _super);
    function MapGl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapGl.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        if (!MapGl.mapboxAddLayerValue)
            return;
        var map = this.getMap();
        var LayerValuemap = MapGl.mapboxAddLayerValue;
        map.on('load', function () {
            for (var _i = 0, LayerValuemap_1 = LayerValuemap; _i < LayerValuemap_1.length; _i++) {
                var LayerValuemapElement = LayerValuemap_1[_i];
                map.addLayer(LayerValuemapElement);
            }
        });
    };
    MapGl.prototype.componentDidUpdate = function (prevProps, prevState) {
        _super.prototype.componentDidUpdate.call(this, prevProps, prevState);
        if (prevProps.mapStyle !== this.props.mapStyle && prevProps.mapStyle === '') {
            if (!MapGl.mapboxAddLayerValue)
                return;
            var map_1 = this.getMap();
            var LayerValuemap_2 = MapGl.mapboxAddLayerValue;
            var execflg_1 = false;
            map_1.on('styledata', function () {
                if (execflg_1)
                    return;
                for (var _i = 0, LayerValuemap_3 = LayerValuemap_2; _i < LayerValuemap_3.length; _i++) {
                    var LayerValuemapElement = LayerValuemap_3[_i];
                    map_1.addLayer(LayerValuemapElement);
                }
                execflg_1 = true;
            });
        }
    };
    return MapGl;
}(InteractiveMap));
var HarmoVisLayers = /** @class */ (function (_super) {
    __extends(HarmoVisLayers, _super);
    function HarmoVisLayers(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { transition: false };
        MapGl.mapboxAddLayerValue = props.mapboxAddLayerValue;
        return _this;
    }
    HarmoVisLayers.prototype.componentDidUpdate = function (prevProps) {
        if (!this.state.transition) {
            this.setState({ transition: true });
        }
        if (this.props.viewport.transitionDuration !== prevProps.viewport.transitionDuration) {
            if (this.props.viewport.transitionDuration !== undefined) {
                this.props.actions.setViewport({ transitionDuration: undefined });
            }
        }
    };
    HarmoVisLayers.prototype.initialize = function (gl) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };
    HarmoVisLayers.prototype.render = function () {
        var props = this.props;
        var actions = props.actions, visible = props.visible, viewport = props.viewport, mapStyle = props.mapStyle, mapboxApiAccessToken = props.mapboxApiAccessToken, layers = props.layers, mapGlComponents = props.mapGlComponents, flytoArgument = props.flytoArgument;
        var onViewportChange = props.onViewportChange || actions.setViewport;
        if (visible) {
            var transitionDuration = this.state.transition ?
                (viewport.transitionDuration || props.transitionDuration) : undefined;
            var transitionInterpolator = viewport.transitionInterpolator ||
                props.transitionInterpolator || new FlyToInterpolator(flytoArgument);
            var transitionInterruption = viewport.transitionInterruption ||
                props.transitionInterruption;
            return (React.createElement(MapGl, __assign({}, viewport, { mapStyle: mapStyle, onViewportChange: onViewportChange, mapboxApiAccessToken: mapboxApiAccessToken, visible: visible, transitionDuration: transitionDuration, transitionInterpolator: transitionInterpolator, transitionInterruption: transitionInterruption }),
                mapGlComponents,
                React.createElement(DeckGL, { viewState: viewport, layers: layers, onWebGLInitialized: this.initialize })));
        }
        else {
            return (React.createElement(DeckGL, { controller: { type: MapController }, onViewStateChange: function (v) { return onViewportChange(v.viewState); }, viewState: viewport, layers: layers, onWebGLInitialized: this.initialize }));
        }
    };
    HarmoVisLayers.defaultProps = {
        visible: true,
        mapStyle: 'mapbox://styles/mapbox/dark-v8',
        mapGlComponents: null,
        mapboxAddLayerValue: [{
                "id": '3d-buildings',
                "source": 'composite',
                "source-layer": 'building',
                "filter": ['==', 'extrude', 'true'],
                "type": 'fill-extrusion',
                "paint": {
                    "fill-extrusion-color": '#888',
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