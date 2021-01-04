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
import { safeCheck, safeAdd, safeSubtract } from '../library';
var max = Math.max, min = Math.min;
var ElapsedTimeValue = /** @class */ (function (_super) {
    __extends(ElapsedTimeValue, _super);
    function ElapsedTimeValue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElapsedTimeValue.prototype.setTime = function (e) {
        var value = safeCheck(+e.target.value);
        var _a = this.props, actions = _a.actions, timeBegin = _a.timeBegin, timeLength = _a.timeLength, minimum = _a.min;
        var settime = min(timeLength, max(minimum, value));
        actions.setTime(safeAdd(settime, timeBegin) | 0);
    };
    ElapsedTimeValue.prototype.render = function () {
        var _a = this.props, settime = _a.settime, timeBegin = _a.timeBegin, timeLength = _a.timeLength, min = _a.min, id = _a.id, className = _a.className;
        return (React.createElement("input", { type: "number", value: safeSubtract(settime, timeBegin) | 0, min: min, max: timeLength, onChange: this.setTime.bind(this), id: id, className: className }));
    };
    ElapsedTimeValue.defaultProps = {
        min: -100,
        className: 'harmovis_input_number'
    };
    return ElapsedTimeValue;
}(React.Component));
export default ElapsedTimeValue;
//# sourceMappingURL=elapsedtime-value.js.map