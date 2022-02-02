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
import { connect } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import * as Actions from '../actions';
import reducers from '../reducers';
import { COLOR1 } from '../constants/settings';
const { assign, keys } = Object;
const { PI: pi, min, max, abs, sin, cos, tan, atan2 } = Math;
const { isArray } = Array;
const getAverage = (array) => array.length &&
    array.reduce((previous, current) => previous + current) / array.length;
const radians = (degree) => degree * pi / 180;
const degrees = (radian) => radian * 180 / pi;
const MIN_VALUE = -2147483648;
const MAX_VALUE = 2147483647;
export const getContainerProp = (state) => {
    let prop = {};
    keys(state).forEach((key) => {
        prop = assign({}, prop, Object.assign({}, state[key]));
    });
    return prop;
};
export const safeCheck = (value) => {
    if (value > MAX_VALUE || value < MIN_VALUE) {
        const contents = 'value overflow => ' + value;
        console.log(contents);
        window.alert(contents);
    }
    return value;
};
export const safeAdd = (left, right) => {
    if (right > 0 ? left > (MAX_VALUE - right) : left < (MIN_VALUE - right)) {
        const contents = 'addition overflow => ' + left + ' + ' + right;
        console.log(contents);
        window.alert(contents);
    }
    return left + right;
};
export const safeSubtract = (left, right) => {
    if (right > 0 ? left < MIN_VALUE + right : left > MAX_VALUE + right) {
        const contents = 'subtraction overflow => ' + left + ' - ' + right;
        console.log(contents);
        window.alert(contents);
    }
    return left - right;
};
export const analyzeMovesBase = (state, inputData, update) => {
    const outputData = { movesbase: [] };
    if (isArray(inputData)) {
        outputData.timeBegin = 0;
        outputData.timeLength = 0;
        outputData.bounds = state.bounds;
        outputData.movesbase = [...inputData];
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
        outputData.movesbase = [...inputData.movesbase];
        outputData.elapsedtimeMode = inputData.elapsedtimeMode;
    }
    if (outputData.movesbase.length <= 0) {
        return outputData;
    }
    let { movesbase } = outputData;
    const posiAcc = state.initialViewChange && state.movesbase.length === 0;
    const longArray = [];
    const latiArray = [];
    let firstDeparture = MAX_VALUE;
    let lastArrival = MIN_VALUE;
    for (let i = 0, lengthi = movesbase.length; i < lengthi; i = (i + 1) | 0) {
        const { operation } = movesbase[i];
        if (!operation || operation.length === 0) {
            console.log('movesbase[' + i + '] operation undefined');
            continue;
        }
        let sortFlg = false;
        movesbase[i].operation = operation.reduce((operation, operationElement) => {
            const { longitude, latitude, position = [longitude, latitude, 3], elapsedtime } = operationElement;
            if (typeof elapsedtime === 'number') {
                safeCheck(elapsedtime);
                if (operation.length === 0 || operation.findIndex((data) => data.elapsedtime === elapsedtime) < 0) {
                    if (typeof longitude === 'number' && typeof latitude === 'number' && typeof operationElement.position === 'undefined') {
                        operationElement.position = position;
                    }
                    if (typeof longitude !== 'undefined')
                        delete operationElement.longitude;
                    if (typeof latitude !== 'undefined')
                        delete operationElement.latitude;
                    if (posiAcc && typeof operationElement.position !== 'undefined') {
                        longArray.push(+position[0]);
                        latiArray.push(+position[1]);
                    }
                    if (!sortFlg && operation.length > 0 && operation[operation.length - 1].elapsedtime > operationElement.elapsedtime) {
                        sortFlg = true;
                    }
                    operation.push(operationElement);
                }
            }
            return operation;
        }, []);
        if (sortFlg) {
            operation.sort((a, b) => a.elapsedtime > b.elapsedtime ? 1 : -1);
        }
        movesbase[i].departuretime = operation[0].elapsedtime;
        movesbase[i].arrivaltime = operation[(operation.length - 1) | 0].elapsedtime;
        movesbase[i].movesbaseidx = i;
        firstDeparture = min(firstDeparture, movesbase[i].departuretime);
        lastArrival = max(lastArrival, movesbase[i].arrivaltime);
        let direction = 0;
        for (let j = 0, lengthj = operation.length; j < (lengthj - 1); j = (j + 1) | 0) {
            const nextidx = (j + 1) | 0;
            if (typeof operation[j].position === 'undefined' ||
                typeof operation[nextidx].position === 'undefined') {
                continue;
            }
            if (update && typeof operation[j].direction !== 'undefined' &&
                typeof operation[nextidx].direction !== 'undefined') {
                direction = operation[j].direction;
                continue;
            }
            const { position: sourcePosition } = operation[j];
            const { position: targetPosition } = operation[nextidx];
            if (sourcePosition[0] === targetPosition[0] && sourcePosition[1] === targetPosition[1]) {
                operation[j].direction = direction;
                continue;
            }
            const x1 = radians(sourcePosition[0]);
            const y1 = radians(sourcePosition[1]);
            const x2 = radians(targetPosition[0]);
            const y2 = radians(targetPosition[1]);
            const deltax = x2 - x1;
            direction = degrees(atan2(sin(deltax), cos(y1) * tan(y2) - sin(y1) * cos(deltax))) % 360;
            operation[j].direction = direction;
        }
    }
    if (isArray(inputData)) {
        outputData.timeBegin = firstDeparture;
        outputData.timeLength = safeSubtract(lastArrival, firstDeparture);
    }
    else {
        if (typeof outputData.timeBegin === 'undefined') {
            outputData.timeBegin = firstDeparture;
        }
        else {
            if (!outputData.elapsedtimeMode || outputData.elapsedtimeMode !== 'UNIXTIME') {
                firstDeparture = safeAdd(firstDeparture, outputData.timeBegin);
                lastArrival = safeAdd(lastArrival, outputData.timeBegin);
                for (const movesbaseElement of movesbase) {
                    movesbaseElement.departuretime = safeAdd(movesbaseElement.departuretime, outputData.timeBegin);
                    movesbaseElement.arrivaltime = safeAdd(movesbaseElement.arrivaltime, outputData.timeBegin);
                    const { operation } = movesbaseElement;
                    for (const operationElement of operation) {
                        operationElement.elapsedtime = safeAdd(operationElement.elapsedtime, outputData.timeBegin);
                    }
                }
            }
        }
        if (typeof outputData.timeLength === 'undefined') {
            outputData.timeLength = safeSubtract(lastArrival, outputData.timeBegin);
        }
    }
    if (longArray.length > 0 && latiArray.length > 0) {
        outputData.viewport = {
            longitude: getAverage(longArray), latitude: getAverage(latiArray),
        };
    }
    return outputData;
};
export const getDepots = (props) => {
    const { settime, depotsBase, depotsData: prevData, secperhour, getDepotsOptionFunc } = props;
    if (prevData.length > 0) {
        if (!getDepotsOptionFunc || (abs(prevData[0].settime - settime) / 3.6) * secperhour < 100) {
            return null;
        }
    }
    const getOptionFunction = getDepotsOptionFunc || (() => { return {}; });
    if (depotsBase.length > 0) {
        const depotsData = [];
        for (let i = 0, lengthi = depotsBase.length; i < lengthi; i = (i + 1) | 0) {
            const _a = depotsBase[i], { longitude, latitude, position = [longitude, latitude, 1] } = _a, otherProps = __rest(_a, ["longitude", "latitude", "position"]);
            depotsData[i] = assign({}, otherProps, { settime, position }, getOptionFunction(props, i));
        }
        return depotsData;
    }
    return [];
};
;
export const getMoveObjects = (props) => {
    const { movesbase, locationBase, locationMoveDuration, getExtractedDataFunc } = props;
    const retrunData = {};
    if (movesbase.length > 0) {
        const { settime, movedData: prevMovedData, secperhour, timeLength, getMovesOptionFunc, iconGradation } = props;
        safeCheck(settime);
        let skip = false;
        if (prevMovedData.length > 0) {
            if ((abs(prevMovedData[0].settime - settime) / 3.6) * secperhour < 25) {
                skip = true;
            }
            ;
        }
        if (!skip) {
            const getOptionFunction = getMovesOptionFunc || (() => { return {}; });
            const movedData = movesbase.reduce((movedData, movesbaseElement, movesbaseidx) => {
                const { departuretime, arrivaltime, operation } = movesbaseElement, otherProps1 = __rest(movesbaseElement, ["departuretime", "arrivaltime", "operation"]);
                if (timeLength > 0 && departuretime <= settime && settime < arrivaltime) {
                    const nextidx = operation.findIndex((data) => data.elapsedtime > settime);
                    const idx = (nextidx - 1) | 0;
                    if (typeof operation[idx].position === 'undefined' ||
                        typeof operation[nextidx].position === 'undefined') {
                        const _a = operation[idx], { elapsedtime } = _a, otherProps2 = __rest(_a, ["elapsedtime"]);
                        movedData.push(assign({}, otherProps1, otherProps2, { settime, movesbaseidx }, getOptionFunction(props, movesbaseidx, idx)));
                    }
                    else {
                        const _b = operation[idx], { elapsedtime, position: sourcePosition, color: sourceColor = COLOR1, direction = 0 } = _b, otherProps2 = __rest(_b, ["elapsedtime", "position", "color", "direction"]);
                        const { elapsedtime: nextelapsedtime, position: targetPosition, color: targetColor = COLOR1 } = operation[nextidx];
                        const rate = (settime - elapsedtime) / (nextelapsedtime - elapsedtime);
                        const position = [
                            sourcePosition[0] - (sourcePosition[0] - targetPosition[0]) * rate,
                            sourcePosition[1] - (sourcePosition[1] - targetPosition[1]) * rate,
                            sourcePosition[2] - (sourcePosition[2] - targetPosition[2]) * rate
                        ];
                        const color = iconGradation ? [
                            (sourceColor[0] + rate * (targetColor[0] - sourceColor[0])) | 0,
                            (sourceColor[1] + rate * (targetColor[1] - sourceColor[1])) | 0,
                            (sourceColor[2] + rate * (targetColor[2] - sourceColor[2])) | 0
                        ] : sourceColor;
                        movedData.push(assign({}, otherProps1, otherProps2, { settime,
                            position, sourcePosition, targetPosition,
                            color, direction, sourceColor, targetColor, movesbaseidx }, getOptionFunction(props, movesbaseidx, idx)));
                    }
                }
                return movedData;
            }, []);
            retrunData.movedData = [...movedData];
        }
    }
    if (locationBase.length > 0) {
        const { settime } = props;
        const locationData = locationBase.reduce((data, current, index) => {
            if (current.targetPosition[0] === current.sourcePosition[0] &&
                current.targetPosition[1] === current.sourcePosition[1] &&
                current.targetPosition[2] === current.sourcePosition[2]) {
                const position = [...current.targetPosition];
                data.push(Object.assign(Object.assign({}, current), { position, settime, movesbaseidx: index }));
                return data;
            }
            else {
                const difference = props.settime - current.elapsedtime;
                let position = [];
                if (0 < locationMoveDuration && difference <= locationMoveDuration) {
                    const rate = difference / locationMoveDuration;
                    position = current.targetPosition.map((targetPosition, index) => {
                        return current.sourcePosition[index] - (current.sourcePosition[index] - targetPosition) * rate;
                    });
                }
                else {
                    position = [...current.targetPosition];
                }
                data.push(Object.assign(Object.assign({}, current), { position, settime, movesbaseidx: index }));
                return data;
            }
        }, []);
        if (locationData.length > 0) {
            retrunData.locationData = [...locationData];
        }
    }
    if (getExtractedDataFunc) {
        retrunData.ExtractedData = getExtractedDataFunc(props);
    }
    return retrunData;
};
const routeDelete = (movesbaseidx, props) => {
    const { actions, clickedObject, routePaths } = props;
    if (clickedObject.length > 0 && routePaths.length > 0) {
        if (clickedObject.length === 1) {
            actions.setClicked(null);
            actions.setRoutePaths([]);
        }
        else {
            const newClickedObject = clickedObject.filter(current => current.object.movesbaseidx !== movesbaseidx);
            actions.setClicked(newClickedObject);
            const newRoutePaths = routePaths.filter(current => current.movesbaseidx !== movesbaseidx);
            actions.setRoutePaths(newRoutePaths);
        }
    }
};
export const onHoverClick = (pickParams, getRouteColor, getRouteWidth, iconDesignations) => {
    const { mode, info } = pickParams;
    const { object, layer } = info;
    const { id, props } = layer;
    if (mode === 'hover' && props.onHover) {
        props.onHover(info);
    }
    if (mode === 'click' || mode === 'query') {
        if (props.onClick) {
            props.onClick(info);
        }
        else if (object && props.actions && props.movesbase && props.routePaths) {
            const { movesbaseidx } = object;
            const { actions, clickedObject, movesbase, routePaths } = props;
            const replaceGetRouteColor = {};
            if (iconDesignations) {
                for (const iconDesignationsElement of iconDesignations) {
                    replaceGetRouteColor[iconDesignationsElement.type] = iconDesignationsElement.getColor || getRouteColor;
                }
            }
            let deleted = false;
            if (clickedObject && clickedObject.length > 0) {
                if (clickedObject.findIndex((data) => data.object.movesbaseidx === movesbaseidx) >= 0) {
                    deleted = true;
                }
            }
            if (deleted) {
                routeDelete(movesbaseidx, props);
            }
            else {
                const newClickedObject = clickedObject || [];
                newClickedObject.push({ object, layer: { id } });
                const setRoutePaths = [];
                const { type, operation } = movesbase[movesbaseidx];
                let getColor = getRouteColor;
                if (type && replaceGetRouteColor.hasOwnProperty(type)) {
                    getColor = replaceGetRouteColor[type];
                }
                for (let j = 0; j < (operation.length - 1); j = (j + 1) | 0) {
                    const movedata = Object.assign({ type }, operation[j]);
                    const routeColor = getColor(movedata);
                    const routeWidth = getRouteWidth(movedata);
                    const { position } = operation[j];
                    const { position: nextposition } = operation[(j + 1) | 0];
                    setRoutePaths.push({
                        type, movesbaseidx,
                        sourcePosition: position,
                        targetPosition: nextposition,
                        routeColor: routeColor || COLOR1,
                        routeWidth: routeWidth || 10,
                    });
                }
                actions.setClicked(newClickedObject);
                actions.setRoutePaths([...routePaths, ...setRoutePaths]);
            }
        }
    }
};
export const checkClickedObjectToBeRemoved = (movedData, clickedObject, routePaths, actions) => {
    if (clickedObject && clickedObject.length > 0 && routePaths.length > 0) {
        for (const clickedObjectElement of clickedObject) {
            let deleted = true;
            for (const movedDataElement of movedData) {
                if (clickedObjectElement.object.movesbaseidx === movedDataElement.movesbaseidx) {
                    deleted = false;
                    break;
                }
            }
            if (deleted) {
                routeDelete(clickedObjectElement.object.movesbaseidx, { routePaths, clickedObject, actions });
            }
        }
    }
};
export const defaultMapStateToProps = (state) => getContainerProp(state);
export const connectToHarmowareVis = (App, moreActions = null, mapStateToProps = defaultMapStateToProps) => {
    const extendedActions = assign({}, Actions, moreActions);
    function mapDispatchToProps(dispatch) {
        return { actions: bindActionCreators(extendedActions, dispatch) };
    }
    return connect(mapStateToProps, mapDispatchToProps)(App);
};
export const getCombinedReducer = (combined) => combineReducers(Object.assign({ base: reducers }, combined));
//# sourceMappingURL=index.js.map