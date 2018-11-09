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
import DeckGL from 'deck.gl';
import OrbitController from './orbit-control';
;
var HarmoVisNonMapLayers = /** @class */ (function (_super) {
    __extends(HarmoVisNonMapLayers, _super);
    function HarmoVisNonMapLayers() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HarmoVisNonMapLayers.prototype.componentDidMount = function () {
        this.props.actions.setNonmapView(true);
    };
    HarmoVisNonMapLayers.prototype.initialize = function (gl) {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    };
    HarmoVisNonMapLayers.prototype.render = function () {
        var _this = this;
        var _a = this.props, viewport = _a.viewport, actions = _a.actions, layers = _a.layers;
        var onChangeViewport = this.props.onChangeViewport || actions.setViewport;
        var width = viewport.width, height = viewport.height;
        var glViewport = OrbitController.getViewport(viewport);
        return (React.createElement(OrbitController, __assign({}, viewport, { ref: function (canvas) { _this.canvas = canvas; }, onViewportChange: onChangeViewport }),
            React.createElement(DeckGL, { width: width, height: height, viewport: glViewport, layers: layers, onWebGLInitialized: this.initialize })));
    };
    return HarmoVisNonMapLayers;
}(React.Component));
export default HarmoVisNonMapLayers;
//# sourceMappingURL=harmovis-nonmap-layers.js.map