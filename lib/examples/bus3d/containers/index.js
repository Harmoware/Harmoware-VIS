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
import { FPSStats } from 'react-stats';
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers, connectToHarmowareVis, settings, LoadingIcon } from 'harmoware-vis';
import { translate } from 'react-i18next';
import DepotsArcLayer from '../layers/depots-arc-layer';
import XbandmeshLayer from '../layers/xbandmesh-layer';
import Header from '../components/header';
import Controller from '../components/controller';
import InteractionLayer from '../components/interaction-layer';
import * as moreActions from '../actions';
import { getBusOptionValue, getBusstopOptionValue, updateArcLayerData } from '../library';
var MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
var COLOR1 = settings.COLOR1;
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        var actions = props.actions;
        actions.initializeFetch('datalist.json');
        actions.setMovesOptionFunc(getBusOptionValue);
        actions.setDepotsOptionFunc(getBusstopOptionValue);
        _this.state = {
            optionChange: false,
            archLayerChange: false,
            arcdata: []
        };
        return _this;
    }
    App.prototype.getOptionChangeChecked = function (e) {
        this.setState({ optionChange: e.target.checked });
    };
    App.prototype.getArchLayerChangeChecked = function (e) {
        this.setState({ archLayerChange: e.target.checked });
    };
    App.prototype.componentWillReceiveProps = function (nextProps) {
        var actions = nextProps.actions, settime = nextProps.settime, xbandCellSize = nextProps.xbandCellSize, answer = nextProps.answer, xbandFname = nextProps.xbandFname;
        actions.updateRainfall(settime, xbandCellSize, answer, xbandFname);
        this.setState({ arcdata: updateArcLayerData(nextProps) });
    };
    App.prototype.render = function () {
        var props = this.props;
        var actions = props.actions, settime = props.settime, elevationScale = props.elevationScale, selectedBusstop = props.selectedBusstop, rainfall = props.rainfall, t = props.t, lightSettings = props.lightSettings, routePaths = props.routePaths, xbandCellSize = props.xbandCellSize, viewport = props.viewport, hovered = props.hovered, clickedObject = props.clickedObject, busoption = props.busoption, movesbase = props.movesbase, movedData = props.movedData, depotsData = props.depotsData, loading = props.loading;
        var onHover = function (event) { return actions.setHovered(event); };
        var onClickBus = function (el) {
            var _a = el.object, movesbaseidx = _a.movesbaseidx, code = _a.code;
            if (clickedObject && clickedObject[0].object.movesbaseidx === movesbaseidx) {
                actions.setClicked(null);
                actions.setRoutePaths([]);
            }
            else {
                actions.updateRoute([el], true);
                actions.setSelectedBus(code);
            }
        };
        var onClickBusstop = function (el) {
            var code = el.object.code;
            if (selectedBusstop.length > 0 && selectedBusstop === code) {
                actions.setSelectedBusstop('');
            }
            else {
                actions.setSelectedBusstop(code);
            }
        };
        var date = settime * 1000;
        return (React.createElement("div", null,
            React.createElement(Header, __assign({}, props)),
            React.createElement(Controller, __assign({}, props, { date: date, getOptionChangeChecked: this.getOptionChangeChecked.bind(this), getArchLayerChangeChecked: this.getArchLayerChangeChecked.bind(this) })),
            React.createElement("div", { className: "harmovis_footer" },
                React.createElement("a", { href: "http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html", rel: "noopener noreferrer", target: "_blank" }, t('permission')),
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
                        new XbandmeshLayer({
                            lightSettings: lightSettings,
                            rainfall: rainfall,
                            layerCellSize: xbandCellSize
                        }),
                        new DepotsLayer({
                            depotsData: depotsData,
                            lightSettings: lightSettings,
                            optionElevationScale: elevationScale,
                            optionVisible: 'busstopsoption' in busoption,
                            optionChange: this.state.optionChange,
                            onHover: onHover,
                            onClick: onClickBusstop
                        }),
                        new MovesLayer({
                            routePaths: routePaths,
                            movesbase: movesbase,
                            movedData: movedData,
                            clickedObject: clickedObject,
                            actions: actions,
                            lightSettings: lightSettings,
                            optionElevationScale: elevationScale,
                            optionVisible: 'busmovesoption' in busoption,
                            optionChange: this.state.optionChange,
                            onHover: onHover,
                            onClick: onClickBus
                        }),
                        new DepotsArcLayer({
                            id: 'arch-layer',
                            data: this.state.arcdata,
                            visible: !this.state.archLayerChange,
                            pickable: true,
                            getSourcePosition: function (d) { return d.sourcePosition; },
                            getTargetPosition: function (d) { return d.targetPosition; },
                            getSourceColor: function (d) { return d.sourceColor || d.color || COLOR1; },
                            getTargetColor: function (d) { return d.targetColor || d.color || COLOR1; },
                            getStrokeWidths: function (d) { return d.strokeWidth || 1; },
                            onHover: onHover
                        })
                    ] }),
                React.createElement(InteractionLayer, { viewport: viewport, hovered: hovered }),
                React.createElement(LoadingIcon, { loading: loading }))));
    };
    return App;
}(Container));
export default connectToHarmowareVis(translate()(App), translate()(moreActions));
//# sourceMappingURL=index.js.map