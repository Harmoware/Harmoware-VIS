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
import { Icon } from 'react-icons-kit';
import { ic_fast_forward as icFastForward, ic_fast_rewind as icFastRewind } from 'react-icons-kit/md';
var default_style = { 'display': 'flex', 'justifyContent': 'center' };
var AddMinutesButton = /** @class */ (function (_super) {
    __extends(AddMinutesButton, _super);
    function AddMinutesButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AddMinutesButton.prototype.addMinutes = function (minutes) {
        this.props.actions.addMinutes(minutes);
    };
    AddMinutesButton.prototype.render = function () {
        var _a = this.props, addMinutes = _a.addMinutes, children = _a.children, i18n = _a.i18n, className = _a.className, propTitle = _a.title;
        var title = propTitle || (children && children.toString()) || addMinutes + " " + i18n.minutesCaption;
        return (React.createElement("button", { onClick: this.addMinutes.bind(this, addMinutes), className: className, title: title }, children === undefined ?
            React.createElement("span", { style: default_style },
                addMinutes > 0 ?
                    React.createElement(Icon, { icon: icFastForward }) : React.createElement(Icon, { icon: icFastRewind }),
                "\u00A0",
                addMinutes,
                "\u00A0",
                i18n.minutesCaption) :
            React.createElement("span", null, children)));
    };
    AddMinutesButton.defaultProps = {
        addMinutes: 10,
        i18n: {
            minutesCaption: 'min'
        },
        className: 'harmovis_button'
    };
    return AddMinutesButton;
}(React.Component));
export default AddMinutesButton;
//# sourceMappingURL=addminutes-button.js.map