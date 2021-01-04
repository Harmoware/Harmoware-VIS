import { connect } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import * as Actions from '../actions';
import reducers from '../reducers';
import { ActionTypes, AnalyzedBaseData, InnerProps, RoutePaths, IconDesignation,
  Bounds, MovesbaseFile, Movesbase, MovedData, DepotsData, Viewport,
  GetDepotsOptionFunc, GetMovesOptionFunc, ClickedObject, EventInfo } from '../types';
import { COLOR1 } from '../constants/settings';

const {assign,keys} = Object;
const {PI:pi,min,max,abs,sin,cos,tan,atan2} = Math;
const {isArray} = Array;
const getAverage = (array: number[]) => array.length &&
  array.reduce((previous, current) => previous + current) / array.length;
const radians = (degree: number) => degree * pi / 180;
const degrees = (radian: number) => radian * 180 / pi;

const MIN_VALUE = -2147483648;
const MAX_VALUE = 2147483647;

export const getContainerProp = <P>(state: P)  => {
  let prop = {};
  keys(state).forEach((key) => {
    prop = assign({}, prop, { ...state[key] });
  });
  return prop as P;
};

export const safeCheck = (value: number): number => {
  if(value > MAX_VALUE || value < MIN_VALUE) {
    const contents = 'value overflow => '+value;
    console.log(contents);
    window.alert(contents);
  }
  return value;
};

export const safeAdd = (left: number, right: number): number => {
  if(right > 0 ? left > (MAX_VALUE-right) : left < (MIN_VALUE-right)) {
    const contents = 'addition overflow => '+left+' + '+right;
    console.log(contents);
    window.alert(contents);
  }
  return left + right;
};

export const safeSubtract = (left: number, right: number): number => {
  if (right > 0 ? left < MIN_VALUE + right : left > MAX_VALUE + right) {
    const contents = 'subtraction overflow => '+left+' - '+right;
    console.log(contents);
    window.alert(contents);
  }
  return left - right;
};

export const analyzeMovesBase =
(inputData: (Movesbase[] | MovesbaseFile)) : AnalyzedBaseData => {
  let baseTimeBegin: undefined | number;
  let baseTimeLength: undefined | number;
  let baseBounds: undefined | Bounds;
  let basemovesbase: Movesbase[];
  let elapsedtimeMode: string;

  if (isArray(inputData)) { // Array?
    basemovesbase = [...inputData];
  } else {
    baseTimeBegin = inputData.timeBegin;
    baseTimeLength = inputData.timeLength;
    baseBounds = inputData.bounds;
    basemovesbase = [...inputData.movesbase];
    elapsedtimeMode = inputData.elapsedtimeMode;
  }

  let timeBegin: number = typeof baseTimeBegin === 'number' ? baseTimeBegin : 0;
  safeCheck(timeBegin);
  let timeLength: number = typeof baseTimeLength === 'number' ? baseTimeLength : 0;
  safeCheck(timeLength);
  let bounds: Bounds = typeof baseBounds !== 'undefined' ? baseBounds : {
    westlongitiude: 0, eastlongitiude: 0, southlatitude: 0, northlatitude: 0
  };
  const movesbase: Movesbase[] = basemovesbase;

  if(movesbase.length <= 0){
    return { timeBegin, timeLength, bounds, movesbase, viewport:{} };
  }

  if (typeof baseTimeBegin !== 'number') {
    timeBegin = undefined;
  }
  let timeEnd: number = undefined;
  const longArray: number[] = [];
  const latiArray: number[] = [];
  for (let i = 0, lengthi = movesbase.length; i < lengthi; i=(i+1)|0) {
    const { operation } = movesbase[i];
    if(!operation || operation.length === 0){
      console.log('movesbase['+i+'] operation undefined');
    }
    for (let j = 0, lengthj = operation.length; j < lengthj; j=(j+1)|0) {
      const { longitude, latitude, position=[longitude, latitude, 3], elapsedtime } = operation[j];
      if(typeof elapsedtime !== 'number'){
        console.log('movesbase['+i+'] operation['+j+'] elapsedtime undefined');
        continue;
      }
      safeCheck(elapsedtime);
      if((typeof operation[j].longitude !== 'number' || typeof operation[j].latitude !== 'number') &&
        typeof operation[j].position === 'undefined'){
        continue;
      }
      if (typeof operation[j].position === 'undefined') {
        operation[j].position = position;
      }
      longArray.push(+position[0]);
      latiArray.push(+position[1]);
      if (!baseBounds && position[0] && position[1]) {
        let { eastlongitiude, westlongitiude, southlatitude, northlatitude } = bounds || null;
        eastlongitiude = !eastlongitiude ? position[0] : max(eastlongitiude, position[0]);
        westlongitiude = !westlongitiude ? position[0] : min(westlongitiude, position[0]);
        southlatitude = !southlatitude ? position[1] : min(southlatitude, position[1]);
        northlatitude = !northlatitude ? position[1] : max(northlatitude, position[1]);
        bounds = { eastlongitiude, westlongitiude, southlatitude, northlatitude };
      }
    }
    operation.sort((a,b)=>a.elapsedtime > b.elapsedtime?1:-1);
    movesbase[i].departuretime = operation[0].elapsedtime;
    movesbase[i].arrivaltime = operation[(operation.length-1)|0].elapsedtime;
    movesbase[i].movesbaseidx = i;
    if (typeof baseTimeBegin !== 'number') {
      timeBegin = timeBegin === undefined ? movesbase[i].departuretime : min(timeBegin, movesbase[i].departuretime);
    }
    if (typeof baseTimeLength !== 'number') {
      timeEnd = timeEnd === undefined ? movesbase[i].arrivaltime : max(timeEnd, movesbase[i].arrivaltime);
    }

    let direction = 0;
    for (let j = 0, lengthj = operation.length; j < (lengthj-1); j=(j+1)|0) {
      const elapsedtime = operation[j].elapsedtime;
      const findIndex = operation.findIndex((data)=>data.elapsedtime > elapsedtime);
      const nextidx = findIndex < 0 ? (j+1)|0 : findIndex;
      if(typeof operation[j].position === 'undefined' ||
        typeof operation[nextidx].position === 'undefined'){
        continue;
      }
      const { position: sourcePosition } = operation[j];
      const { position: targetPosition } = operation[nextidx];
      if(sourcePosition[0] === targetPosition[0] && sourcePosition[1] === targetPosition[1]){
        operation[j].direction = direction;
        continue;
      }
      const x1 = radians(sourcePosition[0]);
      const y1 = radians(sourcePosition[1]);
      const x2 = radians(targetPosition[0]);
      const y2 = radians(targetPosition[1]);
      const deltax = x2 - x1;
      direction = degrees(atan2(sin(deltax), 
          cos(y1) * tan(y2) - sin(y1) * cos(deltax))) % 360;
      operation[j].direction = direction;
    }
  }
  if (typeof baseTimeBegin !== 'number' && typeof baseTimeLength !== 'number') {
    timeLength = safeSubtract(timeEnd, timeBegin);
  }else{
    if(typeof baseTimeBegin === 'number'){
      if(!elapsedtimeMode || elapsedtimeMode !== 'UNIXTIME'){
        for (const movesbaseElement of movesbase) {
          movesbaseElement.departuretime = safeAdd(movesbaseElement.departuretime, timeBegin);
          movesbaseElement.arrivaltime = safeAdd(movesbaseElement.arrivaltime, timeBegin);
          const { operation } = movesbaseElement;
          for (const operationElement of operation) {
            operationElement.elapsedtime = safeAdd(operationElement.elapsedtime, timeBegin);
          }
        }
        if(typeof baseTimeLength !== 'number'){
          timeLength = timeEnd;
        }
      }else
      if(typeof baseTimeLength !== 'number'){
        timeLength = safeSubtract(timeEnd, timeBegin);
      }
    }else
    if(typeof baseTimeLength !== 'number'){
      timeLength = safeSubtract(timeEnd, timeBegin);
    }
  }
  if(longArray.length > 0 && latiArray.length > 0){
    const viewport: Viewport = {
      longitude: getAverage(longArray), latitude: getAverage(latiArray),
    };
    return { timeBegin, timeLength, bounds, movesbase, viewport };
  }else{
    return { timeBegin, timeLength, bounds, movesbase, viewport:{} };
  }
};

export const getDepots = (props: InnerProps): DepotsData[] => {
  const { settime, depotsBase, depotsData:prevData, getDepotsOptionFunc } = props;
  if(prevData.length > 0 && (abs(prevData[0].settime - settime) <= 1)){
    if(!getDepotsOptionFunc) return prevData;
  }
  const getOptionFunction: GetDepotsOptionFunc = getDepotsOptionFunc || (() => {return {};});

  if (depotsBase.length > 0) {
    const depotsData: DepotsData[] = [];
    for (let i = 0, lengthi = depotsBase.length; i < lengthi; i=(i+1)|0) {
      const { longitude, latitude, position=[longitude, latitude, 1], ...otherProps } = depotsBase[i];
      depotsData[i] = assign({},
        otherProps, { settime, position},
        getOptionFunction(props, i),
      );
    }
    return depotsData;
  }
  return [];
};

export const getMoveObjects = (props : InnerProps): MovedData[] => {
  const { movesbase, movedData:prevMovedData, settime, secperhour, timeLength,
    getMovesOptionFunc, iconGradation } = props;
    safeCheck(settime);
  if(prevMovedData.length > 0){
    if(abs(safeSubtract(prevMovedData[0].settime, settime)) <= 1 / (secperhour / 120)){
      if(!getMovesOptionFunc) return prevMovedData
    };
  }
  const getOptionFunction: GetMovesOptionFunc = getMovesOptionFunc || (() => {return {};});

  const selectmovesbase = movesbase.filter((data)=>{
    const { departuretime, arrivaltime } = data;
    return (timeLength > 0 && departuretime <= settime && settime < arrivaltime);
  });
  const movedData: MovedData[] = [];
  for (const movesbaseElement of selectmovesbase) {
    const { departuretime, arrivaltime, operation, movesbaseidx, ...otherProps1 } = movesbaseElement;
    const nextidx = operation.findIndex((data)=>data.elapsedtime > settime);
    const beforeElapsedtime = operation[nextidx-1].elapsedtime;
    const idx = operation.findIndex((data)=>data.elapsedtime === beforeElapsedtime);
    if(typeof operation[idx].position === 'undefined' ||
      typeof operation[nextidx].position === 'undefined'){
      const {elapsedtime, longitude, latitude, ...otherProps2} = operation[idx];
      movedData.push(assign({},
        otherProps1, otherProps2, { settime, movesbaseidx },
        getOptionFunction(props, movesbaseidx, idx),
      ));
    }else{
      const { elapsedtime, position:sourcePosition, longitude, latitude,
        color:sourceColor=COLOR1, direction=0, ...otherProps2 } = operation[idx];
      const { elapsedtime:nextelapsedtime, position:targetPosition,
        color:targetColor=COLOR1 } = operation[nextidx];
      const rate = (settime - elapsedtime) / (nextelapsedtime - elapsedtime);
      const position = [
        sourcePosition[0] - (sourcePosition[0] - targetPosition[0]) * rate,
        sourcePosition[1] - (sourcePosition[1] - targetPosition[1]) * rate,
        sourcePosition[2] - (sourcePosition[2] - targetPosition[2]) * rate
      ];
      const color = iconGradation ? [
        (sourceColor[0] + rate * (targetColor[0] - sourceColor[0]))|0,
        (sourceColor[1] + rate * (targetColor[1] - sourceColor[1]))|0,
        (sourceColor[2] + rate * (targetColor[2] - sourceColor[2]))|0
      ] : sourceColor;
      movedData.push(assign({}, otherProps1, otherProps2,
        { settime,
          position, sourcePosition, targetPosition,
          color, direction, sourceColor, targetColor, movesbaseidx},
        getOptionFunction(props, movesbaseidx, idx),
      ));
    }
  }
  return movedData;
};

const routeDelete = (movesbaseidx: number, props: {
  routePaths: RoutePaths[], clickedObject: ClickedObject[],
  actions: ActionTypes }): void => {
  const { actions, clickedObject, routePaths } = props;
  if (clickedObject.length > 0 && routePaths.length > 0) {
    if (clickedObject.length === 1) {
      actions.setClicked(null);
      actions.setRoutePaths([]);
    } else {
      const newClickedObject = clickedObject.filter(current => current.object.movesbaseidx !== movesbaseidx);
      actions.setClicked(newClickedObject);
      const newRoutePaths = routePaths.filter(current => current.movesbaseidx !== movesbaseidx);
      actions.setRoutePaths(newRoutePaths);
    }
  }
};

export interface pickParams {
  mode: string,
  info: EventInfo,
}
export const onHoverClick = (pickParams: pickParams, getRouteColor:Function,
  getRouteWidth:Function, iconDesignations:IconDesignation[]): void => {
  const { mode, info } = pickParams;
  const { object, layer } = info;
  const { id, props } = layer;
  if (mode === 'hover' && props.onHover) {
    props.onHover(info);
  }
  if (mode === 'click' || mode === 'query') {
    if (props.onClick) {
      props.onClick(info);
    } else
    if (object && props.actions) {
      const { movesbaseidx } = object;
      const { actions, clickedObject, movesbase, routePaths } = props;
      const replaceGetRouteColor = {};
      if(iconDesignations){
        for (const iconDesignationsElement of iconDesignations) {
          replaceGetRouteColor[iconDesignationsElement.type] = iconDesignationsElement.getColor || getRouteColor;
        }
      }
      let deleted = false;
      if (clickedObject && clickedObject.length > 0) {
        if(clickedObject.findIndex((data)=>data.object.movesbaseidx === movesbaseidx) >= 0){
          deleted = true;
        }
      }
      if (deleted) {
        routeDelete(movesbaseidx, props);
      } else {
        const newClickedObject = clickedObject || [];
        newClickedObject.push({ object, layer: { id } });
        const setRoutePaths = [];
        const { type, operation } = movesbase[movesbaseidx];
        let getColor = getRouteColor;
        if(type && replaceGetRouteColor.hasOwnProperty(type)){
          getColor = replaceGetRouteColor[type];
        }
        for (let j = 0; j < (operation.length - 1); j=(j+1)|0) {
          const { position, elapsedtime } = operation[j];
          const movedata = { type, ...operation[j] };
          const routeColor = getColor(movedata);
          const routeWidth = getRouteWidth(movedata);
          const findIndex = operation.findIndex((data)=>data.elapsedtime > elapsedtime);
          const nextidx = findIndex < 0 ? (j+1)|0 : findIndex;
          const { position: nextposition } = operation[nextidx];
          setRoutePaths.push({
            type ,movesbaseidx,
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

export const checkClickedObjectToBeRemoved = (
  movedData: MovedData[], clickedObject: null | ClickedObject[],
  routePaths: RoutePaths[], actions: ActionTypes): void => {
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

export const defaultMapStateToProps = <P>(state: P)  => getContainerProp<P>(state);

export const connectToHarmowareVis = (App, moreActions = null,
  mapStateToProps = defaultMapStateToProps) => {
  const extendedActions = assign({}, Actions, moreActions);

  function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(extendedActions, dispatch) };
  }

  return connect(mapStateToProps, mapDispatchToProps)(App);
};

export const getCombinedReducer = (combined?: object) =>
  combineReducers({ base: reducers, ...combined });
