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
var assign = Object.assign, keys = Object.keys;
var pi = Math.PI, min = Math.min, max = Math.max, abs = Math.abs, sin = Math.sin, cos = Math.cos, tan = Math.tan, atan2 = Math.atan2;
var isArray = Array.isArray;
var getAverage = function (array) { return array.length &&
    array.reduce(function (previous, current) { return previous + current; }) / array.length; };
var radians = function (degree) { return degree * pi / 180; };
var degrees = function (radian) { return radian * 180 / pi; };
export var getContainerProp = function (state) {
    var prop = {};
    keys(state).forEach(function (key) {
        prop = assign({}, prop, __assign({}, state[key]));
    });
    return prop;
};
export var analyzeMovesBase = function (inputData) {
    var baseTimeBegin;
    var baseTimeLength;
    var baseBounds;
    var basemovesbase;
    var elapsedtimeMode;
    if (isArray(inputData)) { // Array?
        basemovesbase = __spreadArrays(inputData);
    }
    else {
        baseTimeBegin = inputData.timeBegin;
        baseTimeLength = inputData.timeLength;
        baseBounds = inputData.bounds;
        basemovesbase = __spreadArrays(inputData.movesbase);
        elapsedtimeMode = inputData.elapsedtimeMode;
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
    if (typeof baseTimeBegin !== 'number') {
        timeBegin = undefined;
    }
    var timeEnd = undefined;
    var longArray = [];
    var latiArray = [];
    for (var i = 0, lengthi = movesbase.length; i < lengthi; i = (i + 1) | 0) {
        var operation = movesbase[i].operation;
        if (!operation || operation.length === 0) {
            console.log('movesbase[' + i + '] operation undefined');
        }
        for (var j = 0, lengthj = operation.length; j < lengthj; j = (j + 1) | 0) {
            var _a = operation[j], longitude = _a.longitude, latitude = _a.latitude, _b = _a.position, position = _b === void 0 ? [longitude, latitude, 3] : _b, elapsedtime = _a.elapsedtime;
            if (typeof elapsedtime !== 'number') {
                console.log('movesbase[' + i + '] operation[' + j + '] elapsedtime undefined');
                continue;
            }
            if ((typeof operation[j].longitude !== 'number' || typeof operation[j].latitude !== 'number') &&
                typeof operation[j].position === 'undefined') {
                continue;
            }
            if (typeof operation[j].position === 'undefined') {
                operation[j].position = position;
            }
            longArray.push(+position[0]);
            latiArray.push(+position[1]);
            if (!baseBounds && position[0] && position[1]) {
                var _c = bounds || null, eastlongitiude = _c.eastlongitiude, westlongitiude = _c.westlongitiude, southlatitude = _c.southlatitude, northlatitude = _c.northlatitude;
                eastlongitiude = !eastlongitiude ? position[0] : max(eastlongitiude, position[0]);
                westlongitiude = !westlongitiude ? position[0] : min(westlongitiude, position[0]);
                southlatitude = !southlatitude ? position[1] : min(southlatitude, position[1]);
                northlatitude = !northlatitude ? position[1] : max(northlatitude, position[1]);
                bounds = { eastlongitiude: eastlongitiude, westlongitiude: westlongitiude, southlatitude: southlatitude, northlatitude: northlatitude };
            }
        }
        operation.sort(function (a, b) { return a.elapsedtime - b.elapsedtime; });
        movesbase[i].departuretime = operation[0].elapsedtime;
        movesbase[i].arrivaltime = operation[(operation.length - 1) | 0].elapsedtime;
        movesbase[i].movesbaseidx = i;
        if (typeof baseTimeBegin !== 'number' || typeof baseTimeLength !== 'number') {
            timeBegin = timeBegin === undefined ? movesbase[i].departuretime : min(timeBegin, movesbase[i].departuretime);
            timeEnd = timeEnd === undefined ? movesbase[i].arrivaltime : max(timeEnd, movesbase[i].arrivaltime);
        }
        var direction = 0;
        var _loop_1 = function (j, lengthj) {
            var elapsedtime = operation[j].elapsedtime;
            var findIndex = operation.findIndex(function (data) { return data.elapsedtime > elapsedtime; });
            var nextidx = findIndex < 0 ? (j + 1) | 0 : findIndex;
            if (typeof operation[j].position === 'undefined' ||
                typeof operation[nextidx].position === 'undefined') {
                return "continue";
            }
            var sourcePosition = operation[j].position;
            var targetPosition = operation[nextidx].position;
            if (sourcePosition[0] === targetPosition[0] && sourcePosition[1] === targetPosition[1]) {
                operation[j].direction = direction;
                return "continue";
            }
            var x1 = radians(sourcePosition[0]);
            var y1 = radians(sourcePosition[1]);
            var x2 = radians(targetPosition[0]);
            var y2 = radians(targetPosition[1]);
            var deltax = x2 - x1;
            direction = degrees(atan2(sin(deltax), cos(y1) * tan(y2) - sin(y1) * cos(deltax))) % 360;
            operation[j].direction = direction;
        };
        for (var j = 0, lengthj = operation.length; j < (lengthj - 1); j = (j + 1) | 0) {
            _loop_1(j, lengthj);
        }
    }
    if (typeof baseTimeBegin !== 'number' || typeof baseTimeLength !== 'number') {
        timeLength = timeEnd - timeBegin;
    }
    else {
        if (!elapsedtimeMode || elapsedtimeMode !== 'UNIXTIME') {
            for (var _i = 0, movesbase_1 = movesbase; _i < movesbase_1.length; _i++) {
                var movesbaseElement = movesbase_1[_i];
                movesbaseElement.departuretime = movesbaseElement.departuretime + timeBegin;
                movesbaseElement.arrivaltime = movesbaseElement.arrivaltime + timeBegin;
                var operation = movesbaseElement.operation;
                for (var _d = 0, operation_1 = operation; _d < operation_1.length; _d++) {
                    var operationElement = operation_1[_d];
                    operationElement.elapsedtime = operationElement.elapsedtime + timeBegin;
                }
            }
        }
    }
    if (longArray.length > 0 && latiArray.length > 0) {
        var viewport = {
            longitude: getAverage(longArray), latitude: getAverage(latiArray),
        };
        return { timeBegin: timeBegin, timeLength: timeLength, bounds: bounds, movesbase: movesbase, viewport: viewport };
    }
    else {
        return { timeBegin: timeBegin, timeLength: timeLength, bounds: bounds, movesbase: movesbase, viewport: {} };
    }
};
export var getDepots = function (props) {
    var settime = props.settime, depotsBase = props.depotsBase, prevData = props.depotsData, getDepotsOptionFunc = props.getDepotsOptionFunc;
    if (prevData.length > 0 && (abs(prevData[0].settime - settime) <= 1)) {
        if (!getDepotsOptionFunc)
            return prevData;
    }
    var getOptionFunction = getDepotsOptionFunc || (function () { return {}; });
    if (depotsBase.length > 0) {
        var depotsData = [];
        for (var i = 0, lengthi = depotsBase.length; i < lengthi; i = (i + 1) | 0) {
            var _a = depotsBase[i], longitude = _a.longitude, latitude = _a.latitude, _b = _a.position, position = _b === void 0 ? [longitude, latitude, 1] : _b, otherProps = __rest(_a, ["longitude", "latitude", "position"]);
            depotsData[i] = assign({}, otherProps, { settime: settime, position: position }, getOptionFunction(props, i));
        }
        return depotsData;
    }
    return [];
};
export var getMoveObjects = function (props) {
    var movesbase = props.movesbase, prevMovedData = props.movedData, settime = props.settime, secperhour = props.secperhour, timeBegin = props.timeBegin, timeLength = props.timeLength, getMovesOptionFunc = props.getMovesOptionFunc, iconGradation = props.iconGradation;
    if (prevMovedData.length > 0) {
        if (abs(prevMovedData[0].settime - settime) <= 1 / (secperhour / 120)) {
            if (!getMovesOptionFunc)
                return prevMovedData;
        }
        ;
    }
    var getOptionFunction = getMovesOptionFunc || (function () { return {}; });
    var selectmovesbase = movesbase.filter(function (data) {
        var departuretime = data.departuretime, arrivaltime = data.arrivaltime;
        return (timeLength > 0 && departuretime <= settime && settime < arrivaltime);
    });
    var movedData = [];
    var _loop_2 = function (movesbaseElement) {
        var departuretime = movesbaseElement.departuretime, arrivaltime = movesbaseElement.arrivaltime, operation = movesbaseElement.operation, movesbaseidx = movesbaseElement.movesbaseidx, otherProps1 = __rest(movesbaseElement, ["departuretime", "arrivaltime", "operation", "movesbaseidx"]);
        var nextidx = operation.findIndex(function (data) { return data.elapsedtime > settime; });
        var beforeElapsedtime = operation[nextidx - 1].elapsedtime;
        var idx = operation.findIndex(function (data) { return data.elapsedtime === beforeElapsedtime; });
        if (typeof operation[idx].position === 'undefined' ||
            typeof operation[nextidx].position === 'undefined') {
            var _a = operation[idx], elapsedtime = _a.elapsedtime, longitude = _a.longitude, latitude = _a.latitude, otherProps2 = __rest(_a, ["elapsedtime", "longitude", "latitude"]);
            movedData.push(assign({}, otherProps1, otherProps2, { settime: settime, movesbaseidx: movesbaseidx }, getOptionFunction(props, movesbaseidx, idx)));
        }
        else {
            var _b = operation[idx], elapsedtime = _b.elapsedtime, sourcePosition = _b.position, longitude = _b.longitude, latitude = _b.latitude, _c = _b.color, sourceColor = _c === void 0 ? COLOR1 : _c, _d = _b.direction, direction = _d === void 0 ? 0 : _d, otherProps2 = __rest(_b, ["elapsedtime", "position", "longitude", "latitude", "color", "direction"]);
            var _e = operation[nextidx], nextelapsedtime = _e.elapsedtime, targetPosition = _e.position, _f = _e.color, targetColor = _f === void 0 ? COLOR1 : _f;
            var rate = (settime - elapsedtime) / (nextelapsedtime - elapsedtime);
            var position = [
                sourcePosition[0] - (sourcePosition[0] - targetPosition[0]) * rate,
                sourcePosition[1] - (sourcePosition[1] - targetPosition[1]) * rate,
                sourcePosition[2] - (sourcePosition[2] - targetPosition[2]) * rate
            ];
            var color = iconGradation ? [
                (sourceColor[0] + rate * (targetColor[0] - sourceColor[0])) | 0,
                (sourceColor[1] + rate * (targetColor[1] - sourceColor[1])) | 0,
                (sourceColor[2] + rate * (targetColor[2] - sourceColor[2])) | 0
            ] : sourceColor;
            movedData.push(assign({}, otherProps1, otherProps2, { settime: settime,
                position: position, sourcePosition: sourcePosition, targetPosition: targetPosition,
                color: color, direction: direction, sourceColor: sourceColor, targetColor: targetColor, movesbaseidx: movesbaseidx }, getOptionFunction(props, movesbaseidx, idx)));
        }
    };
    for (var _i = 0, selectmovesbase_1 = selectmovesbase; _i < selectmovesbase_1.length; _i++) {
        var movesbaseElement = selectmovesbase_1[_i];
        _loop_2(movesbaseElement);
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
export var onHoverClick = function (pickParams, getRouteColor, getRouteWidth, iconDesignations) {
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
            var movesbaseidx_1 = object.movesbaseidx;
            var actions = props.actions, clickedObject = props.clickedObject, movesbase = props.movesbase, routePaths = props.routePaths;
            var replaceGetRouteColor = {};
            if (iconDesignations) {
                for (var _i = 0, iconDesignations_1 = iconDesignations; _i < iconDesignations_1.length; _i++) {
                    var iconDesignationsElement = iconDesignations_1[_i];
                    replaceGetRouteColor[iconDesignationsElement.type] = iconDesignationsElement.getColor || getRouteColor;
                }
            }
            var deleted = false;
            if (clickedObject && clickedObject.length > 0) {
                if (clickedObject.findIndex(function (data) { return data.object.movesbaseidx === movesbaseidx_1; }) >= 0) {
                    deleted = true;
                }
            }
            if (deleted) {
                routeDelete(movesbaseidx_1, props);
            }
            else {
                var newClickedObject = clickedObject || [];
                newClickedObject.push({ object: object, layer: { id: id } });
                var setRoutePaths = [];
                var _a = movesbase[movesbaseidx_1], type = _a.type, operation = _a.operation;
                var getColor = getRouteColor;
                if (type && replaceGetRouteColor.hasOwnProperty(type)) {
                    getColor = replaceGetRouteColor[type];
                }
                var _loop_3 = function (j) {
                    var _a = operation[j], position = _a.position, elapsedtime = _a.elapsedtime;
                    var movedata = __assign({ type: type }, operation[j]);
                    var routeColor = getColor(movedata);
                    var routeWidth = getRouteWidth(movedata);
                    var findIndex = operation.findIndex(function (data) { return data.elapsedtime > elapsedtime; });
                    var nextidx = findIndex < 0 ? (j + 1) | 0 : findIndex;
                    var nextposition = operation[nextidx].position;
                    setRoutePaths.push({
                        type: type, movesbaseidx: movesbaseidx_1,
                        sourcePosition: position,
                        targetPosition: nextposition,
                        routeColor: routeColor || COLOR1,
                        routeWidth: routeWidth || 10,
                    });
                };
                for (var j = 0; j < (operation.length - 1); j = (j + 1) | 0) {
                    _loop_3(j);
                }
                actions.setClicked(newClickedObject);
                actions.setRoutePaths(__spreadArrays(routePaths, setRoutePaths));
            }
        }
    }
};
export var checkClickedObjectToBeRemoved = function (movedData, clickedObject, routePaths, actions) {
    if (clickedObject && clickedObject.length > 0 && routePaths.length > 0) {
        for (var _i = 0, clickedObject_1 = clickedObject; _i < clickedObject_1.length; _i++) {
            var clickedObjectElement = clickedObject_1[_i];
            var deleted = true;
            for (var _a = 0, movedData_1 = movedData; _a < movedData_1.length; _a++) {
                var movedDataElement = movedData_1[_a];
                if (clickedObjectElement.object.movesbaseidx === movedDataElement.movesbaseidx) {
                    deleted = false;
                    break;
                }
            }
            if (deleted) {
                routeDelete(clickedObjectElement.object.movesbaseidx, { routePaths: routePaths, clickedObject: clickedObject, actions: actions });
            }
        }
    }
};
export var defaultMapStateToProps = function (state) { return getContainerProp(state); };
export var connectToHarmowareVis = function (App, moreActions, mapStateToProps) {
    if (moreActions === void 0) { moreActions = null; }
    if (mapStateToProps === void 0) { mapStateToProps = defaultMapStateToProps; }
    var extendedActions = assign({}, Actions, moreActions);
    function mapDispatchToProps(dispatch) {
        return { actions: bindActionCreators(extendedActions, dispatch) };
    }
    return connect(mapStateToProps, mapDispatchToProps)(App);
};
export var getCombinedReducer = function (combined) {
    return combineReducers(__assign({ base: reducers }, combined));
};
//# sourceMappingURL=index.js.map