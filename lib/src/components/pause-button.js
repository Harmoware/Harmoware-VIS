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
import { ic_pause_circle_outline as icPause } from 'react-icons-kit/md';
var PauseButton = /** @class */ (function (_super) {
    __extends(PauseButton, _super);
    function PauseButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PauseButton.prototype.setAnimatePause = function () {
        this.props.actions.setAnimatePause(true);
    };
    PauseButton.prototype.render = function () {
        var _a = this.props, children = _a.children, i18n = _a.i18n, className = _a.className;
        return (React.createElement("button", { onClick: this.setAnimatePause.bind(this), className: className }, children === undefined ?
            React.createElement("span", null,
                React.createElement(Icon, { icon: icPause }),
                "\u00A0",
                i18n.pauseButtonCaption) :
            React.createElement("span", null, children)));
    };
    PauseButton.defaultProps = {
        i18n: {
            pauseButtonCaption: 'PAUSE'
        },
    };
    return PauseButton;
}(React.Component));
export default PauseButton;
//# sourceMappingURL=pause-button.js.map