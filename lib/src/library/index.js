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
                eastlongitiude = !eastlongitiude ? position[0] : Math.max(eastlongitiude, position[0]);
                westlongitiude = !westlongitiude ? position[0] : Math.min(westlongitiude, position[0]);
                southlatitude = !southlatitude ? position[1] : Math.min(southlatitude, position[1]);
                northlatitude = !northlatitude ? position[1] : Math.max(northlatitude, position[1]);
                bounds = { eastlongitiude: eastlongitiude, westlongitiude: westlongitiude, southlatitude: southlatitude, northlatitude: northlatitude };
            }
        }
        movesbase[i].departuretime = operation[0].elapsedtime;
        movesbase[i].arrivaltime = operation[(operation.length - 1) | 0].elapsedtime;
        movesbase[i].movesbaseidx = i;
        if (typeof baseTimeBegin !== 'number' || typeof baseTimeLength !== 'number') {
            timeBegin = !timeBegin ? movesbase[i].departuretime : Math.min(timeBegin, movesbase[i].departuretime);
            timeEnd = !timeEnd ? movesbase[i].arrivaltime : Math.max(timeEnd, movesbase[i].arrivaltime);
        }
        var direction = 0;
        for (var j = 0, lengthj = operation.length; j < (lengthj - 1); j = (j + 1) | 0) {
            if (typeof operation[j].position === 'undefined' ||
                typeof operation[(j + 1) | 0].position === 'undefined') {
                continue;
            }
            var sourcePosition = operation[j].position;
            var targetPosition = operation[(j + 1) | 0].position;
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
        for (var k = 0, lengthk = movesbase.length; k < lengthk; k = (k + 1) | 0) {
            movesbase[k].departuretime = movesbase[k].departuretime + timeBegin;
            movesbase[k].arrivaltime = movesbase[k].arrivaltime + timeBegin;
            var operation = movesbase[k].operation;
            for (var l = 0, lengthl = operation.length; l < lengthl; l = (l + 1) | 0) {
                operation[l].elapsedtime = operation[l].elapsedtime + timeBegin;
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
var defDepotsOptionFunc = function (props, idx) {
    var _a = props.depotsBase[idx], position = _a.position, longitude = _a.longitude, latitude = _a.latitude, type = _a.type, retValue = __rest(_a, ["position", "longitude", "latitude", "type"]);
    return retValue;
};
export var getDepots = function (props) {
    var settime = props.settime, depotsBase = props.depotsBase, prevData = props.depotsData, getDepotsOptionFunc = props.getDepotsOptionFunc;
    if (prevData.length > 0 && (Math.abs(prevData[0].settime - settime) <= 1)) {
        if (!getDepotsOptionFunc)
            return prevData;
    }
    var getOptionFunction = getDepotsOptionFunc || defDepotsOptionFunc;
    if (depotsBase.length > 0) {
        var depotsData = [];
        for (var i = 0, lengthi = depotsBase.length; i < lengthi; i = (i + 1) | 0) {
            var _a = depotsBase[i], type = _a.type, longitude = _a.longitude, latitude = _a.latitude, _b = _a.position, position = _b === void 0 ? [longitude, latitude, 1] : _b;
            depotsData[i] = Object.assign({}, { settime: settime, position: position }, getOptionFunction(props, i));
            if (typeof type === 'string')
                depotsData[i].type = type;
        }
        return depotsData;
    }
    return [];
};
var defMovesOptionFunc = function (props, idx1, idx2) {
    var _a = props.movesbase[idx1], departuretime = _a.departuretime, arrivaltime = _a.arrivaltime, operation = _a.operation, type = _a.type, retValue1 = __rest(_a, ["departuretime", "arrivaltime", "operation", "type"]);
    var _b = operation[idx2], elapsedtime = _b.elapsedtime, position = _b.position, longitude = _b.longitude, latitude = _b.latitude, color = _b.color, direction = _b.direction, retValue2 = __rest(_b, ["elapsedtime", "position", "longitude", "latitude", "color", "direction"]);
    return Object.assign(retValue1, retValue2);
};
export var getMoveObjects = function (props) {
    var movesbase = props.movesbase, prevMovedData = props.movedData, settime = props.settime, secperhour = props.secperhour, timeBegin = props.timeBegin, timeLength = props.timeLength, getMovesOptionFunc = props.getMovesOptionFunc;
    if (prevMovedData.length > 0) {
        if (Math.abs(prevMovedData[0].settime - settime) <= 1 / (secperhour / 144)) {
            if (!getMovesOptionFunc)
                return prevMovedData;
        }
        ;
    }
    var getOptionFunction = getMovesOptionFunc || defMovesOptionFunc;
    var selectmovesbase = movesbase.filter(function (data) {
        var departuretime = data.departuretime, arrivaltime = data.arrivaltime;
        return (timeBegin > 0 && timeLength > 0 && departuretime <= settime && settime < arrivaltime);
    });
    var movedData = [];
    for (var i = 0, lengthi = selectmovesbase.length; i < lengthi; i = (i + 1) | 0) {
        var _a = selectmovesbase[i], operation = _a.operation, movesbaseidx = _a.movesbaseidx, type = _a.type;
        var idx = operation.findIndex(function (data) { return data.elapsedtime > settime; }) - 1;
        var nextidx = (idx + 1) | 0;
        if (typeof operation[idx].position === 'undefined' ||
            typeof operation[nextidx].position === 'undefined') {
            var _b = operation[idx], elapsedtime = _b.elapsedtime, otherProps = __rest(_b, ["elapsedtime"]);
            movedData[i] = Object.assign({}, otherProps, { settime: settime, movesbaseidx: movesbaseidx }, getOptionFunction(props, movesbaseidx, idx));
        }
        else {
            var _c = operation[idx], elapsedtime = _c.elapsedtime, _d = _c.position, longitude = _d[0], latitude = _d[1], elevation = _d[2], _e = _c.color, color = _e === void 0 ? COLOR1 : _e, _f = _c.direction, direction = _f === void 0 ? 0 : _f;
            var _g = operation[nextidx], nextelapsedtime = _g.elapsedtime, _h = _g.position, nextlongitude = _h[0], nextlatitude = _h[1], nextelevation = _h[2], _j = _g.color, nextcolor = _j === void 0 ? COLOR1 : _j;
            var pos_rate = [longitude, latitude, elevation];
            var rate = (settime - elapsedtime) / (nextelapsedtime - elapsedtime);
            pos_rate[0] = pos_rate[0] - (longitude - nextlongitude) * rate;
            pos_rate[1] = pos_rate[1] - (latitude - nextlatitude) * rate;
            pos_rate[2] = pos_rate[2] - (elevation - nextelevation) * rate;
            movedData[i] = Object.assign({}, { settime: settime,
                position: pos_rate,
                sourcePosition: [longitude, latitude, elevation],
                targetPosition: [nextlongitude, nextlatitude, nextelevation],
                color: color, direction: direction,
                sourceColor: color, targetColor: nextcolor,
                movesbaseidx: movesbaseidx }, getOptionFunction(props, movesbaseidx, idx));
        }
        if (typeof type === 'string')
            movedData[i].type = type;
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
                for (var i = 0, lengthi = iconDesignations.length; i < lengthi; i = (i + 1) | 0) {
                    replaceGetRouteColor[iconDesignations[i].type] = iconDesignations[i].getColor || getRouteColor;
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
                    var position = operation[j].position;
                    var movedata = __assign({ type: type }, operation[j]);
                    var routeColor = getColor(movedata);
                    var routeWidth = getRouteWidth(movedata);
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
                actions.setRoutePaths(__spreadArrays(routePaths, setRoutePaths));
            }
        }
    }
};
export var checkClickedObjectToBeRemoved = function (movedData, clickedObject, routePaths, actions) {
    if (clickedObject && clickedObject.length > 0 && routePaths.length > 0) {
        for (var i = 0, lengthi = clickedObject.length; i < lengthi; i = (i + 1) | 0) {
            var deleted = true;
            for (var j = 0, lengthj = movedData.length; j < lengthj; j = (j + 1) | 0) {
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