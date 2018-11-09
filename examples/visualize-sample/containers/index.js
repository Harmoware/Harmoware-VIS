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
import { HexagonLayer } from 'deck.gl';
import { FPSStats } from 'react-stats';
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers, connectToHarmowareVis, LoadingIcon } from 'harmoware-vis';
import Controller from '../components/controller';
var MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        _this.state = {
            moveDataVisible: true,
            moveOptionVisible: false,
            depotOptionVisible: false,
            heatmapVisible: false,
            optionChange: false,
            popup: [0, 0, '']
        };
        return _this;
    }
    App.prototype.getMoveDataChecked = function (e) {
        this.setState({ moveDataVisible: e.target.checked });
    };
    App.prototype.getMoveOptionChecked = function (e) {
        this.setState({ moveOptionVisible: e.target.checked });
    };
    App.prototype.getDepotOptionChecked = function (e) {
        this.setState({ depotOptionVisible: e.target.checked });
    };
    App.prototype.getOptionChangeChecked = function (e) {
        this.setState({ optionChange: e.target.checked });
    };
    App.prototype.getHeatmapVisible = function (e) {
        this.setState({ heatmapVisible: e.target.checked });
    };
    App.prototype.render = function () {
        var _this = this;
        var props = this.props;
        var actions = props.actions, lightSettings = props.lightSettings, routePaths = props.routePaths, viewport = props.viewport, loading = props.loading, clickedObject = props.clickedObject, movesbase = props.movesbase, movedData = props.movedData, depotsData = props.depotsData;
        var onHover = function (el) {
            if (el && el.object) {
                var disptext = '';
                var objctlist = Object.entries(el.object);
                for (var i = 0, lengthi = objctlist.length; i < lengthi; i += 1) {
                    var strvalue = objctlist[i][1].toString();
                    disptext += i > 0 ? '\n' : '';
                    disptext += (objctlist[i][0] + ": " + strvalue);
                }
                _this.setState({ popup: [el.x, el.y, disptext] });
            }
            else {
                _this.setState({ popup: [0, 0, ''] });
            }
        };
        return (React.createElement("div", null,
            React.createElement(Controller, __assign({}, props, { getMoveDataChecked: this.getMoveDataChecked.bind(this), getMoveOptionChecked: this.getMoveOptionChecked.bind(this), getDepotOptionChecked: this.getDepotOptionChecked.bind(this), getHeatmapVisible: this.getHeatmapVisible.bind(this), getOptionChangeChecked: this.getOptionChangeChecked.bind(this) })),
            React.createElement("div", { className: "harmovis_footer" },
                React.createElement("a", { href: "http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html", rel: "noopener noreferrer", target: "_blank" }, "\u30B5\u30F3\u30D7\u30EB\u30D7\u30ED\u30B0\u30E9\u30E0\u3067\u300C\u3064\u3064\u3058\u30D0\u30B9\u30ED\u30B1\u30FC\u30B7\u30E7\u30F3WEB API\u300D\u3067\u53D6\u5F97\u3057\u305F\u30C7\u30FC\u30BF\u3092\u4F7F\u7528\u3057\u3066\u3044\u307E\u3059\u3002"),
                "\u00A0 longitude:",
                viewport.longitude,
                "\u00A0 latitude:",
                viewport.latitude,
                "\u00A0 zoom:",
                viewport.zoom,
                "\u00A0 bearing:",
                viewport.bearing,
                "\u00A0 pitch:",
                viewport.pitch,
                React.createElement(FPSStats, { isActive: true })),
            React.createElement("div", { className: "harmovis_area" },
                React.createElement(HarmoVisLayers, { viewport: viewport, actions: actions, mapboxApiAccessToken: MAPBOX_TOKEN, layers: [
                        new DepotsLayer({
                            depotsData: depotsData,
                            lightSettings: lightSettings,
                            optionVisible: this.state.depotOptionVisible,
                            optionChange: this.state.optionChange,
                            onHover: onHover
                        }),
                        new MovesLayer({
                            routePaths: routePaths,
                            movesbase: movesbase,
                            movedData: movedData,
                            clickedObject: clickedObject,
                            actions: actions,
                            lightSettings: lightSettings,
                            visible: this.state.moveDataVisible,
                            optionVisible: this.state.moveOptionVisible,
                            optionChange: this.state.optionChange,
                            onHover: onHover
                        }),
                        new HexagonLayer({
                            id: '3d-heatmap',
                            data: movedData,
                            radius: 100,
                            opacity: 0.5,
                            extruded: true,
                            lightSettings: lightSettings,
                            visible: this.state.heatmapVisible
                        })
                    ] })),
            React.createElement("svg", { width: viewport.width, height: viewport.height, className: "harmovis_overlay" },
                React.createElement("g", { fill: "white", fontSize: "12" }, this.state.popup[2].length > 0 ?
                    this.state.popup[2].split('\n').map(function (value, index) {
                        return React.createElement("text", { x: _this.state.popup[0] + 10, y: _this.state.popup[1] + (index * 12), key: index.toString() }, value);
                    }) : null)),
            React.createElement(LoadingIcon, { loading: loading })));
    };
    return App;
}(Container));
export default connectToHarmowareVis(App);
//# sourceMappingURL=index.js.map