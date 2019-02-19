import { connect } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import * as Actions from '../actions';
import reducers from '../reducers';
import { ActionTypes, AnalyzedBaseData, BasedProps as Props, RoutePaths,
  Bounds, MovesbaseFile, Movesbase, MovedData, Depotsbase, DepotsData, Viewport,
  GetDepotsOptionFunc, GetMovesOptionFunc, ClickedObject, DataOption, LineMapData, EventInfo } from '../types';
import { COLOR1 } from '../constants/settings';

const scaleInfo = { scaleZ: 0, xMid: 0, yMid: 0 };
const EQUATOR_RADIUS = 6378136.6;
const DEGREE_SCALE = 100;
const getLongitiudeDegree = (latitude: number): number => ((360 * DEGREE_SCALE) /
  (2 * Math.PI * (EQUATOR_RADIUS * Math.cos((latitude * Math.PI) / 180.0))));

const getAverage = (array: number[]) => array.length &&
  array.reduce((previous, current) => previous + current) / array.length;

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

function normalize(nonmapView: boolean, movesbase: Movesbase[]): Movesbase[] {
  if (!nonmapView) return movesbase;
  let xMin = Infinity;
  let yMin = Infinity;
  let xMax = -Infinity;
  let yMax = -Infinity;
  for (let i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
    const { operation } = movesbase[i];
    for (let j = 0, lengthj = operation.length; j < lengthj; j += 1) {
      const { position } = operation[j];
      xMin = Math.min(xMin, position[0]);
      yMin = Math.min(yMin, position[1]);
      xMax = Math.max(xMax, position[0]);
      yMax = Math.max(yMax, position[1]);
    }
  }
  scaleInfo.xMid = (xMin + xMax) / 2;
  scaleInfo.yMid = (yMin + yMax) / 2;
  scaleInfo.scaleZ = getLongitiudeDegree(scaleInfo.yMid);
  for (let k = 0, lengthk = movesbase.length; k < lengthk; k += 1) {
    const { operation } = movesbase[k];
    for (let l = 0, lengthl = operation.length; l < lengthl; l += 1) {
      const { position } = operation[l];
      position[0] = (position[0] - scaleInfo.xMid) / scaleInfo.scaleZ;
      position[1] = (position[1] - scaleInfo.yMid) / scaleInfo.scaleZ;
      position[2] /= DEGREE_SCALE;
    }
  }
  return movesbase;
}

export const analyzeMovesBase =
(nonmapView: boolean, inputData: (Movesbase[] | MovesbaseFile)) : AnalyzedBaseData => {
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
  let timeEnd: number = 0;
  const longArray: number[] = [];
  const latiArray: number[] = [];
  for (let i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
    const { departuretime, arrivaltime, operation } = movesbase[i];
    if (typeof baseTimeBegin !== 'number' || typeof baseTimeLength !== 'number') {
      timeBegin = !timeBegin ? departuretime : Math.min(timeBegin, departuretime);
      timeEnd = !timeEnd ? arrivaltime : Math.max(timeEnd, arrivaltime);
    }

    for (let j = 0, lengthj = operation.length; j < lengthj; j += 1) {
      const { position } = operation[j];
      let { longitude, latitude } = operation[j];
      if (typeof position !== 'undefined') {
        longitude = position[0];
        latitude = position[1];
      } else {
        operation[j].position = [longitude, latitude, 3];
      }
      longArray.push(+longitude);
      latiArray.push(+latitude);
      if (!baseBounds && longitude && latitude && !nonmapView) {
        let { eastlongitiude, westlongitiude, southlatitude, northlatitude } = bounds || null;
        eastlongitiude = !eastlongitiude ? longitude : Math.max(eastlongitiude, longitude);
        westlongitiude = !westlongitiude ? longitude : Math.min(westlongitiude, longitude);
        southlatitude = !southlatitude ? latitude : Math.min(southlatitude, latitude);
        northlatitude = !northlatitude ? latitude : Math.max(northlatitude, latitude);
        bounds = { eastlongitiude, westlongitiude, southlatitude, northlatitude };
      }
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
  const viewport: Viewport = nonmapView ? {
    lookAt: [0, 0, 0], distance: 200, rotationX: 60, rotationY: 0, fov: 50,
  } : {
    longitude: getAverage(longArray), latitude: getAverage(latiArray),
  };
  return { timeBegin, timeLength, bounds, movesbase: normalize(nonmapView, movesbase), viewport };
};

export const analyzeDepotsBase =
(nonmapView: boolean, depotsBase: Depotsbase[]) : Depotsbase[] => {
  if (!nonmapView) return depotsBase;
  let xMin = Infinity;
  let yMin = Infinity;
  let xMax = -Infinity;
  let yMax = -Infinity;
  for (let i = 0, lengthi = depotsBase.length; i < lengthi; i += 1) {
    const { position } = depotsBase[i];
    xMin = Math.min(xMin, position[0]);
    yMin = Math.min(yMin, position[1]);
    xMax = Math.max(xMax, position[0]);
    yMax = Math.max(yMax, position[1]);
  }
  const xMid = scaleInfo.xMid || (xMin + xMax) / 2;
  const yMid = scaleInfo.yMid || (yMin + yMax) / 2;
  const scaleZ = scaleInfo.scaleZ || getLongitiudeDegree(yMid);
  for (let j = 0, lengthj = depotsBase.length; j < lengthj; j += 1) {
    const { position } = depotsBase[j];
    position[0] = (position[0] - xMid) / scaleZ;
    position[1] = (position[1] - yMid) / scaleZ;
    position[2] /= DEGREE_SCALE;
  }
  if (!scaleInfo.xMid) scaleInfo.xMid = xMid;
  if (!scaleInfo.yMid) scaleInfo.yMid = yMid;
  if (!scaleInfo.scaleZ) scaleInfo.scaleZ = scaleZ;
  return depotsBase;
};

const defDepotsOptionFunc = (props: Props, idx: number) : DataOption => {
  const retValue: DataOption = {};
  const basedata = props.depotsBase[idx];
  Object.keys(basedata).forEach((key) => {
    if (!(key === 'position' || key === 'longitude' || key === 'latitude')) {
      retValue[key] = basedata[key];
    }
  });
  return retValue;
};
export const getDepots = (props: Props): DepotsData[] => {
  const { nonmapView, depotsBase, bounds, getDepotsOptionFunc } = props;
  const depotsData: DepotsData[] = [];
  const getOptionFunction: GetDepotsOptionFunc = getDepotsOptionFunc || defDepotsOptionFunc;

  if (nonmapView || (depotsBase.length > 0 && typeof bounds !== 'undefined' && Object.keys(bounds).length > 0)) {
    for (let i = 0, lengthi = depotsBase.length; i < lengthi; i += 1) {
      const { longitude, latitude } = depotsBase[i];
      let { position } = depotsBase[i];
      if (typeof position === 'undefined') {
        position = [longitude, latitude, 1];
      }
      if (nonmapView ||
        (bounds.westlongitiude <= position[0] && position[0] <= bounds.eastlongitiude &&
        bounds.southlatitude <= position[1] && position[1] <= bounds.northlatitude)) {
        const itemmap = {
          longitude: parseFloat(position[0].toString()),
          latitude: parseFloat(position[1].toString()),
          position: [parseFloat(position[0].toString()), parseFloat(position[1].toString()), parseFloat(position[2].toString())],
          ...getOptionFunction(props, i)
        };
        depotsData.push(itemmap);
      }
    }
  }
  return depotsData;
};

const defMovesOptionFunc = (props: Props, idx1: number, idx2: number) : DataOption => {
  const retValue = {};
  const basedata = props.movesbase[idx1];
  Object.keys(basedata).forEach((key1) => {
    if (!(key1 === 'departuretime' || key1 === 'arrivaltime' || key1 === 'operation')) {
      retValue[key1] = basedata[key1];
    }
  });
  const operationdata = basedata.operation[idx2];
  Object.keys(operationdata).forEach((key2) => {
    if (!(key2 === 'elapsedtime' || key2 === 'position' || key2 === 'longitude' || key2 === 'latitude')) {
      retValue[key2] = operationdata[key2];
    }
  });
  return retValue;
};
export const getMoveObjects = (props : Props): MovedData[] => {
  const { movesbase, settime, timeBegin, timeLength, getMovesOptionFunc } = props;
  const movedData: MovedData[] = [];
  const getOptionFunction: GetMovesOptionFunc = getMovesOptionFunc || defMovesOptionFunc;

  for (let i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
    const { departuretime, arrivaltime, operation } = movesbase[i];
    if (typeof departuretime !== 'number' || typeof arrivaltime !== 'number') {
      // console.log(`バス運行実績データなし=>${i}`);
    } else
    if (timeBegin > 0 && timeLength > 0 && departuretime <= settime && settime < arrivaltime) {
      for (let j = 0, lengthj = operation.length; j < lengthj - 1; j += 1) {
        const { elapsedtime, position, color } = operation[j];
        const { elapsedtime: nextelapsedtime, position: nextposition,
          color: nextcolor } = operation[j + 1];
        if (elapsedtime <= settime && settime < nextelapsedtime) {
          const elapsedtimespan = settime - elapsedtime;
          const timespan = nextelapsedtime - elapsedtime;
          const positionspan = [];
          positionspan[0] = position[0] - nextposition[0];
          positionspan[1] = position[1] - nextposition[1];
          positionspan[2] = position[2] - nextposition[2];
          const positionprogress = [];
          positionprogress[0] = positionspan[0] * (elapsedtimespan / timespan);
          positionprogress[1] = positionspan[1] * (elapsedtimespan / timespan);
          positionprogress[2] = positionspan[2] * (elapsedtimespan / timespan);
          movedData.push({
            longitude: position[0] - positionprogress[0],
            latitude: position[1] - positionprogress[1],
            position: [position[0] - positionprogress[0], position[1] - positionprogress[1],
              position[2] - positionprogress[2]],
            sourcePosition: position,
            targetPosition: nextposition,
            sourceColor: color || COLOR1,
            targetColor: nextcolor || COLOR1,
            ...getOptionFunction(props, i, j),
            movesbaseidx: i,
          });
        }
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
export const onHoverClick = (pickParams: pickParams): void => {
  const { mode, info } = pickParams;
  const { object, layer } = info;
  const { id, props } = layer;
  if (mode === 'hover') {
    props.onHover(info);
  }
  if (mode === 'click') {
    if (props.onClick.name !== 'noop') {
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
          const { position, color } = operation[j];
          const { position: nextposition } = operation[j + 1];
          setRoutePaths.push({
            movesbaseidx,
            sourcePosition: position,
            targetPosition: nextposition,
            color: color || COLOR1
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

export const analyzelinemapData =
  (nonmapView: boolean, linemapData: LineMapData[]) : LineMapData[] => {
    if (!nonmapView) return linemapData;
    let xMin = Infinity;
    let yMin = Infinity;
    let xMax = -Infinity;
    let yMax = -Infinity;
    for (let i = 0, lengthi = linemapData.length; i < lengthi; i += 1) {
      const { sourcePosition, targetPosition } = linemapData[i];
      xMin = Math.min(xMin, sourcePosition[0], targetPosition[0]);
      yMin = Math.min(yMin, sourcePosition[1], targetPosition[1]);
      xMax = Math.max(xMax, sourcePosition[0], targetPosition[0]);
      yMax = Math.max(yMax, sourcePosition[1], targetPosition[1]);
    }
    const xMid = scaleInfo.xMid || (xMin + xMax) / 2;
    const yMid = scaleInfo.yMid || (yMin + yMax) / 2;
    const scaleZ = scaleInfo.scaleZ || getLongitiudeDegree(yMid);
    for (let j = 0, lengthj = linemapData.length; j < lengthj; j += 1) {
      const { sourcePosition, targetPosition } = linemapData[j];
      sourcePosition[0] = (sourcePosition[0] - xMid) / scaleZ;
      sourcePosition[1] = (sourcePosition[1] - yMid) / scaleZ;
      sourcePosition[2] /= DEGREE_SCALE;
      targetPosition[0] = (targetPosition[0] - xMid) / scaleZ;
      targetPosition[1] = (targetPosition[1] - yMid) / scaleZ;
      targetPosition[2] /= DEGREE_SCALE;
    }
    if (!scaleInfo.xMid) scaleInfo.xMid = xMid;
    if (!scaleInfo.yMid) scaleInfo.yMid = yMid;
    if (!scaleInfo.scaleZ) scaleInfo.scaleZ = scaleZ;
    return linemapData;
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
