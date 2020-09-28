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
import { RingLoader } from 'react-spinners';
var LoadingIcon = /** @class */ (function (_super) {
    __extends(LoadingIcon, _super);
    function LoadingIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoadingIcon.prototype.render = function () {
        var _a = this.props, loading = _a.loading, color = _a.color;
        if (loading) {
            var devStyle = { position: 'fixed', zIndex: 200, top: 0, left: 0, width: '100%', height: '100%', display: 'flex' };
            var iconStyle = { margin: 'auto', display: 'flex' };
            return (React.createElement("div", { style: devStyle },
                React.createElement("div", { style: iconStyle },
                    React.createElement(RingLoader, { size: 60, color: color, loading: loading }))));
        }
        return null;
    };
    LoadingIcon.defaultProps = {
        loading: false,
        color: 'white'
    };
    return LoadingIcon;
}(React.Component));
export default LoadingIcon;
//# sourceMappingURL=loading-icon.js.map