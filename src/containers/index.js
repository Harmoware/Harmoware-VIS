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
import * as React from 'react';
var Root = /** @class */ (function (_super) {
    __extends(Root, _super);
    function Root(props) {
        var _this = _super.call(this, props) || this;
        _this.animationFrame = window.requestAnimationFrame(_this.animate.bind(_this));
        return _this;
    }
    Root.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    };
    Root.prototype.componentWillUnmount = function () {
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
        }
    };
    Root.prototype.animate = function () {
        var _a = this.props, timeLength = _a.timeLength, animatePause = _a.animatePause, animateReverse = _a.animateReverse, actions = _a.actions;
        if (timeLength > 0) {
            if (!animatePause) {
                if (!animateReverse) {
                    actions.increaseTime(this.props);
                }
                else {
                    actions.decreaseTime(this.props);
                }
            }
            else {
                actions.setFrameTimestamp(this.props);
            }
        }
        else {
            actions.setTimeStamp(this.props);
        }
        this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
    };
    Root.prototype.resize = function () {
        this.props.actions.setViewport({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };
    return Root;
}(React.Component));
export default Root;
//# sourceMappingURL=index.js.map