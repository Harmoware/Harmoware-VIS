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
import { ic_play_circle_outline as icPlayArrow } from 'react-icons-kit/md';
var default_style = { 'display': 'flex', 'justifyContent': 'center' };
var PlayButton = /** @class */ (function (_super) {
    __extends(PlayButton, _super);
    function PlayButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlayButton.prototype.setAnimatePause = function () {
        this.props.actions.setAnimatePause(false);
    };
    PlayButton.prototype.render = function () {
        var _a = this.props, children = _a.children, i18n = _a.i18n, className = _a.className, propTitle = _a.title;
        var title = propTitle || (children && children.toString()) || i18n.playButtonCaption;
        return (React.createElement("button", { onClick: this.setAnimatePause.bind(this), className: className, title: title }, children === undefined ?
            React.createElement("span", { style: default_style },
                React.createElement(Icon, { icon: icPlayArrow }),
                "\u00A0",
                i18n.playButtonCaption) :
            React.createElement("span", null, children)));
    };
    PlayButton.defaultProps = {
        i18n: {
            playButtonCaption: '️PLAY'
        },
        className: 'harmovis_button'
    };
    return PlayButton;
}(React.Component));
export default PlayButton;
//# sourceMappingURL=play-button.js.map