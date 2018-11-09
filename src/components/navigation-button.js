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
import { ic_navigation as icNavigation } from 'react-icons-kit/md';
var NavigationButton = /** @class */ (function (_super) {
    __extends(NavigationButton, _super);
    function NavigationButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavigationButton.prototype.setViewport = function (argument) {
        this.props.actions.setViewport(argument);
    };
    NavigationButton.prototype.render = function () {
        var _a = this.props, buttonType = _a.buttonType, viewport = _a.viewport, className = _a.className;
        switch (buttonType) {
            case 'zoom-in': {
                var zoom = Math.min(viewport.zoom + 0.5, viewport.maxZoom);
                var distance = Math.max(viewport.distance - 4, viewport.minDistance);
                return (React.createElement("button", { onClick: this.setViewport.bind(this, { zoom: zoom, distance: distance }), className: className }, "\uFF0B"));
            }
            case 'zoom-out': {
                var zoom = Math.max(viewport.zoom - 0.5, viewport.minZoom);
                var distance = Math.min(viewport.distance + 4, viewport.maxDistance);
                return (React.createElement("button", { onClick: this.setViewport.bind(this, { zoom: zoom, distance: distance }), className: className }, "\uFF0D"));
            }
            case 'compass': {
                var iconStyle = { transform: "rotate(" + viewport.bearing * -1 + "deg)" };
                return (React.createElement("button", { onClick: this.setViewport.bind(this, { bearing: 0, pitch: 30, rotationX: 60, rotationY: 0, lookAt: [0, 0, 0] }), className: className },
                    React.createElement("div", { style: iconStyle },
                        React.createElement(Icon, { icon: icNavigation }))));
            }
            default:
                return null;
        }
    };
    NavigationButton.defaultProps = {
        className: 'harmovis_button'
    };
    return NavigationButton;
}(React.Component));
export default NavigationButton;
//# sourceMappingURL=navigation-button.js.map