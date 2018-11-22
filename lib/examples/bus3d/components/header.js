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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import CanvasComponent from './canvas-component';
import { p02d, hsvToRgb } from '../library';
var weekDayList = ['日', '月', '火', '水', '木', '金', '土'];
var CANVAS_WIDTH = 240;
var CANVAS_HEIGHT = 20;
var Header = /** @class */ (function (_super) {
    __extends(Header, _super);
    function Header() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Header.prototype.onBusReleaseClick = function () {
        var actions = this.props.actions;
        actions.setClicked(null);
        actions.setRoutePaths([]);
    };
    Header.prototype.setDelayHeight = function (e) {
        var _a = this.props, actions = _a.actions, clickedObject = _a.clickedObject;
        actions.setDelayHeight(e.target.value);
        actions.updateRoute(clickedObject, false);
    };
    Header.prototype.setScaleElevation = function (e) {
        this.props.actions.setScaleElevation(e.target.value);
    };
    Header.prototype.render = function () {
        var _a = this.props, date = _a.date, movedData = _a.movedData, busoption = _a.busoption, bsoptFname = _a.bsoptFname, elevationScale = _a.elevationScale, clickedObject = _a.clickedObject, delayrange = _a.delayrange, delayheight = _a.delayheight;
        var d = new Date(date);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var wday = weekDayList[d.getDay()];
        var hour = d.getHours();
        var min = d.getMinutes();
        var sec = d.getSeconds();
        var flg = clickedObject ? clickedObject[0].object.name.match(/^\d+-[12]/) : null;
        var canvasProps = {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            updateCanvas: function (context) {
                var cont = context;
                var hMin = 0;
                var hMax = 120;
                var unit = CANVAS_WIDTH / hMax;
                for (var h = hMin; h <= hMax; h += 1) {
                    cont.fillStyle = "rgb(" + hsvToRgb(h, 1, 1).join(',') + ")";
                    cont.fillRect((hMax - h) * unit, 0, unit, CANVAS_HEIGHT);
                }
            },
        };
        var getClickedInfo = movedData.find(function (element) {
            if (clickedObject && clickedObject[0].object &&
                clickedObject[0].object.movesbaseidx === element.movesbaseidx) {
                return true;
            }
            return false;
        });
        return (React.createElement("div", { className: "harmovis_header container", id: "header_area" },
            React.createElement("span", { className: "harmovis_header__spacer" }, year + "/" + p02d(month) + "/" + p02d(day) + "(" + wday + ")" + p02d(hour) + ":" + p02d(min) + ":" + p02d(sec)),
            React.createElement("span", { id: "bus_count", className: "harmovis_header__spacer" },
                movedData.length,
                " \u53F0\u904B\u884C\u4E2D"),
            Object.keys(busoption).length <= 0 ?
                React.createElement("span", { className: "harmovis_header__spacer" }, "\u30D0\u30B9\u62E1\u5F35\u60C5\u5831\u306A\u3057") :
                React.createElement("span", { className: "harmovis_header__spacer" }, "\u30D0\u30B9\u62E1\u5F35\u60C5\u5831\uFF1A" + bsoptFname),
            Object.keys(busoption).length > 0 &&
                (busoption.busmovesoption || busoption.busstopsoption) &&
                React.createElement("input", { className: "harmovis_header__input", type: "range", value: elevationScale, min: "1", max: "20", step: "1", onChange: this.setScaleElevation.bind(this) }),
            React.createElement("br", null),
            React.createElement("span", { className: "harmovis_header__spacer" }, "\u9045\u5EF6 0\u5206"),
            React.createElement(CanvasComponent, __assign({}, canvasProps)),
            React.createElement("span", { className: "harmovis_header__spacer" },
                "\uFF5E",
                delayrange,
                "\u5206"),
            flg && clickedObject && React.createElement("span", { className: "harmovis_header__spacer" }, "\uFF13\uFF24\u8868\u793A"),
            flg && clickedObject &&
                React.createElement("span", { className: "harmovis_header__spacer" },
                    React.createElement("input", { className: "harmovis_header__input", type: "range", value: delayheight, min: "0", max: "10", step: "1", onChange: this.setDelayHeight.bind(this) })),
            getClickedInfo &&
                React.createElement("div", null,
                    React.createElement("span", { className: "harmovis_header__spacer" },
                        "\u9078\u629E\u30D0\u30B9\u60C5\u5831\u00A0",
                        React.createElement("button", { onClick: this.onBusReleaseClick.bind(this), className: "harmovis_button", style: { width: '80px' } }, "\u89E3\u9664")),
                    React.createElement("span", { className: "harmovis_header__spacer" },
                        getClickedInfo.code,
                        " ",
                        getClickedInfo.name,
                        " ",
                        getClickedInfo.memo))));
    };
    return Header;
}(React.Component));
export default Header;
//# sourceMappingURL=header.js.map