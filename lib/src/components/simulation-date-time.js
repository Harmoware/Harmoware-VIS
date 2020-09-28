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
var SimulationDateTime = /** @class */ (function (_super) {
    __extends(SimulationDateTime, _super);
    function SimulationDateTime() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SimulationDateTime.prototype.render = function () {
        var _a = this.props, settime = _a.settime, caption = _a.caption, locales = _a.locales, options = _a.options, className = _a.className;
        var date = new Date(settime * 1000);
        var nbsp = caption.length > 0 ? ' ' : '';
        return (React.createElement("span", { className: className },
            caption,
            nbsp,
            date.toLocaleString(locales, options)));
    };
    SimulationDateTime.defaultProps = {
        caption: '',
        locales: 'ja-JP',
        options: { year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            weekday: 'short' },
    };
    return SimulationDateTime;
}(React.Component));
export default SimulationDateTime;
//# sourceMappingURL=simulation-date-time.js.map