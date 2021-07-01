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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
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
var MIN_VALUE = -2147483648;
var MAX_VALUE = 2147483647;
export var getContainerProp = function (state) {
    var prop = {};
    keys(state).forEach(function (key) {
        prop = assign({}, prop, __assign({}, state[key]));
    });
    return prop;
};
export var safeCheck = function (value) {
    if (value > MAX_VALUE || value < MIN_VALUE) {
        var contents = 'value overflow => ' + value;
        console.log(contents);
        window.alert(contents);
    }
    return value;
};
export var safeAdd = function (left, right) {
    if (right > 0 ? left > (MAX_VALUE - right) : left < (MIN_VALUE - right)) {
        var contents = 'addition overflow => ' + left + ' + ' + right;
        console.log(contents);
        window.alert(contents);
    }
    return left + right;
};
export var safeSubtract = function (left, right) {
    if (right > 0 ? left < MIN_VALUE + right : left > MAX_VALUE + right) {
        var contents = 'subtraction overflow => ' + left + ' - ' + right;
        console.log(contents);
        window.alert(contents);
    }
    return left - right;
};
export var analyzeMovesBase = function (state, inputData, update) {
    var outputData = { movesbase: [] };
    if (isArray(inputData)) {
        outputData.timeBegin = 0;
        outputData.timeLength = 0;
        outputData.bounds = state.bounds;
        outputData.movesbase = __spreadArray([], inputData);
    }
    else {
        if (typeof inputData.timeBegin === 'undefined' || typeof inputData.timeBegin !== 'number') {
            outputData.timeBegin = undefined;
            console.log('inputData.timeBegin undefined');
        }
        else {
            outputData.timeBegin = inputData.timeBegin;
            safeCheck(outputData.timeBegin);
        }
        if (typeof inputData.timeLength === 'undefined' || typeof inputData.timeLength !== 'number') {
            outputData.timeLength = undefined;
            console.log('inputData.timeLength undefined');
        }
        else {
            outputData.timeLength = inputData.timeLength;
            safeCheck(outputData.timeLength);
        }
        if (inputData.bounds) {
            outputData.bounds = inputData.bounds;
        }
        else {
            outputData.bounds = state.bounds;
        }
        outputData.movesbase = __spreadArray([], inputData.movesbase);
        outputData.elapsedtimeMode = inputData.elapsedtimeMode;
    }
    var timeBegin = outputData.timeBegin, timeLength = outputData.timeLength, movesbase = outputData.movesbase, elapsedtimeMode = outputData.elapsedtimeMode;
    if (movesbase.length <= 0) {
        return outputData;
    }
    var posiAcc = state.initialViewChange && state.movesbase.length === 0;
    var longArray = [];
    var latiArray = [];
    var firstDeparture = MAX_VALUE;
    var lastArrival = MIN_VALUE;
    var _loop_1 = function (i, lengthi) {
        var operation = movesbase[i].operation;
        if (!operation || operation.length === 0) {
            console.log('movesbase[' + i + '] operation undefined');
            return "continue";
        }
        var sortFlg = false;
        movesbase[i].operation = operation.reduce(function (operation, operationElement) {
            var longitude = operationElement.longitude, latitude = operationElement.latitude, _a = operationElement.position, position = _a === void 0 ? [longitude, latitude, 3] : _a, elapsedtime = operationElement.elapsedtime;
            if (typeof elapsedtime === 'number') {
                safeCheck(elapsedtime);
                if (operation.length === 0 || operation.findIndex(function (data) { return data.elapsedtime === elapsedtime; }) < 0) {
                    if (typeof longitude === 'number' && typeof latitude === 'number' && typeof operationElement.position === 'undefined') {
                        operationElement.position = position;
                    }
                    if (typeof longitude === 'undefined')
                        delete operationElement.longitude;
                    if (typeof latitude === 'undefined')
                        delete operationElement.latitude;
                    if (posiAcc && typeof operationElement.position !== 'undefined') {
                        longArray.push(+position[0]);
                        latiArray.push(+position[1]);
                    }
                    operation.push(operationElement);
                    if (!sortFlg && operation.length > 0 && operation[operation.length - 1].elapsedtime > operationElement.elapsedtime) {
                        sortFlg = true;
                    }
                }
            }
            return operation;
        }, []);
        if (sortFlg) {
            operation.sort(function (a, b) { return a.elapsedtime > b.elapsedtime ? 1 : -1; });
        }
        movesbase[i].departuretime = operation[0].elapsedtime;
        movesbase[i].arrivaltime = operation[(operation.length - 1) | 0].elapsedtime;
        movesbase[i].movesbaseidx = i;
        firstDeparture = min(firstDeparture, movesbase[i].departuretime);
        lastArrival = max(lastArrival, movesbase[i].arrivaltime);
        var direction = 0;
        for (var j = 0, lengthj = operation.length; j < (lengthj - 1); j = (j + 1) | 0) {
            var nextidx = (j + 1) | 0;
            if (typeof operation[j].position === 'undefined' ||
                typeof operation[nextidx].position === 'undefined') {
                continue;
            }
            if (update && typeof operation[j].direction !== 'undefined' &&
                typeof operation[nextidx].direction !== 'undefined') {
                direction = operation[j].direction;
                continue;
            }
            var sourcePosition = operation[j].position;
            var targetPosition = operation[nextidx].position;
            if (sourcePosition[0] === targetPosition[0] && sourcePosition[1] === targetPosition[1]) {
                operation[j].direction = direction;
                continue;
            }
            var x1 = radians(sourcePosition[0]);
            var y1 = radians(sourcePosition[1]);
            var x2 = radians(targetPosition[0]);
            var y2 = radians(targetPosition[1]);
            var deltax = x2 - x1;
            direction = degrees(atan2(sin(deltax), cos(y1) * tan(y2) - sin(y1) * cos(deltax))) % 360;
            operation[j].direction = direction;
        }
    };
    for (var i = 0, lengthi = movesbase.length; i < lengthi; i = (i + 1) | 0) {
        _loop_1(i, lengthi);
    }
    if (isArray(inputData)) {
        outputData.timeBegin = firstDeparture;
        outputData.timeLength = safeSubtract(lastArrival, firstDeparture);
    }
    else {
        if (typeof timeBegin === 'undefined') {
            outputData.timeBegin = firstDeparture;
        }
        else {
            if (!elapsedtimeMode || elapsedtimeMode !== 'UNIXTIME') {
                firstDeparture = safeAdd(firstDeparture, timeBegin);
                lastArrival = safeAdd(lastArrival, timeBegin);
                for (var _i = 0, movesbase_1 = movesbase; _i < movesbase_1.length; _i++) {
                    var movesbaseElement = movesbase_1[_i];
                    movesbaseElement.departuretime = safeAdd(movesbaseElement.departuretime, timeBegin);
                    movesbaseElement.arrivaltime = safeAdd(movesbaseElement.arrivaltime, timeBegin);
                    var operation = movesbaseElement.operation;
                    for (var _a = 0, operation_1 = operation; _a < operation_1.length; _a++) {
                        var operationElement = operation_1[_a];
                        operationElement.elapsedtime = safeAdd(operationElement.elapsedtime, timeBegin);
                    }
                }
            }
        }
        if (typeof timeLength === 'undefined') {
            outputData.timeLength = safeSubtract(lastArrival, timeBegin);
        }
    }
    if (longArray.length > 0 && latiArray.length > 0) {
        outputData.viewport = {
            longitude: getAverage(longArray), latitude: getAverage(latiArray),
        };
    }
    return outputData;
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
    var movesbase = props.movesbase, prevMovedData = props.movedData, settime = props.settime, secperhour = props.secperhour, timeLength = props.timeLength, getMovesOptionFunc = props.getMovesOptionFunc, iconGradation = props.iconGradation;
    safeCheck(settime);
    if (prevMovedData.length > 0) {
        if (abs(safeSubtract(prevMovedData[0].settime, settime)) <= 1 / (secperhour / 120)) {
            if (!getMovesOptionFunc)
                return prevMovedData;
        }
        ;
    }
    var getOptionFunction = getMovesOptionFunc || (function () { return {}; });
    var movedData = movesbase.reduce(function (movedData, movesbaseElement) {
        var departuretime = movesbaseElement.departuretime, arrivaltime = movesbaseElement.arrivaltime, operation = movesbaseElement.operation, movesbaseidx = movesbaseElement.movesbaseidx, otherProps1 = __rest(movesbaseElement, ["departuretime", "arrivaltime", "operation", "movesbaseidx"]);
        if (timeLength > 0 && departuretime <= settime && settime < arrivaltime) {
            var nextidx = operation.findIndex(function (data) { return data.elapsedtime > settime; });
            var idx = (nextidx - 1) | 0;
            if (typeof operation[idx].position === 'undefined' ||
                typeof operation[nextidx].position === 'undefined') {
                var _a = operation[idx], elapsedtime = _a.elapsedtime, otherProps2 = __rest(_a, ["elapsedtime"]);
                movedData.push(assign({}, otherProps1, otherProps2, { settime: settime, movesbaseidx: movesbaseidx }, getOptionFunction(props, movesbaseidx, idx)));
            }
            else {
                var _b = operation[idx], elapsedtime = _b.elapsedtime, sourcePosition = _b.position, _c = _b.color, sourceColor = _c === void 0 ? COLOR1 : _c, _d = _b.direction, direction = _d === void 0 ? 0 : _d, otherProps2 = __rest(_b, ["elapsedtime", "position", "color", "direction"]);
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
        }
        return movedData;
    }, []);
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
                for (var j = 0; j < (operation.length - 1); j = (j + 1) | 0) {
                    var movedata = __assign({ type: type }, operation[j]);
                    var routeColor = getColor(movedata);
                    var routeWidth = getRouteWidth(movedata);
                    var position = operation[j].position;
                    var nextposition = operation[(j + 1) | 0].position;
                    setRoutePaths.push({
                        type: type, movesbaseidx: movesbaseidx_1,
                        sourcePosition: position,
                        targetPosition: nextposition,
                        routeColor: routeColor || COLOR1,
                        routeWidth: routeWidth || 10,
                    });
                }
                actions.setClicked(newClickedObject);
                actions.setRoutePaths(__spreadArray(__spreadArray([], routePaths), setRoutePaths));
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