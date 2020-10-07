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
var SpeedRange = /** @class */ (function (_super) {
    __extends(SpeedRange, _super);
    function SpeedRange() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpeedRange.prototype.setSecPerHour = function (e) {
        var value = Number(e.target.value);
        var _a = this.props, maxsecperhour = _a.maxsecperhour, min = _a.min, actions = _a.actions;
        var secperhour = (maxsecperhour + min) - Math.floor(value);
        actions.setSecPerHour(secperhour);
    };
    SpeedRange.prototype.render = function () {
        var _a = this.props, secperhour = _a.secperhour, maxsecperhour = _a.maxsecperhour, min = _a.min, step = _a.step, id = _a.id, className = _a.className, propTitle = _a.title;
        var title = propTitle || "" + secperhour;
        return (React.createElement("input", { type: "range", value: (maxsecperhour + min) - secperhour, min: min, max: maxsecperhour, step: step, onChange: this.setSecPerHour.bind(this), id: id, className: className, title: title }));
    };
    SpeedRange.defaultProps = {
        maxsecperhour: 3600,
        min: 1,
        step: 1,
        className: 'harmovis_input_range'
    };
    return SpeedRange;
}(React.Component));
export default SpeedRange;
//# sourceMappingURL=speed-range.js.map