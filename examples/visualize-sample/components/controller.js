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
import { MovesInput, DepotsInput, AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton, ElapsedTimeRange, ElapsedTimeValue, SpeedRange, SpeedValue, SimulationDateTime, NavigationButton } from 'harmoware-vis';
import { Icon } from 'react-icons-kit';
import { ic_delete_forever as icDeleteForever, ic_save as icSave, ic_layers as icLayers, ic_delete as icDelete } from 'react-icons-kit/md';
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            currentGroupindex: 0,
            routeGroupDisplay: false,
            saveRouteGroup: [],
        };
        return _this;
    }
    Controller.prototype.clearAllRoute = function () {
        this.props.actions.setClicked(null);
        this.props.actions.setRoutePaths([]);
        this.setState({ currentGroupindex: 0, routeGroupDisplay: false, saveRouteGroup: [] });
    };
    Controller.prototype.saveRouteGroup = function () {
        var _a = this.props, clickedObject = _a.clickedObject, routePaths = _a.routePaths, actions = _a.actions;
        if (clickedObject && routePaths.length > 0) {
            var saveRouteGroup = this.state.saveRouteGroup;
            var currentGroupindex = saveRouteGroup.length;
            var routeGroupDisplay = false;
            this.setState({ currentGroupindex: currentGroupindex,
                routeGroupDisplay: routeGroupDisplay,
                saveRouteGroup: saveRouteGroup.concat([
                    { clickedObject: clickedObject, routePaths: routePaths }
                ]) });
            actions.setClicked(null);
            actions.setRoutePaths([]);
        }
    };
    Controller.prototype.displayRouteGroup = function () {
        var _a = this.state, currentGroupindex = _a.currentGroupindex, saveRouteGroup = _a.saveRouteGroup;
        if (saveRouteGroup.length > 0) {
            var _b = this.props, clickedObject = _b.clickedObject, routePaths = _b.routePaths, actions = _b.actions;
            var displayIndex = currentGroupindex;
            var routeGroupDisplay = true;
            if (clickedObject && routePaths.length > 0) {
                displayIndex = currentGroupindex < (saveRouteGroup.length - 1) ? currentGroupindex + 1 : 0;
                if (displayIndex === 0) {
                    routeGroupDisplay = false;
                }
            }
            if (routeGroupDisplay) {
                actions.setClicked(saveRouteGroup[displayIndex].clickedObject);
                actions.setRoutePaths(saveRouteGroup[displayIndex].routePaths);
            }
            else {
                actions.setClicked(null);
                actions.setRoutePaths([]);
            }
            this.setState({ currentGroupindex: displayIndex, routeGroupDisplay: routeGroupDisplay });
        }
    };
    Controller.prototype.deleteRouteGroup = function () {
        var _a = this.state, currentGroupindex = _a.currentGroupindex, routeGroupDisplay = _a.routeGroupDisplay, saveRouteGroup = _a.saveRouteGroup;
        if (saveRouteGroup.length > 0 && routeGroupDisplay) {
            var newSaveRouteGroup = saveRouteGroup.filter(function (current, index) { return index !== currentGroupindex; });
            this.setState({ currentGroupindex: 0,
                routeGroupDisplay: false,
                saveRouteGroup: newSaveRouteGroup.slice() });
            var _b = this.props, clickedObject = _b.clickedObject, routePaths = _b.routePaths, actions = _b.actions;
            if (clickedObject && routePaths.length > 0) {
                actions.setClicked(null);
                actions.setRoutePaths([]);
            }
        }
    };
    Controller.prototype.render = function () {
        var _a = this.props, settime = _a.settime, timeBegin = _a.timeBegin, timeLength = _a.timeLength, actions = _a.actions, secperhour = _a.secperhour, animatePause = _a.animatePause, animateReverse = _a.animateReverse, getMoveDataChecked = _a.getMoveDataChecked, getMoveOptionChecked = _a.getMoveOptionChecked, getDepotOptionChecked = _a.getDepotOptionChecked, getHeatmapVisible = _a.getHeatmapVisible, getOptionChangeChecked = _a.getOptionChangeChecked, inputFileName = _a.inputFileName, viewport = _a.viewport;
        var _b = this.state, currentGroupindex = _b.currentGroupindex, routeGroupDisplay = _b.routeGroupDisplay, saveRouteGroup = _b.saveRouteGroup;
        var displayIndex = saveRouteGroup.length ? currentGroupindex + 1 : 0;
        var movesFileName = inputFileName.movesFileName, depotsFileName = inputFileName.depotsFileName;
        var nowrapstyle = { textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
        return (React.createElement("div", { className: "harmovis_controller", id: "controller_area" },
            React.createElement("div", { className: "container" },
                React.createElement("ul", { className: "list-group harmovis_controller__list" },
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("label", { htmlFor: "MovesInput", className: "btn btn-outline-light btn-sm w-100" },
                            "\u904B\u884C\u30C7\u30FC\u30BF\u9078\u629E",
                            React.createElement(MovesInput, { actions: actions, id: "MovesInput", style: { display: 'none' } })),
                        React.createElement("div", { style: nowrapstyle }, movesFileName || '選択されていません')),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("label", { htmlFor: "DepotsInput", className: "btn btn-outline-light btn-sm w-100" },
                            "\u505C\u7559\u6240\u30C7\u30FC\u30BF\u9078\u629E",
                            React.createElement(DepotsInput, { actions: actions, id: "DepotsInput", style: { display: 'none' } })),
                        React.createElement("div", { style: nowrapstyle }, depotsFileName || '選択されていません')),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("div", { className: "form-check" },
                            React.createElement("input", { type: "checkbox", id: "MoveDataChecked", onChange: getMoveDataChecked, className: "form-check-input", defaultChecked: true }),
                            React.createElement("label", { htmlFor: "MoveDataChecked", className: "form-check-label" }, "\u904B\u884C\u30C7\u30FC\u30BF\u8868\u793A"))),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("div", { className: "form-check" },
                            React.createElement("input", { type: "checkbox", id: "MoveOptionChecked", onChange: getMoveOptionChecked, className: "form-check-input" }),
                            React.createElement("label", { htmlFor: "MoveOptionChecked", className: "form-check-label" }, "\u904B\u884C\u30C7\u30FC\u30BF\u30AA\u30D7\u30B7\u30E7\u30F3\u8868\u793A"))),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("div", { className: "form-check" },
                            React.createElement("input", { type: "checkbox", id: "DepotOptionChecked", onChange: getDepotOptionChecked, className: "form-check-input" }),
                            React.createElement("label", { htmlFor: "DepotOptionChecked", className: "form-check-label" }, "\u505C\u7559\u6240\u30C7\u30FC\u30BF\u30AA\u30D7\u30B7\u30E7\u30F3\u8868\u793A"))),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("div", { className: "form-check" },
                            React.createElement("input", { type: "checkbox", id: "OptionChangeChecked", onChange: getOptionChangeChecked, className: "form-check-input" }),
                            React.createElement("label", { htmlFor: "OptionChangeChecked", className: "form-check-label" }, "\u30AA\u30D7\u30B7\u30E7\u30F3\u8868\u793A\u30D1\u30BF\u30FC\u30F3\u5207\u66FF"))),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("div", { className: "form-check" },
                            React.createElement("input", { type: "checkbox", id: "HeatmapVisible", onChange: getHeatmapVisible, className: "form-check-input" }),
                            React.createElement("label", { htmlFor: "HeatmapVisible", className: "form-check-label" }, "\u30D2\u30FC\u30C8\u30DE\u30C3\u30D7\u8868\u793A"))),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("span", null, "\u30CA\u30D3\u30B2\u30FC\u30B7\u30E7\u30F3\u30D1\u30CD\u30EB"),
                        React.createElement("div", { className: "btn-group d-flex", role: "group" },
                            React.createElement(NavigationButton, { buttonType: "zoom-in", actions: actions, viewport: viewport, className: "btn btn-outline-light btn-sm w-100" }),
                            React.createElement(NavigationButton, { buttonType: "zoom-out", actions: actions, viewport: viewport, className: "btn btn-outline-light btn-sm w-100" }),
                            React.createElement(NavigationButton, { buttonType: "compass", actions: actions, viewport: viewport, className: "btn btn-outline-light btn-sm w-100" }))),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("span", null, "\u30B3\u30F3\u30C8\u30ED\u30FC\u30EB\u30D1\u30CD\u30EB"),
                        React.createElement("div", { className: "btn-group d-flex", role: "group" },
                            animatePause ?
                                React.createElement(PlayButton, { actions: actions, className: "btn btn-outline-light btn-sm w-100" }) :
                                React.createElement(PauseButton, { actions: actions, className: "btn btn-outline-light btn-sm w-100" }),
                            animateReverse ?
                                React.createElement(ForwardButton, { actions: actions, className: "btn btn-outline-light btn-sm w-100" }) :
                                React.createElement(ReverseButton, { actions: actions, className: "btn btn-outline-light btn-sm w-100" })),
                        React.createElement("div", { className: "btn-group d-flex", role: "group" },
                            React.createElement(AddMinutesButton, { addMinutes: -10, actions: actions, className: "btn btn-outline-light btn-sm w-100" }),
                            React.createElement(AddMinutesButton, { addMinutes: -5, actions: actions, className: "btn btn-outline-light btn-sm w-100" })),
                        React.createElement("div", { className: "btn-group d-flex", role: "group" },
                            React.createElement(AddMinutesButton, { addMinutes: 5, actions: actions, className: "btn btn-outline-light btn-sm w-100" }),
                            React.createElement(AddMinutesButton, { addMinutes: 10, actions: actions, className: "btn btn-outline-light btn-sm w-100" }))),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        "\u518D\u73FE\u4E2D\u65E5\u6642\u00A0",
                        React.createElement(SimulationDateTime, { timeBegin: timeBegin, settime: settime })),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("label", { htmlFor: "ElapsedTimeRange" },
                            "\u7D4C\u904E\u6642\u9593",
                            React.createElement(ElapsedTimeValue, { settime: settime, timeLength: timeLength, actions: actions }),
                            "\u79D2"),
                        React.createElement(ElapsedTimeRange, { settime: settime, timeLength: timeLength, actions: actions, id: "ElapsedTimeRange", className: "form-control-range" })),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("label", { htmlFor: "SpeedRange" },
                            "\u30B9\u30D4\u30FC\u30C9",
                            React.createElement(SpeedValue, { secperhour: secperhour, actions: actions }),
                            "\u79D2/\u6642"),
                        React.createElement(SpeedRange, { secperhour: secperhour, actions: actions, id: "SpeedRange", className: "form-control-range" })),
                    React.createElement("li", { className: "harmovis_controller__list__item" },
                        React.createElement("div", null, "\u7D4C\u8DEF\u64CD\u4F5C"),
                        React.createElement("div", { className: "btn-group d-flex", role: "group" },
                            React.createElement("button", { onClick: this.saveRouteGroup.bind(this), className: "btn btn-outline-light btn-sm w-100" },
                                React.createElement("span", null,
                                    React.createElement(Icon, { icon: icSave }),
                                    "\u00A0SAVE\u00A0",
                                    React.createElement("span", { className: "badge badge-light" }, saveRouteGroup.length))),
                            React.createElement("button", { onClick: this.displayRouteGroup.bind(this), className: "btn btn-outline-light btn-sm w-100" },
                                React.createElement("span", null,
                                    React.createElement(Icon, { icon: icLayers }),
                                    "\u00A0DISPLAY\u00A0",
                                    React.createElement("span", { className: "badge badge-light" }, routeGroupDisplay ? displayIndex : 0)))),
                        React.createElement("div", { className: "btn-group d-flex", role: "group" },
                            React.createElement("button", { onClick: this.clearAllRoute.bind(this), className: "btn btn-outline-light btn-sm w-100" },
                                React.createElement("span", null,
                                    React.createElement(Icon, { icon: icDeleteForever }),
                                    "\u00A0All Clear")),
                            React.createElement("button", { onClick: this.deleteRouteGroup.bind(this), className: "btn btn-outline-light btn-sm w-100" },
                                React.createElement("span", null,
                                    React.createElement(Icon, { icon: icDelete }),
                                    "\u00A0DELETE"))))))));
    };
    return Controller;
}(React.Component));
export default Controller;
//# sourceMappingURL=controller.js.map