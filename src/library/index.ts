import { connect } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import * as Actions from '../actions';
import reducers from '../reducers';
import { ActionTypes, AnalyzedBaseData, BasedProps as Props, RoutePaths,
  Bounds, MovesbaseFile, Movesbase, MovedData, DepotsData, Viewport,
  GetDepotsOptionFunc, GetMovesOptionFunc, ClickedObject, EventInfo } from '../types';
import { COLOR1 } from '../constants/settings';

const getAverage = (array: number[]) => array.length &&
  array.reduce((previous, current) => previous + current) / array.length;
const radians = (degree: number) => degree * Math.PI / 180;
const degrees = (radian: number) => radian * 180 / Math.PI;

export const getContainerProp = <P>(state: P)  => {
  let prop = {};
  Object.keys(state).forEach((key) => {
    prop = Object.assign({}, prop, { ...state[key] });
  });
  return prop as P;
};

// LoopTime とは１ループにかける時間（ミリ秒）
export const calcLoopTime =
(timeLength : number, secperhour: number) : number => (timeLength / 3600) * 1000 * secperhour;

export const analyzeMovesBase =
(inputData: (Movesbase[] | MovesbaseFile)) : AnalyzedBaseData => {
  let baseTimeBegin: void | number;
  let baseTimeLength: void | number;
  let baseBounds: void | Bounds;
  let basemovesbase: Movesbase[];

  if (Array.isArray(inputData)) { // Array?
    basemovesbase = [...inputData];
  } else {
    baseTimeBegin = inputData.timeBegin;
    baseTimeLength = inputData.timeLength;
    baseBounds = inputData.bounds;
    basemovesbase = [...inputData.movesbase];
  }

  let timeBegin: number = typeof baseTimeBegin === 'number' ? baseTimeBegin : 0;
  let timeLength: number = typeof baseTimeLength === 'number' ? baseTimeLength : 0;
  let bounds: Bounds = typeof baseBounds !== 'undefined' ? baseBounds : {
    westlongitiude: 0, eastlongitiude: 0, southlatitude: 0, northlatitude: 0
  };
  const movesbase: Movesbase[] = basemovesbase;

  if(movesbase.length <= 0){
    return { timeBegin, timeLength, bounds, movesbase, viewport:{} };
  }

  let timeEnd: number = 0;
  const longArray: number[] = [];
  const latiArray: number[] = [];
  for (let i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
    const { departuretime, arrivaltime, operation } = movesbase[i];
    movesbase[i].movesbaseidx = i;
    if (typeof baseTimeBegin !== 'number' || typeof baseTimeLength !== 'number') {
      timeBegin = !timeBegin ? departuretime : Math.min(timeBegin, departuretime);
      timeEnd = !timeEnd ? arrivaltime : Math.max(timeEnd, arrivaltime);
    }

    for (let j = 0, lengthj = operation.length; j < lengthj; j += 1) {
      const { longitude, latitude, position=[longitude, latitude, 3] } = operation[j];
      if (typeof operation[j].position === 'undefined') {
        operation[j].position = position;
      }
      longArray.push(+position[0]);
      latiArray.push(+position[1]);
      if (!baseBounds && position[0] && position[1]) {
        let { eastlongitiude, westlongitiude, southlatitude, northlatitude } = bounds || null;
        eastlongitiude = !eastlongitiude ? position[0] : Math.max(eastlongitiude, position[0]);
        westlongitiude = !westlongitiude ? position[0] : Math.min(westlongitiude, position[0]);
        southlatitude = !southlatitude ? position[1] : Math.min(southlatitude, position[1]);
        northlatitude = !northlatitude ? position[1] : Math.max(northlatitude, position[1]);
        bounds = { eastlongitiude, westlongitiude, southlatitude, northlatitude };
      }
    }
    let direction = 0;
    for (let j = 0, lengthj = operation.length; j < (lengthj-1); j += 1) {
      const { position: sourcePosition } = operation[j];
      const { position: targetPosition } = operation[j+1];
      if(sourcePosition[0] === targetPosition[0] && sourcePosition[1] === targetPosition[1]){
        operation[j].direction = direction;
        continue;
      }
      const x1 = radians(sourcePosition[0]);
      const y1 = radians(sourcePosition[1]);
      const x2 = radians(targetPosition[0]);
      const y2 = radians(targetPosition[1]);
      const deltax = x2 - x1;
      direction = degrees(Math.atan2(Math.sin(deltax), 
          Math.cos(y1) * Math.tan(y2) - Math.sin(y1) * Math.cos(deltax))) % 360;
      operation[j].direction = direction;
    }
  }
  if (typeof baseTimeBegin !== 'number' || typeof baseTimeLength !== 'number') {
    timeLength = timeEnd - timeBegin;
  }else{
    for (let k = 0, lengthk = movesbase.length; k < lengthk; k += 1) {
      movesbase[k].departuretime += timeBegin;
      movesbase[k].arrivaltime += timeBegin;
      const { operation } = movesbase[k];
      for (let l = 0, lengthl = operation.length; l < lengthl; l += 1) {
        operation[l].elapsedtime += timeBegin;
      }
    }
  }
  const viewport: Viewport = {
    longitude: getAverage(longArray), latitude: getAverage(latiArray),
  };
  return { timeBegin, timeLength, bounds, movesbase, viewport };
};

const defDepotsOptionFunc = (props: Props, idx: number) : Object => {
  const {position, longitude, latitude, ...retValue} = props.depotsBase[idx];
  return retValue;
};
export const getDepots = (props: Props): DepotsData[] => {
  const { depotsBase, bounds, getDepotsOptionFunc } = props;
  const depotsData: DepotsData[] = [];
  const getOptionFunction: GetDepotsOptionFunc = getDepotsOptionFunc || defDepotsOptionFunc;

  const areadepots = depotsBase.filter((data)=>{
    if(bounds.westlongitiude === 0 && bounds.eastlongitiude === 0 &&
      bounds.southlatitude === 0 && bounds.northlatitude === 0){
      return true;
    }
    const { longitude, latitude, position=[longitude, latitude, 1] } = data;
    return (bounds.westlongitiude <= position[0] && position[0] <= bounds.eastlongitiude &&
      bounds.southlatitude <= position[1] && position[1] <= bounds.northlatitude);
  });
  if (areadepots.length > 0 && typeof bounds !== 'undefined' && Object.keys(bounds).length > 0) {
    for (let i = 0, lengthi = areadepots.length; i < lengthi; i += 1) {
      const { longitude, latitude, position=[longitude, latitude, 1] } = areadepots[i];
      depotsData.push({
        longitude: position[0],
        latitude: position[1],
        position,
        ...getOptionFunction(props, i)
      });
    }
  }
  return depotsData;
};

const defMovesOptionFunc = (props: Props, idx1: number, idx2: number) : Object => {
  const {departuretime, arrivaltime, operation, ...retValue1} = props.movesbase[idx1];
  const {elapsedtime, position, longitude, latitude, ...retValue2} = operation[idx2];
  return Object.assign(retValue1,retValue2);
};
export const getMoveObjects = (props : Props): MovedData[] => {
  const { movesbase, movedData:prevMovedData, settime, secperhour, timeBegin, timeLength, getMovesOptionFunc } = props;
  if(prevMovedData.length > 0){
    if(Math.abs(prevMovedData[0].settime - settime) <= 1 / (secperhour / 120) ) return prevMovedData;
  }
  const getOptionFunction: GetMovesOptionFunc = getMovesOptionFunc || defMovesOptionFunc;

  const selectmovesbase = movesbase.filter((data)=>{
    const { departuretime, arrivaltime } = data;
    return (timeBegin > 0 && timeLength > 0 && departuretime <= settime && settime < arrivaltime);
  });
  const movedData: MovedData[] = new Array(selectmovesbase.length);
  for (let i = 0, lengthi = selectmovesbase.length; i < lengthi; i += 1) {
    const { operation, movesbaseidx } = selectmovesbase[i];
    for (let j = 0, lengthj = operation.length; j < lengthj - 1; j += 1) {
      const { elapsedtime } = operation[j];
      const { elapsedtime: nextelapsedtime } = operation[j + 1];
      if (elapsedtime <= settime && settime < nextelapsedtime) {
        const { position:[longitude, latitude, elevation], color=COLOR1, direction=0 } = operation[j];
        const { position:[nextlongitude, nextlatitude, nextelevation],
          color: nextcolor=COLOR1 } = operation[j + 1];
        const pos_rate = [longitude, latitude, elevation];
        const rate = (settime - elapsedtime) / (nextelapsedtime - elapsedtime);
        pos_rate[0] -= (longitude - nextlongitude) * rate;
        pos_rate[1] -= (latitude - nextlatitude) * rate;
        pos_rate[2] -= (elevation - nextelevation) * rate;
        movedData[i] = Object.assign(new Object(),{
          settime,
          longitude: pos_rate[0],
          latitude: pos_rate[1],
          position: pos_rate,
          sourcePosition: [longitude, latitude, elevation],
          targetPosition: [nextlongitude, nextlatitude, nextelevation],
          direction,
          sourceColor: color,
          targetColor: nextcolor,
          movesbaseidx},
          getOptionFunction(props, movesbaseidx, j)
        );
        break;
      }
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
export const onHoverClick = (pickParams: pickParams, getRouteColor:Function, getRouteWidth:Function): void => {
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
      let deleted = false;
      if (clickedObject && clickedObject.length > 0) {
        for (let i = 0, lengthi = clickedObject.length; i < lengthi; i += 1) {
          if (clickedObject[i].object.movesbaseidx === movesbaseidx) {
            deleted = true;
            break;
          }
        }
      }
      if (deleted) {
        routeDelete(movesbaseidx, props);
      } else {
        const newClickedObject = clickedObject || [];
        newClickedObject.push({ object, layer: { id } });
        const setRoutePaths = [];
        const { operation } = movesbase[movesbaseidx];
        for (let j = 0; j < (operation.length - 1); j += 1) {
          const { position } = operation[j];
          const routeColor = getRouteColor(operation[j]);
          const routeWidth = getRouteWidth(operation[j]);
          const { position: nextposition } = operation[j + 1];
          setRoutePaths.push({
            movesbaseidx,
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
    for (let i = 0, lengthi = clickedObject.length; i < lengthi; i += 1) {
      let deleted = true;
      for (let j = 0, lengthj = movedData.length; j < lengthj; j += 1) {
        if (clickedObject[i].object.movesbaseidx === movedData[j].movesbaseidx) {
          deleted = false;
          break;
        }
      }
      if (deleted) {
        routeDelete(clickedObject[i].object.movesbaseidx, { routePaths, clickedObject, actions });
      }
    }
  }
};

export const defaultMapStateToProps = <P>(state: P)  => getContainerProp<P>(state);

export const connectToHarmowareVis = (App, moreActions = null,
  mapStateToProps = defaultMapStateToProps) => {
  const extendedActions = Object.assign({}, Actions, moreActions);

  function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(extendedActions, dispatch) };
  }

  return connect(mapStateToProps, mapDispatchToProps)(App);
};

export const getCombinedReducer = (combined?: object) =>
  combineReducers({ base: reducers, ...combined });
