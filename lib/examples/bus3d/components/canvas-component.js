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
var CanvasComponent = /** @class */ (function (_super) {
    __extends(CanvasComponent, _super);
    function CanvasComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CanvasComponent.prototype.componentDidMount = function () {
        this.updateCanvas();
    };
    CanvasComponent.prototype.updateCanvas = function () {
        var canvas = this.canvas;
        var context = canvas.getContext('2d');
        this.props.updateCanvas(context);
    };
    CanvasComponent.prototype.render = function () {
        var _this = this;
        return (React.createElement("canvas", { ref: function (canvas) { _this.canvas = canvas; }, width: this.props.width, height: this.props.height }));
    };
    return CanvasComponent;
}(React.Component));
export default CanvasComponent;
//# sourceMappingURL=canvas-component.js.map