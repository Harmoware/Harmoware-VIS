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
import { Container, MovesLayer, DepotsLayer, HarmoVisLayers, connectToHarmowareVis, LoadingIcon } from 'harmoware-vis';
import Controller from '../components/controller';
import * as io from 'socket.io-client';
var MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        var socket = io();
        _this.state = {
            moveDataVisible: true,
            moveOptionVisible: false,
            depotOptionVisible: false,
            heatmapVisible: false,
            optionChange: false,
            popup: [0, 0, '']
        };
        socket.on('connect', function () { console.log("Socket.IO Connected!"); });
        socket.on('event', _this.getEvent.bind(_this));
        socket.on('disconnect', function () { console.log("Socket.IO Disconnected!"); });
        return _this;
    }
    App.prototype.componentWillMount = function () {
        var _a = this.props.actions, setSecPerHour = _a.setSecPerHour, setLeading = _a.setLeading, setTrailing = _a.setTrailing;
        setSecPerHour(3600);
        setLeading(3);
        setTrailing(3);
    };
    App.prototype.getEvent = function (socketData) {
        // console.log('data:'+socketData);
        var _a = this.props, actions = _a.actions, movesbase = _a.movesbase;
        var _b = JSON.parse(socketData), mtype = _b.mtype, id = _b.id, time = _b.time, lat = _b.lat, lon = _b.lon, angle = _b.angle, speed = _b.speed;
        var hit = false;
        var movesbasedata = movesbase.slice();
        var setMovesbase = [];
        for (var i = 0, lengthi = movesbasedata.length; i < lengthi; i += 1) {
            var setMovedata = Object.assign({}, movesbasedata[i]);
            if (mtype === setMovedata.mtype && id === setMovedata.id) {
                hit = true;
                var operation = setMovedata.operation;
                var arrivaltime = time;
                operation.push({
                    elapsedtime: time,
                    position: [lon, lat, 0],
                    angle: angle, speed: speed
                });
                setMovedata = Object.assign({}, setMovedata, { arrivaltime: arrivaltime, operation: operation });
            }
            setMovesbase.push(setMovedata);
        }
        if (!hit) {
            setMovesbase.push({
                mtype: mtype, id: id,
                departuretime: time,
                arrivaltime: time,
                operation: [{
                        elapsedtime: time,
                        position: [lon, lat, 0],
                        angle: angle, speed: speed
                    }]
            });
        }
        actions.updateMovesBase(setMovesbase);
    };
    App.prototype.deleteMovebase = function (maxKeepSecond) {
        var _a = this.props, actions = _a.actions, animatePause = _a.animatePause, movesbase = _a.movesbase, settime = _a.settime;
        var movesbasedata = movesbase.slice();
        var setMovesbase = [];
        var dataModify = false;
        var compareTime = settime - maxKeepSecond;
        for (var i = 0, lengthi = movesbasedata.length; i < lengthi; i += 1) {
            var _b = movesbasedata[i], propsdeparturetime = _b.departuretime, propsoperation = _b.operation;
            var departuretime = propsdeparturetime;
            var startIndex = propsoperation.length;
            for (var j = 0, lengthj = propsoperation.length; j < lengthj; j += 1) {
                if (propsoperation[j].elapsedtime > compareTime) {
                    startIndex = j;
                    departuretime = propsoperation[j].elapsedtime;
                    break;
                }
            }
            if (startIndex === 0) {
                setMovesbase.push(Object.assign({}, movesbasedata[i]));
            }
            else if (startIndex < propsoperation.length) {
                setMovesbase.push(Object.assign({}, movesbasedata[i], {
                    operation: propsoperation.slice(startIndex), departuretime: departuretime
                }));
                dataModify = true;
            }
            else {
                dataModify = true;
            }
        }
        if (dataModify) {
            if (!animatePause) {
                actions.setAnimatePause(true);
            }
            actions.updateMovesBase(setMovesbase);
            if (!animatePause) {
                actions.setAnimatePause(false);
            }
        }
    };
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
            React.createElement(Controller, __assign({}, props, { deleteMovebase: this.deleteMovebase.bind(this), getMoveDataChecked: this.getMoveDataChecked.bind(this), getMoveOptionChecked: this.getMoveOptionChecked.bind(this), getDepotOptionChecked: this.getDepotOptionChecked.bind(this), getOptionChangeChecked: this.getOptionChangeChecked.bind(this) })),
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