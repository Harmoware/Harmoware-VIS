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
var SpeedValue = /** @class */ (function (_super) {
    __extends(SpeedValue, _super);
    function SpeedValue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpeedValue.prototype.setSecPerHour = function (e) {
        var value = Number(e.target.value);
        var _a = this.props, actions = _a.actions, maxsecperhour = _a.maxsecperhour, min = _a.min;
        var secperhour = Math.min(maxsecperhour, Math.max(min, value));
        actions.setSecPerHour(secperhour);
    };
    SpeedValue.prototype.render = function () {
        var _a = this.props, secperhour = _a.secperhour, maxsecperhour = _a.maxsecperhour, min = _a.min, id = _a.id, className = _a.className;
        return (React.createElement("input", { type: "number", value: secperhour, min: min, max: maxsecperhour, onChange: this.setSecPerHour.bind(this), id: id, className: className }));
    };
    SpeedValue.defaultProps = {
        maxsecperhour: 3600,
        min: 1,
        className: 'harmovis_input_number'
    };
    return SpeedValue;
}(React.Component));
export default SpeedValue;
//# sourceMappingURL=speed-value.js.map