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
import { AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton, ElapsedTimeRange, ElapsedTimeValue, SpeedRange, SpeedValue, NavigationButton } from 'harmoware-vis';
import BusStopInfo from './busstop-info';
import XbandDataInput from './xbanddata-input';
var getXbandLabelBySize = function (xbandCellSize) {
    if (xbandCellSize === 0) {
        return '雨量表示(0)';
    }
    else if (xbandCellSize <= 50) {
        return '雨量表示(1)';
    }
    else if (xbandCellSize <= 100) {
        return '雨量表示(2)';
    }
    else if (xbandCellSize <= 150) {
        return '雨量表示(3)';
    }
    else if (xbandCellSize >= 200) {
        return '雨量表示(4)';
    }
    return '雨量表示(X)';
};
var getNextCellSize = function (xbandCellSize) {
    if (xbandCellSize >= 200) {
        return 0;
    }
    return xbandCellSize + 50;
};
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            filename: '',
        };
        return _this;
    }
    Controller.prototype.onTripSelect = function (e) {
        var answer = e.target.value;
        var actions = this.props.actions;
        actions.setAnswer(answer);
        actions.setupFetch(answer);
        actions.setRoutePaths([]);
        actions.setSelectedBusstop('');
        actions.setHovered(null);
        actions.setClicked(null);
        actions.setAnimatePause(false);
        actions.setAnimateReverse(false);
    };
    Controller.prototype.onBusSelect = function (e) {
        var _a = this.props, actions = _a.actions, movesbase = _a.movesbase, busmovesbasedic = _a.busmovesbasedic;
        var code = e.target.value;
        var movesbaseidx = busmovesbasedic[code];
        var busclass = movesbase[movesbaseidx].busclass;
        var systemcode = busclass.systemcode, direction = busclass.direction, systemname = busclass.systemname, timetable = busclass.timetable;
        var name = systemcode + "-" + direction + " " + timetable + "\u767A " + systemname;
        var memo = '';
        var el = {
            object: { code: code, name: name, memo: memo, movesbaseidx: movesbaseidx },
            layer: { id: 'MovesLayer' }
        };
        actions.updateRoute([el], true);
        actions.setSelectedBus(code);
    };
    Controller.prototype.onBusstopSelect = function (e) {
        var value = e.target.value;
        var _a = this.props, actions = _a.actions, depotsData = _a.depotsData;
        var busstop = depotsData.find(function (busstopElement) {
            if (busstopElement.code === value) {
                return true;
            }
            return false;
        });
        if (!busstop) {
            return;
        }
        actions.setSelectedBusstop(value);
        actions.setViewport({
            longitude: busstop.position[0],
            latitude: busstop.position[1],
            zoom: 16
        });
    };
    Controller.prototype.setDelayRange = function (e) {
        var range = e.target.value;
        var _a = this.props, actions = _a.actions, clickedObject = _a.clickedObject;
        actions.setDelayRange(range);
        actions.updateRoute(clickedObject, false);
    };
    Controller.prototype.setCellSize = function () {
        var _a = this.props, xbandCellSize = _a.xbandCellSize, actions = _a.actions;
        var nextCellSize = getNextCellSize(xbandCellSize);
        actions.setCellSize(nextCellSize);
        if (nextCellSize === 0) {
            actions.setRainfall([]);
        }
    };
    Controller.prototype.handleChangeFile = function (e) {
        var _this = this;
        var _a = this.props, actions = _a.actions, trailing = _a.trailing, defaultZoom = _a.defaultZoom, defaultPitch = _a.defaultPitch;
        var reader = new FileReader();
        var file = e.target.files[0];
        actions.setLoading(true);
        reader.readAsText(file);
        reader.onload = function (ev) {
            var readdata = null;
            try {
                readdata = JSON.parse(reader.result.toString());
            }
            catch (exception) {
                actions.setLoading(false);
                window.alert(exception);
                return;
            }
            var timeBegin = readdata.timeBegin, timeLength = readdata.timeLength, bounds = readdata.bounds, busmovesbase = readdata.busmovesbase, busmovesbasedic = readdata.busmovesbasedic;
            if (!timeBegin || !timeLength || !bounds || !busmovesbase || !busmovesbasedic) {
                actions.setLoading(false);
                window.alert('運行データ形式不正');
                return;
            }
            actions.setAnswer(file.name);
            actions.setBusTripsCsv([]);
            actions.setBusTripIndex({});
            actions.setMovesBase({ timeBegin: timeBegin, timeLength: timeLength, bounds: bounds, movesbase: busmovesbase });
            actions.setBusMovesBaseDic(busmovesbasedic);
            actions.setRoutePaths([]);
            actions.setBusOption({});
            actions.setBsoptFname('');
            actions.setArchBase([]);
            actions.setSelectedBusstop('');
            actions.setHovered(null);
            actions.setClicked(null);
            actions.setAnimatePause(false);
            actions.setAnimateReverse(false);
            _this.setState({ filename: file.name });
            actions.setLoading(false);
        };
    };
    Controller.prototype.render = function () {
        var _a = this.props, answer = _a.answer, settime = _a.settime, timeLength = _a.timeLength, secperhour = _a.secperhour, xbandCellSize = _a.xbandCellSize, selectedBusstop = _a.selectedBusstop, selectedBus = _a.selectedBus, answers = _a.answers, date = _a.date, actions = _a.actions, animatePause = _a.animatePause, animateReverse = _a.animateReverse, xbandFname = _a.xbandFname, getOptionChangeChecked = _a.getOptionChangeChecked, getArchLayerChangeChecked = _a.getArchLayerChangeChecked, viewport = _a.viewport, delayrange = _a.delayrange, depotsData = _a.depotsData, movedData = _a.movedData, busmovesbasedic = _a.busmovesbasedic;
        var xBandViewLabel = getXbandLabelBySize(xbandCellSize);
        var optionsTrip = answers.map(function (ans) { return React.createElement("option", { value: ans, key: ans }, ans); });
        var nowrapstyle = { textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
        return (React.createElement("div", { className: "harmovis_controller container", id: "controller_area" },
            React.createElement("ul", { className: "list-group harmovis_controller__list" },
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("div", { className: "input-group input-group-sm" },
                        React.createElement("label", { htmlFor: "trip_select" }, "\u904B\u884C\u30C7\u30FC\u30BF\u9078\u629E"),
                        React.createElement("select", { className: "w-100", id: "trip_select", value: answer, onChange: this.onTripSelect.bind(this) }, optionsTrip))),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("div", { className: "form-check" },
                        React.createElement("input", { type: "checkbox", id: "OptionChangeChecked", onChange: getOptionChangeChecked, className: "form-check-input" }),
                        React.createElement("label", { htmlFor: "OptionChangeChecked", className: "form-check-label" }, "\u30AA\u30D7\u30B7\u30E7\u30F3\u8868\u793A\u30D1\u30BF\u30FC\u30F3\u5207\u66FF"))),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("div", { className: "form-check" },
                        React.createElement("input", { type: "checkbox", id: "ArchLayerChangeChecked", onChange: getArchLayerChangeChecked, className: "form-check-input" }),
                        React.createElement("label", { htmlFor: "ArchLayerChangeChecked", className: "form-check-label" }, "\u30A2\u30FC\u30C1\u30EC\u30A4\u30E4\u8868\u793A\u5207\u66FF"))),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("div", { className: "input-group input-group-sm" },
                        React.createElement("label", { htmlFor: "MovesInput", className: "harmovis_button" },
                            "\u904B\u884C\u30C7\u30FC\u30BF\u9078\u629E",
                            React.createElement("input", { type: "file", accept: ".json", onChange: this.handleChangeFile.bind(this), id: "MovesInput", style: { display: 'none' } })),
                        React.createElement("div", { style: nowrapstyle }, this.state.filename))),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    animatePause ?
                        React.createElement(PlayButton, { actions: actions }, "\u23EF\uFE0F \u3000\u958B\u59CB\u3000") :
                        React.createElement(PauseButton, { actions: actions }, "\u23EF\uFE0F \u4E00\u6642\u505C\u6B62"),
                    "\u00A0",
                    animateReverse ?
                        React.createElement(ForwardButton, { actions: actions }, "\u25B6\uFE0F \u6B63\u518D\u751F") :
                        React.createElement(ReverseButton, { actions: actions }, "\u25C0\uFE0F \u9006\u518D\u751F")),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement(AddMinutesButton, { addMinutes: -10, actions: actions }, "\u23EE -10\u5206"),
                    "\u00A0",
                    React.createElement(AddMinutesButton, { addMinutes: -5, actions: actions }, "\u23EE -5\u5206")),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement(AddMinutesButton, { addMinutes: 5, actions: actions }, "5\u5206 \u23ED"),
                    "\u00A0",
                    React.createElement(AddMinutesButton, { addMinutes: 10, actions: actions }, "10\u5206 \u23ED")),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement(NavigationButton, { buttonType: "zoom-in", actions: actions, viewport: viewport }),
                    "\u00A0",
                    React.createElement(NavigationButton, { buttonType: "zoom-out", actions: actions, viewport: viewport }),
                    "\u00A0",
                    React.createElement(NavigationButton, { buttonType: "compass", actions: actions, viewport: viewport })),
                React.createElement("li", null,
                    React.createElement("label", { htmlFor: "ElapsedTimeRange" },
                        "\u7D4C\u904E\u6642\u9593",
                        React.createElement(ElapsedTimeValue, { settime: settime, timeLength: timeLength, actions: actions }),
                        "\u79D2"),
                    React.createElement(ElapsedTimeRange, { settime: settime, timeLength: timeLength, actions: actions, id: "ElapsedTimeRange" })),
                React.createElement("li", null,
                    React.createElement("label", { htmlFor: "SpeedRange" },
                        "\u30B9\u30D4\u30FC\u30C9",
                        React.createElement(SpeedValue, { secperhour: secperhour, actions: actions }),
                        "\u79D2/\u6642"),
                    React.createElement(SpeedRange, { secperhour: secperhour, actions: actions, id: "SpeedRange" })),
                React.createElement("li", null,
                    React.createElement("label", { htmlFor: "delayrange" },
                        "\u9045\u5EF6\u5EA6LV\u00A00\uFF5E",
                        delayrange,
                        "\u00A0\u5206"),
                    React.createElement("input", { type: "range", value: delayrange, min: "1", max: "120", step: "1", onChange: this.setDelayRange.bind(this), id: "delayrange", className: "harmovis_input_range" })),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("div", { className: "input-group input-group-sm" },
                        React.createElement("button", { onClick: this.setCellSize.bind(this), className: "harmovis_button" }, xBandViewLabel),
                        React.createElement("div", { style: nowrapstyle }, xbandCellSize ? xbandFname : ''))),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement(XbandDataInput, { actions: actions })),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("div", { className: "input-group input-group-sm" },
                        React.createElement("label", { htmlFor: "busstop_select" }, "\u30D0\u30B9\u505C\u691C\u7D22"),
                        React.createElement("select", { className: "w-100", id: "busstop_select", value: selectedBusstop, onChange: this.onBusstopSelect.bind(this) },
                            React.createElement("option", { value: "" }, "0000 \u30D0\u30B9\u505C\u3092\u9078\u629E"),
                            depotsData.map(function (busstop) { return React.createElement("option", { value: busstop.code, key: busstop.code },
                                busstop.code,
                                " ",
                                busstop.name); })))),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement(BusStopInfo, { selectedBusstop: selectedBusstop, date: date, depotsData: depotsData })),
                React.createElement("li", { className: "harmovis_controller__list__item" }, animatePause && Object.keys(busmovesbasedic).length > 0 &&
                    React.createElement("div", { className: "input-group input-group-sm" },
                        React.createElement("label", { htmlFor: "bus_select" }, "\u904B\u884C\u4E2D\u30D0\u30B9\u9078\u629E"),
                        React.createElement("select", { className: "w-100", id: "bus_select", value: selectedBus, onChange: this.onBusSelect.bind(this) }, movedData.map(function (bus) { return React.createElement("option", { value: bus.code, key: bus.code }, bus.code + ":" + bus.name.split(' ')[0] + " " + bus.name.split(' ')[1]); })))))));
    };
    return Controller;
}(React.Component));
export default Controller;
//# sourceMappingURL=controller.js.map