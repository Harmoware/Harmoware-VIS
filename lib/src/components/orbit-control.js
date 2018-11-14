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
/* global window */
import * as React from 'react';
import { PerspectiveViewport } from 'deck.gl';
import { vec3 } from 'gl-matrix';
/* Utils */
// constrain number between bounds
function clamp(x, min, max) {
    if (x < min) {
        return min;
    }
    if (x > max) {
        return max;
    }
    return x;
}
var ua = typeof window.navigator !== 'undefined' ?
    window.navigator.userAgent.toLowerCase() : '';
var firefox = ua.indexOf('firefox') !== -1;
var OrbitController = /** @class */ (function (_super) {
    __extends(OrbitController, _super);
    function OrbitController(props) {
        var _this = _super.call(this, props) || this;
        _this.dragStartPos = null;
        return _this;
    }
    OrbitController.getViewport = function (viewport) {
        var width = viewport.width, height = viewport.height, lookAt = viewport.lookAt, distance = viewport.distance, rotationX = viewport.rotationX, rotationY = viewport.rotationY, fov = viewport.fov;
        var cameraPos = vec3.add([], lookAt, [0, 0, distance]);
        vec3.rotateX(cameraPos, cameraPos, lookAt, (rotationX / 180) * Math.PI);
        vec3.rotateY(cameraPos, cameraPos, lookAt, (rotationY / 180) * Math.PI);
        return new PerspectiveViewport({
            width: width,
            height: height,
            lookAt: lookAt,
            far: 1000,
            near: 0.1,
            fovy: fov,
            eye: cameraPos
        });
    };
    OrbitController.prototype.onDragStart = function (evt) {
        var pageX = evt.pageX, pageY = evt.pageY;
        this.dragStartPos = [pageX, pageY];
        this.props.onViewportChange({ isDragging: true });
    };
    OrbitController.prototype.onDrag = function (evt) {
        if (this.dragStartPos) {
            var pageX = evt.pageX, pageY = evt.pageY;
            var _a = this.props, width = _a.width, height = _a.height;
            var dx = (pageX - this.dragStartPos[0]) / width;
            var dy = (pageY - this.dragStartPos[1]) / height;
            if (evt.shiftKey || evt.ctrlKey || evt.altKey || evt.metaKey) {
                // rotate
                var rotationX = this.props.rotationX;
                var newRotationX = clamp(rotationX - (dy * 180), 0, 90);
                this.props.onViewportChange({
                    rotationX: newRotationX
                });
            }
            else {
                // pan
                var _b = this.props, lookAt = _b.lookAt, distance = _b.distance, fov = _b.fov;
                var unitsPerPixel = distance / Math.tan(((fov / 180) * Math.PI) / 2) / 2;
                var newLookAt = vec3.add([], lookAt, [-unitsPerPixel * dx, unitsPerPixel * dy, 0]);
                this.props.onViewportChange({
                    lookAt: newLookAt
                });
            }
            this.dragStartPos = [pageX, pageY];
        }
    };
    OrbitController.prototype.onDragEnd = function () {
        this.dragStartPos = null;
        this.props.onViewportChange({ isDragging: false });
    };
    OrbitController.prototype.onWheel = function (evt) {
        evt.preventDefault();
        var value = evt.deltaY;
        // Firefox doubles the values on retina screens...
        if (firefox && evt.deltaMode === window.WheelEvent.DOM_DELTA_PIXEL) {
            value /= window.devicePixelRatio;
        }
        if (evt.deltaMode === window.WheelEvent.DOM_DELTA_LINE) {
            value *= 40;
        }
        if (value !== 0 && value % 4.000244140625 === 0) {
            // This one is definitely a mouse wheel event.
            // Normalize this value to match trackpad.
            value = Math.floor(value / 4);
        }
        var _a = this.props, distance = _a.distance, minDistance = _a.minDistance, maxDistance = _a.maxDistance;
        var newDistance = clamp(distance * (Math.pow(1.001, value)), minDistance, maxDistance);
        this.props.onViewportChange({
            distance: newDistance
        });
    };
    OrbitController.prototype.render = function () {
        return (React.createElement("div", { style: { position: 'relative', userSelect: 'none' }, onMouseDown: this.onDragStart.bind(this), onMouseMove: this.onDrag.bind(this), onMouseLeave: this.onDragEnd.bind(this), onMouseUp: this.onDragEnd.bind(this), onWheel: this.onWheel.bind(this) }, this.props.children));
    };
    OrbitController.defaultProps = {
        lookAt: [0, 0, 0],
        rotationX: 0,
        rotationY: 0,
        minDistance: 0,
        maxDistance: Infinity,
        fov: 50
    };
    return OrbitController;
}(React.Component));
export default OrbitController;
//# sourceMappingURL=orbit-control.js.map