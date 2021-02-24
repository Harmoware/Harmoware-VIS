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
import * as React from 'react';
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container(props) {
        var _this = _super.call(this, props) || this;
        _this.animationFrame = window.requestAnimationFrame(_this.animate.bind(_this));
        return _this;
    }
    Container.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    };
    Container.prototype.componentWillUnmount = function () {
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
        }
    };
    Container.prototype.animate = function () {
        if (this.props.timeLength > 0) {
            if (!this.props.animatePause && !this.props.loopEndPause) {
                if (!this.props.animateReverse) {
                    this.props.actions.increaseTime(this.props);
                }
                else {
                    this.props.actions.decreaseTime(this.props);
                }
            }
            else {
                this.props.actions.setFrameTimestamp(this.props);
            }
        }
        else {
            this.props.actions.setTimeStamp(this.props);
        }
        this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
    };
    Container.prototype.resize = function () {
        this.props.actions.setViewport({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };
    return Container;
}(React.Component));
export default Container;
//# sourceMappingURL=index.js.map