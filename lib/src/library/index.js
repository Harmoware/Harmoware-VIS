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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { connect } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import * as Actions from '../actions';
import reducers from '../reducers';
import { COLOR1 } from '../constants/settings';
var getAverage = function (array) { return array.length &&
    array.reduce(function (previous, current) { return previous + current; }) / array.length; };
var radians = function (degree) { return degree * Math.PI / 180; };
var degrees = function (radian) { return radian * 180 / Math.PI; };
export var getContainerProp = function (state) {
    var prop = {};
    Object.keys(state).forEach(function (key) {
        prop = Object.assign({}, prop, __assign({}, state[key]));
    });
    return prop;
};
// LoopTime とは１ループにかける時間（ミリ秒）
export var calcLoopTime = function (timeLength, secperhour) { return (timeLength / 3600) * 1000 * secperhour; };
export var analyzeMovesBase = function (inputData) {
    var baseTimeBegin;
    var baseTimeLength;
    var baseBounds;
    var basemovesbase;
    if (Array.isArray(inputData)) { // Array?
        basemovesbase = __spreadArrays(inputData);
    }
    else {
        baseTimeBegin = inputData.timeBegin;
        baseTimeLength = inputData.timeLength;
        baseBounds = inputData.bounds;
        basemovesbase = __spreadArrays(inputData.movesbase);
    }
    var timeBegin = typeof baseTimeBegin === 'number' ? baseTimeBegin : 0;
    var timeLength = typeof baseTimeLength === 'number' ? baseTimeLength : 0;
    var bounds = typeof baseBounds !== 'undefined' ? baseBounds : {
        westlongitiude: 0, eastlongitiude: 0, southlatitude: 0, northlatitude: 0
    };
    var movesbase = basemovesbase;
    if (movesbase.length <= 0) {
        return { timeBegin: timeBegin, timeLength: timeLength, bounds: bounds, movesbase: movesbase, viewport: {} };
    }
    var timeEnd = 0;
    var longArray = [];
    var latiArray = [];
    for (var i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
        var _a = movesbase[i], departuretime = _a.departuretime, arrivaltime = _a.arrivaltime, operation = _a.operation;
        movesbase[i].movesbaseidx = i;
        if (typeof baseTimeBegin !== 'number' || typeof baseTimeLength !== 'number') {
            timeBegin = !timeBegin ? departuretime : Math.min(timeBegin, departuretime);
            timeEnd = !timeEnd ? arrivaltime : Math.max(timeEnd, arrivaltime);
        }
        for (var j = 0, lengthj = operation.length; j < lengthj; j += 1) {
            var _b = operation[j], longitude = _b.longitude, latitude = _b.latitude, _c = _b.position, position = _c === void 0 ? [longitude, latitude, 3] : _c;
            if (typeof operation[j].position === 'undefined') {
                operation[j].position = position;
            }
            longArray.push(+position[0]);
            latiArray.push(+position[1]);
            if (!baseBounds && position[0] && position[1]) {
                var _d = bounds || null, eastlongitiude = _d.eastlongitiude, westlongitiude = _d.westlongitiude, southlatitude = _d.southlatitude, northlatitude = _d.northlatitude;
                eastlongitiude = !eastlongitiude ? position[0] : Math.max(eastlongitiude, position[0]);
                westlongitiude = !westlongitiude ? position[0] : Math.min(westlongitiude, position[0]);
                southlatitude = !southlatitude ? position[1] : Math.min(southlatitude, position[1]);
                northlatitude = !northlatitude ? position[1] : Math.max(northlatitude, position[1]);
                bounds = { eastlongitiude: eastlongitiude, westlongitiude: westlongitiude, southlatitude: southlatitude, northlatitude: northlatitude };
            }
        }
        var direction = 0;
        for (var j = 0, lengthj = operation.length; j < (lengthj - 1); j += 1) {
            var sourcePosition = operation[j].position;
            var targetPosition = operation[j + 1].position;
            if (sourcePosition[0] === targetPosition[0] && sourcePosition[1] === targetPosition[1]) {
                operation[j].direction = direction;
                continue;
            }
            var x1 = radians(sourcePosition[0]);
            var y1 = radians(sourcePosition[1]);
            var x2 = radians(targetPosition[0]);
            var y2 = radians(targetPosition[1]);
            var deltax = x2 - x1;
            direction = degrees(Math.atan2(Math.sin(deltax), Math.cos(y1) * Math.tan(y2) - Math.sin(y1) * Math.cos(deltax))) % 360;
            operation[j].direction = direction;
        }
    }
    if (typeof baseTimeBegin !== 'number' || typeof baseTimeLength !== 'number') {
        timeLength = timeEnd - timeBegin;
    }
    else {
        for (var k = 0, lengthk = movesbase.length; k < lengthk; k += 1) {
            movesbase[k].departuretime += timeBegin;
            movesbase[k].arrivaltime += timeBegin;
            var operation = movesbase[k].operation;
            for (var l = 0, lengthl = operation.length; l < lengthl; l += 1) {
                operation[l].elapsedtime += timeBegin;
            }
        }
    }
    var viewport = {
        longitude: getAverage(longArray), latitude: getAverage(latiArray),
    };
    return { timeBegin: timeBegin, timeLength: timeLength, bounds: bounds, movesbase: movesbase, viewport: viewport };
};
var defDepotsOptionFunc = function (props, idx) {
    var _a = props.depotsBase[idx], position = _a.position, longitude = _a.longitude, latitude = _a.latitude, retValue = __rest(_a, ["position", "longitude", "latitude"]);
    return retValue;
};
export var getDepots = function (props) {
    var depotsBase = props.depotsBase, bounds = props.bounds, getDepotsOptionFunc = props.getDepotsOptionFunc;
    var depotsData = [];
    var getOptionFunction = getDepotsOptionFunc || defDepotsOptionFunc;
    var areadepots = depotsBase.filter(function (data) {
        if (bounds.westlongitiude === 0 && bounds.eastlongitiude === 0 &&
            bounds.southlatitude === 0 && bounds.northlatitude === 0) {
            return true;
        }
        var longitude = data.longitude, latitude = data.latitude, _a = data.position, position = _a === void 0 ? [longitude, latitude, 1] : _a;
        return (bounds.westlongitiude <= position[0] && position[0] <= bounds.eastlongitiude &&
            bounds.southlatitude <= position[1] && position[1] <= bounds.northlatitude);
    });
    if (areadepots.length > 0 && typeof bounds !== 'undefined' && Object.keys(bounds).length > 0) {
        for (var i = 0, lengthi = areadepots.length; i < lengthi; i += 1) {
            var _a = areadepots[i], longitude = _a.longitude, latitude = _a.latitude, _b = _a.position, position = _b === void 0 ? [longitude, latitude, 1] : _b;
            depotsData.push(__assign({ longitude: position[0], latitude: position[1], position: position }, getOptionFunction(props, i)));
        }
    }
    return depotsData;
};
var defMovesOptionFunc = function (props, idx1, idx2) {
    var _a = props.movesbase[idx1], departuretime = _a.departuretime, arrivaltime = _a.arrivaltime, operation = _a.operation, type = _a.type, retValue1 = __rest(_a, ["departuretime", "arrivaltime", "operation", "type"]);
    var _b = operation[idx2], elapsedtime = _b.elapsedtime, position = _b.position, longitude = _b.longitude, latitude = _b.latitude, retValue2 = __rest(_b, ["elapsedtime", "position", "longitude", "latitude"]);
    return Object.assign(retValue1, retValue2);
};
export var getMoveObjects = function (props) {
    var movesbase = props.movesbase, prevMovedData = props.movedData, settime = props.settime, secperhour = props.secperhour, timeBegin = props.timeBegin, timeLength = props.timeLength, getMovesOptionFunc = props.getMovesOptionFunc;
    if (prevMovedData.length > 0) {
        if (Math.abs(prevMovedData[0].settime - settime) <= 1 / (secperhour / 120))
            return prevMovedData;
    }
    var getOptionFunction = getMovesOptionFunc || defMovesOptionFunc;
    var selectmovesbase = movesbase.filter(function (data) {
        var departuretime = data.departuretime, arrivaltime = data.arrivaltime;
        return (timeBegin > 0 && timeLength > 0 && departuretime <= settime && settime < arrivaltime);
    });
    var movedData = new Array(selectmovesbase.length);
    for (var i = 0, lengthi = selectmovesbase.length; i < lengthi; i += 1) {
        var _a = selectmovesbase[i], operation = _a.operation, movesbaseidx = _a.movesbaseidx, type = _a.type;
        for (var j = 0, lengthj = operation.length; j < lengthj - 1; j += 1) {
            var elapsedtime = operation[j].elapsedtime;
            var nextelapsedtime = operation[j + 1].elapsedtime;
            if (elapsedtime <= settime && settime < nextelapsedtime) {
                var _b = operation[j], _c = _b.position, longitude = _c[0], latitude = _c[1], elevation = _c[2], _d = _b.color, color = _d === void 0 ? COLOR1 : _d, _e = _b.direction, direction = _e === void 0 ? 0 : _e;
                var _f = operation[j + 1], _g = _f.position, nextlongitude = _g[0], nextlatitude = _g[1], nextelevation = _g[2], _h = _f.color, nextcolor = _h === void 0 ? COLOR1 : _h;
                var pos_rate = [longitude, latitude, elevation];
                var rate = (settime - elapsedtime) / (nextelapsedtime - elapsedtime);
                pos_rate[0] -= (longitude - nextlongitude) * rate;
                pos_rate[1] -= (latitude - nextlatitude) * rate;
                pos_rate[2] -= (elevation - nextelevation) * rate;
                movedData[i] = Object.assign(new Object(), {
                    settime: settime,
                    longitude: pos_rate[0],
                    latitude: pos_rate[1],
                    position: pos_rate,
                    sourcePosition: [longitude, latitude, elevation],
                    targetPosition: [nextlongitude, nextlatitude, nextelevation],
                    direction: direction,
                    sourceColor: color,
                    targetColor: nextcolor,
                    movesbaseidx: movesbaseidx
                }, getOptionFunction(props, movesbaseidx, j));
                if (type)
                    movedData[i].type = type;
                break;
            }
        }
    }
    return movedData;
};
var routeDelete = function (movesbaseidx, props) {
    var actions = props.actions, clickedObject = props.clickedObject, routePaths = props.routePaths;
    if (clickedObject.length > 0 && routePaths.length > 0) {
        if (clickedObject.length === 1) {
            actions.setClicked(null);
            actions.setRoutePaths([]);
        }
        else {
            var newClickedObject = clickedObject.filter(function (current) { return current.object.movesbaseidx !== movesbaseidx; });
            actions.setClicked(newClickedObject);
            var newRoutePaths = routePaths.filter(function (current) { return current.movesbaseidx !== movesbaseidx; });
            actions.setRoutePaths(newRoutePaths);
        }
    }
};
export var onHoverClick = function (pickParams, getRouteColor, getRouteWidth) {
    var mode = pickParams.mode, info = pickParams.info;
    var object = info.object, layer = info.layer;
    var id = layer.id, props = layer.props;
    if (mode === 'hover' && props.onHover) {
        props.onHover(info);
    }
    if (mode === 'click' || mode === 'query') {
        if (props.onClick) {
            props.onClick(info);
        }
        else if (object && props.actions) {
            var movesbaseidx = object.movesbaseidx;
            var actions = props.actions, clickedObject = props.clickedObject, movesbase = props.movesbase, routePaths = props.routePaths;
            var deleted = false;
            if (clickedObject && clickedObject.length > 0) {
                for (var i = 0, lengthi = clickedObject.length; i < lengthi; i += 1) {
                    if (clickedObject[i].object.movesbaseidx === movesbaseidx) {
                        deleted = true;
                        break;
                    }
                }
            }
            if (deleted) {
                routeDelete(movesbaseidx, props);
            }
            else {
                var newClickedObject = clickedObject || [];
                newClickedObject.push({ object: object, layer: { id: id } });
                var setRoutePaths = [];
                var operation = movesbase[movesbaseidx].operation;
                for (var j = 0; j < (operation.length - 1); j += 1) {
                    var position = operation[j].position;
                    var routeColor = getRouteColor(operation[j]);
                    var routeWidth = getRouteWidth(operation[j]);
                    var nextposition = operation[j + 1].position;
                    setRoutePaths.push({
                        movesbaseidx: movesbaseidx,
                        sourcePosition: position,
                        targetPosition: nextposition,
                        routeColor: routeColor || COLOR1,
                        routeWidth: routeWidth || 10,
                    });
                }
                actions.setClicked(newClickedObject);
                actions.setRoutePaths(__spreadArrays(routePaths, setRoutePaths));
            }
        }
    }
};
export var checkClickedObjectToBeRemoved = function (movedData, clickedObject, routePaths, actions) {
    if (clickedObject && clickedObject.length > 0 && routePaths.length > 0) {
        for (var i = 0, lengthi = clickedObject.length; i < lengthi; i += 1) {
            var deleted = true;
            for (var j = 0, lengthj = movedData.length; j < lengthj; j += 1) {
                if (clickedObject[i].object.movesbaseidx === movedData[j].movesbaseidx) {
                    deleted = false;
                    break;
                }
            }
            if (deleted) {
                routeDelete(clickedObject[i].object.movesbaseidx, { routePaths: routePaths, clickedObject: clickedObject, actions: actions });
            }
        }
    }
};
export var defaultMapStateToProps = function (state) { return getContainerProp(state); };
export var connectToHarmowareVis = function (App, moreActions, mapStateToProps) {
    if (moreActions === void 0) { moreActions = null; }
    if (mapStateToProps === void 0) { mapStateToProps = defaultMapStateToProps; }
    var extendedActions = Object.assign({}, Actions, moreActions);
    function mapDispatchToProps(dispatch) {
        return { actions: bindActionCreators(extendedActions, dispatch) };
    }
    return connect(mapStateToProps, mapDispatchToProps)(App);
};
export var getCombinedReducer = function (combined) {
    return combineReducers(__assign({ base: reducers }, combined));
};
//# sourceMappingURL=index.js.map