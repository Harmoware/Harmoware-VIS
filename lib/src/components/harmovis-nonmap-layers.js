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
import DeckGL, { OrbitView, LinearInterpolator } from 'deck.gl';
;
var transitionInterpolator = new LinearInterpolator(['rotationOrbit']);
var HarmoVisNonMapLayers = /** @class */ (function (_super) {
    __extends(HarmoVisNonMapLayers, _super);
    function HarmoVisNonMapLayers(props) {
        var _this = _super.call(this, props) || this;
        _this.onLoad = _this.onLoad.bind(_this);
        _this.onViewStateChange = _this.onViewStateChange.bind(_this);
        _this.rotateCamera = _this.rotateCamera.bind(_this);
        return _this;
    }
    HarmoVisNonMapLayers.prototype.onViewStateChange = function (_a) {
        var viewState = _a.viewState;
        var _b = this.props, viewport = _b.viewport, actions = _b.actions;
        actions.setViewport(__assign({}, viewport, viewState));
    };
    HarmoVisNonMapLayers.prototype.onLoad = function () {
        this.rotateCamera();
    };
    HarmoVisNonMapLayers.prototype.rotateCamera = function () {
        var _a = this.props, viewport = _a.viewport, actions = _a.actions;
        actions.setViewport(__assign({}, viewport, { transitionInterpolator: transitionInterpolator }));
    };
    HarmoVisNonMapLayers.prototype.componentDidMount = function () {
        this.props.actions.setNonmapView(true);
    };
    HarmoVisNonMapLayers.prototype.initialize = function (gl) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };
    HarmoVisNonMapLayers.prototype.render = function () {
        var _a = this.props, viewport = _a.viewport, layers = _a.layers;
        var width = viewport.width, height = viewport.height;
        return (React.createElement(DeckGL, { width: width, height: height, views: new OrbitView(), viewState: viewport, controller: true, onLoad: this.onLoad, onViewStateChange: this.onViewStateChange, layers: layers }));
    };
    return HarmoVisNonMapLayers;
}(React.Component));
export default HarmoVisNonMapLayers;
//# sourceMappingURL=harmovis-nonmap-layers.js.map