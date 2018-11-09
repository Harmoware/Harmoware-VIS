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
var ElapsedTimeRange = /** @class */ (function (_super) {
    __extends(ElapsedTimeRange, _super);
    function ElapsedTimeRange() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElapsedTimeRange.prototype.setTime = function (e) {
        this.props.actions.setTime(Math.floor(Number(e.target.value)));
    };
    ElapsedTimeRange.prototype.render = function () {
        var _a = this.props, settime = _a.settime, timeLength = _a.timeLength, min = _a.min, step = _a.step, id = _a.id, className = _a.className;
        return (React.createElement("input", { type: "range", value: Math.floor(settime), min: min, max: timeLength, step: step, onChange: this.setTime.bind(this), id: id, className: className }));
    };
    ElapsedTimeRange.defaultProps = {
        min: -100,
        step: 1,
        className: 'harmovis_input_range'
    };
    return ElapsedTimeRange;
}(React.Component));
export default ElapsedTimeRange;
//# sourceMappingURL=elapsedtime-range.js.map