var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
var FpsDisplay = /** @class */ (function (_super) {
    __extends(FpsDisplay, _super);
    function FpsDisplay(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            saveTime: Date.now(),
            frameCounterArray: [],
            fpsRate: 0,
        };
        FpsDisplay.frameCounter = 0;
        return _this;
    }
    FpsDisplay.getDerivedStateFromProps = function (nextProps, prevState) {
        var width = nextProps.width;
        var saveTime = prevState.saveTime, frameCounterArray = prevState.frameCounterArray;
        if ((Date.now() - saveTime) >= 1000) {
            frameCounterArray.push(FpsDisplay.frameCounter);
            if (frameCounterArray.length > (width / 2)) {
                frameCounterArray.shift();
            }
            var retuenObject = {
                saveTime: Date.now(),
                frameCounterArray: frameCounterArray,
                fpsRate: FpsDisplay.frameCounter,
            };
            FpsDisplay.frameCounter = 1;
            return retuenObject;
        }
        FpsDisplay.frameCounter = FpsDisplay.frameCounter + 1;
        return null;
    };
    FpsDisplay.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.state !== prevState) {
            var width = prevProps.width, height_1 = prevProps.height, colorCode_1 = prevProps.colorCode;
            var frameCounterArray = prevState.frameCounterArray;
            var context_1 = this.canvas.getContext('2d');
            var maxValue_1 = Math.max.apply(null, frameCounterArray);
            context_1.clearRect(0, 0, width, height_1);
            frameCounterArray.forEach(function (frameCounter, idx) {
                var value = (frameCounter / maxValue_1) * height_1;
                context_1.fillStyle = colorCode_1;
                context_1.fillRect((idx * 2), (height_1 - value), 1, value);
            });
        }
    };
    FpsDisplay.prototype.render = function () {
        var _this = this;
        var _a = this.props, width = _a.width, height = _a.height, className = _a.className, UnitCaption = _a.UnitCaption;
        return (React.createElement("div", { className: className, title: this.state.fpsRate + " " + UnitCaption },
            React.createElement("div", null,
                React.createElement("span", null, this.state.fpsRate),
                React.createElement("span", null, UnitCaption)),
            React.createElement("canvas", { ref: function (canvas) { _this.canvas = canvas; }, width: width, height: height })));
    };
    FpsDisplay.defaultProps = {
        width: 60,
        height: 40,
        colorCode: '#00FF00',
        className: 'harmovis_fpsRate',
        UnitCaption: 'fps'
    };
    return FpsDisplay;
}(React.Component));
export default FpsDisplay;
//# sourceMappingURL=fps-display.js.map