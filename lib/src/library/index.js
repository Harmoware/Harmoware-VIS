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
import { connect } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import * as Actions from '../actions';
import reducers from '../reducers';
import { COLOR1 } from '../constants/settings';
var scaleInfo = { scaleZ: 0, xMid: 0, yMid: 0 };
var EQUATOR_RADIUS = 6378136.6;
var DEGREE_SCALE = 100;
var getLongitiudeDegree = function (latitude) { return ((360 * DEGREE_SCALE) /
    (2 * Math.PI * (EQUATOR_RADIUS * Math.cos((latitude * Math.PI) / 180.0)))); };
var getAverage = function (array) { return array.length &&
    array.reduce(function (previous, current) { return previous + current; }) / array.length; };
export var getContainerProp = function (state) {
    var prop = {};
    Object.keys(state).forEach(function (key) {
        prop = Object.assign({}, prop, __assign({}, state[key]));
    });
    return prop;
};
// LoopTime とは１ループにかける時間（ミリ秒）
export var calcLoopTime = function (timeLength, secperhour) { return (timeLength / 3600) * 1000 * secperhour; };
function normalize(nonmapView, movesbase) {
    if (!nonmapView)
        return movesbase;
    var xMin = Infinity;
    var yMin = Infinity;
    var xMax = -Infinity;
    var yMax = -Infinity;
    for (var i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
        var operation = movesbase[i].operation;
        for (var j = 0, lengthj = operation.length; j < lengthj; j += 1) {
            var position = operation[j].position;
            xMin = Math.min(xMin, position[0]);
            yMin = Math.min(yMin, position[1]);
            xMax = Math.max(xMax, position[0]);
            yMax = Math.max(yMax, position[1]);
        }
    }
    scaleInfo.xMid = (xMin + xMax) / 2;
    scaleInfo.yMid = (yMin + yMax) / 2;
    scaleInfo.scaleZ = getLongitiudeDegree(scaleInfo.yMid);
    for (var k = 0, lengthk = movesbase.length; k < lengthk; k += 1) {
        var operation = movesbase[k].operation;
        for (var l = 0, lengthl = operation.length; l < lengthl; l += 1) {
            var position = operation[l].position;
            position[0] = (position[0] - scaleInfo.xMid) / scaleInfo.scaleZ;
            position[1] = (position[1] - scaleInfo.yMid) / scaleInfo.scaleZ;
            position[2] /= DEGREE_SCALE;
        }
    }
    return movesbase;
}
export var analyzeMovesBase = function (nonmapView, inputData) {
    var baseTimeBegin;
    var baseTimeLength;
    var baseBounds;
    var basemovesbase;
    if (Array.isArray(inputData)) { // Array?
        basemovesbase = inputData.slice();
    }
    else {
        baseTimeBegin = inputData.timeBegin;
        baseTimeLength = inputData.timeLength;
        baseBounds = inputData.bounds;
        basemovesbase = inputData.movesbase.slice();
    }
    var timeBegin = typeof baseTimeBegin === 'number' ? baseTimeBegin : 0;
    var timeLength = typeof baseTimeLength === 'number' ? baseTimeLength : 0;
    var bounds = typeof baseBounds !== 'undefined' ? baseBounds : {
        westlongitiude: 0, eastlongitiude: 0, southlatitude: 0, northlatitude: 0
    };
    var movesbase = basemovesbase;
    var timeEnd = 0;
    var longArray = [];
    var latiArray = [];
    for (var i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
        var _a = movesbase[i], departuretime = _a.departuretime, arrivaltime = _a.arrivaltime, operation = _a.operation;
        if (typeof baseTimeBegin !== 'number' || typeof baseTimeLength !== 'number') {
            timeBegin = !timeBegin ? departuretime : Math.min(timeBegin, departuretime);
            timeEnd = !timeEnd ? arrivaltime : Math.max(timeEnd, arrivaltime);
        }
        for (var j = 0, lengthj = operation.length; j < lengthj; j += 1) {
            var position = operation[j].position;
            var _b = operation[j], longitude = _b.longitude, latitude = _b.latitude;
            if (typeof position !== 'undefined') {
                longitude = position[0];
                latitude = position[1];
            }
            else {
                operation[j].position = [longitude, latitude, 3];
            }
            longArray.push(+longitude);
            latiArray.push(+latitude);
            if (!baseBounds && longitude && latitude && !nonmapView) {
                var _c = bounds || null, eastlongitiude = _c.eastlongitiude, westlongitiude = _c.westlongitiude, southlatitude = _c.southlatitude, northlatitude = _c.northlatitude;
                eastlongitiude = !eastlongitiude ? longitude : Math.max(eastlongitiude, longitude);
                westlongitiude = !westlongitiude ? longitude : Math.min(westlongitiude, longitude);
                southlatitude = !southlatitude ? latitude : Math.min(southlatitude, latitude);
                northlatitude = !northlatitude ? latitude : Math.max(northlatitude, latitude);
                bounds = { eastlongitiude: eastlongitiude, westlongitiude: westlongitiude, southlatitude: southlatitude, northlatitude: northlatitude };
            }
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
    var viewport = nonmapView ? {
        lookAt: [0, 0, 0], distance: 200, rotationX: 60, rotationY: 0, fov: 50,
    } : {
        longitude: getAverage(longArray), latitude: getAverage(latiArray),
    };
    return { timeBegin: timeBegin, timeLength: timeLength, bounds: bounds, movesbase: normalize(nonmapView, movesbase), viewport: viewport };
};
export var analyzeDepotsBase = function (nonmapView, depotsBase) {
    if (!nonmapView)
        return depotsBase;
    var xMin = Infinity;
    var yMin = Infinity;
    var xMax = -Infinity;
    var yMax = -Infinity;
    for (var i = 0, lengthi = depotsBase.length; i < lengthi; i += 1) {
        var position = depotsBase[i].position;
        xMin = Math.min(xMin, position[0]);
        yMin = Math.min(yMin, position[1]);
        xMax = Math.max(xMax, position[0]);
        yMax = Math.max(yMax, position[1]);
    }
    var xMid = scaleInfo.xMid || (xMin + xMax) / 2;
    var yMid = scaleInfo.yMid || (yMin + yMax) / 2;
    var scaleZ = scaleInfo.scaleZ || getLongitiudeDegree(yMid);
    for (var j = 0, lengthj = depotsBase.length; j < lengthj; j += 1) {
        var position = depotsBase[j].position;
        position[0] = (position[0] - xMid) / scaleZ;
        position[1] = (position[1] - yMid) / scaleZ;
        position[2] /= DEGREE_SCALE;
    }
    if (!scaleInfo.xMid)
        scaleInfo.xMid = xMid;
    if (!scaleInfo.yMid)
        scaleInfo.yMid = yMid;
    if (!scaleInfo.scaleZ)
        scaleInfo.scaleZ = scaleZ;
    return depotsBase;
};
var defDepotsOptionFunc = function (props, idx) {
    var retValue = {};
    var basedata = props.depotsBase[idx];
    Object.keys(basedata).forEach(function (key) {
        if (!(key === 'position' || key === 'longitude' || key === 'latitude')) {
            retValue[key] = basedata[key];
        }
    });
    return retValue;
};
export var getDepots = function (props) {
    var nonmapView = props.nonmapView, depotsBase = props.depotsBase, bounds = props.bounds, getDepotsOptionFunc = props.getDepotsOptionFunc;
    var depotsData = [];
    var getOptionFunction = getDepotsOptionFunc || defDepotsOptionFunc;
    if (nonmapView || (depotsBase.length > 0 && typeof bounds !== 'undefined' && Object.keys(bounds).length > 0)) {
        for (var i = 0, lengthi = depotsBase.length; i < lengthi; i += 1) {
            var _a = depotsBase[i], longitude = _a.longitude, latitude = _a.latitude;
            var position = depotsBase[i].position;
            if (typeof position === 'undefined') {
                position = [longitude, latitude, 1];
            }
            if (nonmapView ||
                (bounds.westlongitiude <= position[0] && position[0] <= bounds.eastlongitiude &&
                    bounds.southlatitude <= position[1] && position[1] <= bounds.northlatitude)) {
                var itemmap = __assign({ longitude: parseFloat(position[0].toString()), latitude: parseFloat(position[1].toString()), position: [parseFloat(position[0].toString()), parseFloat(position[1].toString()), parseFloat(position[2].toString())] }, getOptionFunction(props, i));
                depotsData.push(itemmap);
            }
        }
    }
    return depotsData;
};
var defMovesOptionFunc = function (props, idx1, idx2) {
    var retValue = {};
    var basedata = props.movesbase[idx1];
    Object.keys(basedata).forEach(function (key1) {
        if (!(key1 === 'departuretime' || key1 === 'arrivaltime' || key1 === 'operation')) {
            retValue[key1] = basedata[key1];
        }
    });
    var operationdata = basedata.operation[idx2];
    Object.keys(operationdata).forEach(function (key2) {
        if (!(key2 === 'elapsedtime' || key2 === 'position' || key2 === 'longitude' || key2 === 'latitude')) {
            retValue[key2] = operationdata[key2];
        }
    });
    return retValue;
};
export var getMoveObjects = function (props) {
    var movesbase = props.movesbase, settime = props.settime, timeBegin = props.timeBegin, timeLength = props.timeLength, getMovesOptionFunc = props.getMovesOptionFunc;
    var movedData = [];
    var getOptionFunction = getMovesOptionFunc || defMovesOptionFunc;
    for (var i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
        var _a = movesbase[i], departuretime = _a.departuretime, arrivaltime = _a.arrivaltime, operation = _a.operation;
        if (typeof departuretime !== 'number' || typeof arrivaltime !== 'number') {
            // console.log(`バス運行実績データなし=>${i}`);
        }
        else if (timeBegin > 0 && timeLength > 0 && departuretime <= settime && settime < arrivaltime) {
            for (var j = 0, lengthj = operation.length; j < lengthj - 1; j += 1) {
                var _b = operation[j], elapsedtime = _b.elapsedtime, position = _b.position, color = _b.color;
                var _c = operation[j + 1], nextelapsedtime = _c.elapsedtime, nextposition = _c.position, nextcolor = _c.color;
                if (elapsedtime <= settime && settime < nextelapsedtime) {
                    var elapsedtimespan = settime - elapsedtime;
                    var timespan = nextelapsedtime - elapsedtime;
                    var positionspan = [];
                    positionspan[0] = position[0] - nextposition[0];
                    positionspan[1] = position[1] - nextposition[1];
                    positionspan[2] = position[2] - nextposition[2];
                    var positionprogress = [];
                    positionprogress[0] = positionspan[0] * (elapsedtimespan / timespan);
                    positionprogress[1] = positionspan[1] * (elapsedtimespan / timespan);
                    positionprogress[2] = positionspan[2] * (elapsedtimespan / timespan);
                    movedData.push(__assign({ longitude: position[0] - positionprogress[0], latitude: position[1] - positionprogress[1], position: [position[0] - positionprogress[0], position[1] - positionprogress[1],
                            position[2] - positionprogress[2]], sourcePosition: position, targetPosition: nextposition, sourceColor: color || COLOR1, targetColor: nextcolor || COLOR1 }, getOptionFunction(props, i, j), { movesbaseidx: i }));
                }
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
export var onHoverClick = function (pickParams) {
    var mode = pickParams.mode, info = pickParams.info;
    var object = info.object, layer = info.layer;
    var id = layer.id, props = layer.props;
    if (mode === 'hover' && props.onHover) {
        props.onHover(info);
    }
    if (mode === 'click') {
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
                    var _a = operation[j], position = _a.position, color = _a.color;
                    var nextposition = operation[j + 1].position;
                    setRoutePaths.push({
                        movesbaseidx: movesbaseidx,
                        sourcePosition: position,
                        targetPosition: nextposition,
                        color: color || COLOR1
                    });
                }
                actions.setClicked(newClickedObject);
                actions.setRoutePaths(routePaths.concat(setRoutePaths));
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
export var analyzelinemapData = function (nonmapView, linemapData) {
    if (!nonmapView)
        return linemapData;
    var xMin = Infinity;
    var yMin = Infinity;
    var xMax = -Infinity;
    var yMax = -Infinity;
    for (var i = 0, lengthi = linemapData.length; i < lengthi; i += 1) {
        var _a = linemapData[i], sourcePosition = _a.sourcePosition, targetPosition = _a.targetPosition;
        xMin = Math.min(xMin, sourcePosition[0], targetPosition[0]);
        yMin = Math.min(yMin, sourcePosition[1], targetPosition[1]);
        xMax = Math.max(xMax, sourcePosition[0], targetPosition[0]);
        yMax = Math.max(yMax, sourcePosition[1], targetPosition[1]);
    }
    var xMid = scaleInfo.xMid || (xMin + xMax) / 2;
    var yMid = scaleInfo.yMid || (yMin + yMax) / 2;
    var scaleZ = scaleInfo.scaleZ || getLongitiudeDegree(yMid);
    for (var j = 0, lengthj = linemapData.length; j < lengthj; j += 1) {
        var _b = linemapData[j], sourcePosition = _b.sourcePosition, targetPosition = _b.targetPosition;
        sourcePosition[0] = (sourcePosition[0] - xMid) / scaleZ;
        sourcePosition[1] = (sourcePosition[1] - yMid) / scaleZ;
        sourcePosition[2] /= DEGREE_SCALE;
        targetPosition[0] = (targetPosition[0] - xMid) / scaleZ;
        targetPosition[1] = (targetPosition[1] - yMid) / scaleZ;
        targetPosition[2] /= DEGREE_SCALE;
    }
    if (!scaleInfo.xMid)
        scaleInfo.xMid = xMid;
    if (!scaleInfo.yMid)
        scaleInfo.yMid = yMid;
    if (!scaleInfo.scaleZ)
        scaleInfo.scaleZ = scaleZ;
    return linemapData;
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