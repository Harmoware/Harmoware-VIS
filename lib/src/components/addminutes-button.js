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
import { Icon } from 'react-icons-kit';
import { ic_fast_forward as icFastForward, ic_fast_rewind as icFastRewind } from 'react-icons-kit/md';
var AddMinutesButton = /** @class */ (function (_super) {
    __extends(AddMinutesButton, _super);
    function AddMinutesButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AddMinutesButton.prototype.addMinutes = function (minutes) {
        this.props.actions.addMinutes(minutes);
    };
    AddMinutesButton.prototype.render = function () {
        var _a = this.props, addMinutes = _a.addMinutes, children = _a.children, i18n = _a.i18n, className = _a.className;
        return (React.createElement("button", { onClick: this.addMinutes.bind(this, addMinutes), className: className }, children === undefined ?
            React.createElement("span", null,
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
    };
    return AddMinutesButton;
}(React.Component));
export default AddMinutesButton;
//# sourceMappingURL=addminutes-button.js.map