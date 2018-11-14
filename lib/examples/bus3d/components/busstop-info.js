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
var BusStopInfo = /** @class */ (function (_super) {
    __extends(BusStopInfo, _super);
    function BusStopInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BusStopInfo.prototype.render = function () {
        var _a = this.props, selectedBusstop = _a.selectedBusstop, date = _a.date, depotsData = _a.depotsData;
        var d = new Date(date);
        var width = selectedBusstop.length > 0 && selectedBusstop !== '0000' ? '100%' : '0%';
        var height = selectedBusstop.length > 0 && selectedBusstop !== '0000' ? '100%' : '0%';
        var busstop = depotsData.find(function (busstopElement) {
            if (busstopElement.code === selectedBusstop) {
                return true;
            }
            return false;
        });
        return (React.createElement("svg", { width: width, height: height },
            selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
                React.createElement("rect", { width: width, height: height, stroke: "none", fill: "none" }) : null,
            selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
                React.createElement("text", { x: "20", y: "20", fill: "white" }, d.toLocaleDateString() + " " + d.toLocaleTimeString()) : null,
            selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
                React.createElement("text", { x: "20", y: "40", fill: "white" },
                    selectedBusstop,
                    ":",
                    busstop.name) : null,
            selectedBusstop.length > 0 && selectedBusstop !== '0000' ?
                React.createElement("text", { x: "20", y: "60", fill: "white" }, busstop.memo) : null));
    };
    return BusStopInfo;
}(React.Component));
export default BusStopInfo;
//# sourceMappingURL=busstop-info.js.map