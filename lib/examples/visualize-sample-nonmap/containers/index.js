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
import { Container, MovesNonmapLayer, FixedPointLayer, LineMapLayer, HarmoVisNonMapLayers, connectToHarmowareVis, LoadingIcon } from 'harmoware-vis';
import { translate } from 'react-i18next';
import Controller from '../components/controller';
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            popup: [0, 0, '']
        };
        return _this;
    }
    App.prototype.render = function () {
        var _this = this;
        var props = this.props;
        var actions = props.actions, viewport = props.viewport, movedData = props.movedData, movesbase = props.movesbase, depotsData = props.depotsData, linemapData = props.linemapData, routePaths = props.routePaths, clickedObject = props.clickedObject, t = props.t, loading = props.loading;
        var dispLookAt = '';
        if (viewport.lookAt) {
            dispLookAt = viewport.lookAt.join(',');
        }
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
            React.createElement(Controller, __assign({}, props)),
            React.createElement("div", { className: "harmovis_footer" },
                React.createElement("a", { href: "http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html", rel: "noopener noreferrer", target: "_blank" }, t('permission')),
                "\u00A0 lookAt:",
                dispLookAt,
                "\u00A0 distance:",
                viewport.distance,
                "\u00A0 rotationX:",
                viewport.rotationX,
                "\u00A0 rotationY:",
                viewport.rotationY,
                "\u00A0 fov:",
                viewport.fov,
                React.createElement(FPSStats, { isActive: true })),
            React.createElement("div", { className: "harmovis_area" },
                React.createElement(HarmoVisNonMapLayers, { viewport: viewport, actions: actions, layers: [
                        new FixedPointLayer({
                            depotsData: depotsData,
                            onHover: onHover,
                        }),
                        new MovesNonmapLayer({
                            movedData: movedData,
                            movesbase: movesbase,
                            actions: actions,
                            routePaths: routePaths,
                            clickedObject: clickedObject,
                            onHover: onHover,
                        }),
                        new LineMapLayer({
                            linemapData: linemapData,
                            onHover: onHover,
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
export default connectToHarmowareVis(translate()(App));
//# sourceMappingURL=index.js.map