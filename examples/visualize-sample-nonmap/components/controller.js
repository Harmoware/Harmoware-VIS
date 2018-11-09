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
import { ic_play_circle_outline as icPlayArrow, ic_pause_circle_outline as icPause, ic_forward as icForward, ic_replay as icReplay, ic_fast_forward as icFastForward, ic_fast_rewind as icFastRewind } from 'react-icons-kit/md';
import { MovesInput, DepotsInput, LinemapInput, AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton, ElapsedTimeRange, ElapsedTimeValue, SpeedRange, SpeedValue, SimulationDateTime, NavigationButton } from 'harmoware-vis';
import i18n from '../locales/I18n';
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Controller.prototype.onLanguageSelect = function (e) {
        var value = e.target.value;
        i18n.changeLanguage(value);
    };
    Controller.prototype.render = function () {
        var _a = this.props, settime = _a.settime, timeBegin = _a.timeBegin, timeLength = _a.timeLength, actions = _a.actions, secperhour = _a.secperhour, animatePause = _a.animatePause, animateReverse = _a.animateReverse, t = _a.t, viewport = _a.viewport;
        return (React.createElement("div", { className: "harmovis_controller", id: "controller_area" },
            React.createElement("ul", { className: "harmovis_controller__list" },
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("select", { className: "harmovis_controller__select", id: "language_select", value: t('langId'), onChange: this.onLanguageSelect.bind(this) },
                        React.createElement("option", { value: "ja" }, "\u65E5\u672C\u8A9E"),
                        React.createElement("option", { value: "en" }, "English"))),
                React.createElement("hr", null),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("span", { className: "harmovis_controller__spacer" }, t('movedData')),
                    React.createElement(MovesInput, { actions: actions, className: "caInput" })),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("span", { className: "harmovis_controller__spacer" }, t('depotsData')),
                    React.createElement(DepotsInput, { actions: actions, className: "caInput" })),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("span", { className: "harmovis_controller__spacer" }, t('mapData')),
                    React.createElement(LinemapInput, { actions: actions, className: "caInput" })),
                React.createElement("hr", null),
                React.createElement("li", { className: "harmovis_controller__list__button" },
                    animatePause ?
                        React.createElement(PlayButton, { actions: actions, className: "caButton" },
                            React.createElement("span", null,
                                React.createElement(Icon, { icon: icPlayArrow }),
                                "\u00A0",
                                t('play'))) :
                        React.createElement(PauseButton, { actions: actions, className: "caButton" },
                            React.createElement("span", null,
                                React.createElement(Icon, { icon: icPause }),
                                "\u00A0",
                                t('pause'))),
                    animateReverse ?
                        React.createElement(ForwardButton, { actions: actions, className: "caButton" },
                            React.createElement("span", null,
                                React.createElement(Icon, { icon: icForward }),
                                "\u00A0",
                                t('forward'))) :
                        React.createElement(ReverseButton, { actions: actions, className: "caButton" },
                            React.createElement("span", null,
                                React.createElement(Icon, { icon: icReplay }),
                                "\u00A0",
                                t('reverse')))),
                React.createElement("li", { className: "harmovis_controller__list__button" },
                    React.createElement(AddMinutesButton, { addMinutes: -10, actions: actions, className: "caButton" },
                        React.createElement("span", null,
                            React.createElement(Icon, { icon: icFastRewind }),
                            "\u00A0-10",
                            t('minute'))),
                    React.createElement(AddMinutesButton, { addMinutes: -5, actions: actions, className: "caButton" },
                        React.createElement("span", null,
                            React.createElement(Icon, { icon: icFastRewind }),
                            "\u00A0-5",
                            t('minute'))),
                    React.createElement(AddMinutesButton, { addMinutes: 5, actions: actions, className: "caButton" },
                        React.createElement("span", null,
                            React.createElement(Icon, { icon: icFastForward }),
                            "\u00A05",
                            t('minute'))),
                    React.createElement(AddMinutesButton, { addMinutes: 10, actions: actions, className: "caButton" },
                        React.createElement("span", null,
                            React.createElement(Icon, { icon: icFastForward }),
                            "\u00A010",
                            t('minute')))),
                React.createElement("li", { className: "harmovis_controller__list__button" },
                    React.createElement(NavigationButton, { buttonType: "zoom-in", actions: actions, viewport: viewport, className: "caButton" }),
                    React.createElement(NavigationButton, { buttonType: "zoom-out", actions: actions, viewport: viewport, className: "caButton" }),
                    React.createElement(NavigationButton, { buttonType: "compass", actions: actions, viewport: viewport, className: "caButton" })),
                React.createElement("hr", null),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement(SimulationDateTime, { timeBegin: timeBegin, settime: settime, locales: t('locales'), className: "caSpan" })),
                React.createElement("hr", null),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("span", { className: "harmovis_controller__spacer" },
                        t('elapsedTime'),
                        React.createElement(ElapsedTimeValue, { settime: settime, timeLength: timeLength, actions: actions }),
                        t('sec')),
                    React.createElement(ElapsedTimeRange, { settime: settime, timeLength: timeLength, actions: actions, className: "caRange" })),
                React.createElement("hr", null),
                React.createElement("li", { className: "harmovis_controller__list__item" },
                    React.createElement("span", { className: "harmovis_controller__spacer" },
                        t('speed'),
                        React.createElement(SpeedValue, { secperhour: secperhour, actions: actions }),
                        t('sec'),
                        "/",
                        t('hour')),
                    React.createElement(SpeedRange, { secperhour: secperhour, actions: actions, className: "caRange" })))));
    };
    return Controller;
}(React.Component));
export default Controller;
//# sourceMappingURL=controller.js.map