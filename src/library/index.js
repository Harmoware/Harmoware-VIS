// @flow

import { connect } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import * as Actions from '../actions';
import reducers from '../reducers';
import type { AnalyzedBaseData, BasedState as State, BasedProps as Props,
  Bounds, MovesbaseFile, Movesbase, MovedData, Depotsbase, DepotsData, Viewport,
  GetDepotsOptionFunc, GetMovesOptionFunc, ClickedObject, DataOption, LineMapData } from '../types';

const scaleInfo = { scaleZ: 0, xMid: 0, yMid: 0 };
const EQUATOR_RADIUS = 6378136.6;
const DEGREE_SCALE = 100;
const getLongitiudeDegree = (latitude: number): number => ((360 * DEGREE_SCALE) /
  (2 * Math.PI * (EQUATOR_RADIUS * Math.cos((latitude * Math.PI) / 180.0))));

export const getContainerProp = (state: any) : any => ({
  ...state.base
});

// LoopTime とは１ループにかける時間（ミリ秒）
export const calcLoopTime =
(timeLength : number, secperhour: number) : number => (timeLength / 3600) * 1000 * secperhour;

function normalize(nonmapView: boolean, movesbase: Movesbase): Movesbase {
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
(nonmapView: boolean, inputData: (Movesbase | MovesbaseFile)) : AnalyzedBaseData => {
  let baseTimeBegin: void | number;
  let baseTimeLength: void | number;
  let baseBounds: void | Bounds;
  let basemovesbase: Movesbase;

  if (Array.isArray(inputData)) { // Array?
    basemovesbase = inputData;
  } else {
    baseTimeBegin = inputData.timeBegin;
    baseTimeLength = inputData.timeLength;
    baseBounds = inputData.bounds;
    basemovesbase = inputData.movesbase;
  }

  let timeBegin: number = typeof baseTimeBegin === 'number' ? baseTimeBegin : 0;
  let timeLength: number = typeof baseTimeLength === 'number' ? baseTimeLength : 0;
  let bounds: Bounds = typeof baseBounds !== 'undefined' ? baseBounds : {
    westlongitiude: 0, eastlongitiude: 0, southlatitude: 0, northlatitude: 0
  };

  const movesbase: Movesbase = basemovesbase.slice();
  let timeEnd: number = 0;
  for (let i = 0, lengthi = basemovesbase.length; i < lengthi; i += 1) {
    const { departuretime, arrivaltime, operation } = basemovesbase[i];
    if (!baseTimeBegin || !baseTimeLength) {
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
      if (!baseBounds && longitude && latitude && !nonmapView) {
        let { eastlongitiude, westlongitiude, southlatitude, northlatitude } = bounds || {};
        eastlongitiude = !eastlongitiude ? longitude : Math.max(eastlongitiude, longitude);
        westlongitiude = !westlongitiude ? longitude : Math.min(westlongitiude, longitude);
        southlatitude = !southlatitude ? latitude : Math.min(southlatitude, latitude);
        northlatitude = !northlatitude ? latitude : Math.max(northlatitude, latitude);
        bounds = { eastlongitiude, westlongitiude, southlatitude, northlatitude };
      }
    }
  }
  if (!baseTimeBegin || !baseTimeLength) {
    timeLength = timeEnd - timeBegin;
    for (let k = 0, lengthk = basemovesbase.length; k < lengthk; k += 1) {
      movesbase[k].departuretime -= timeBegin;
      movesbase[k].arrivaltime -= timeBegin;
      const { operation } = basemovesbase[k];
      for (let l = 0, lengthl = operation.length; l < lengthl; l += 1) {
        operation[l].elapsedtime -= timeBegin;
      }
    }
  }
  const viewport: Viewport = nonmapView ? {
    lookAt: [0, 0, 0], distance: 200, rotationX: 60, rotationY: 0, fov: 50,
  } : {
    longitude: (bounds.westlongitiude + bounds.eastlongitiude) / 2,
    latitude: (bounds.southlatitude + bounds.southlatitude + bounds.northlatitude) / 3,
  };
  return { timeBegin, timeLength, bounds, movesbase: normalize(nonmapView, movesbase), viewport };
};

export const analyzeDepotsBase =
(nonmapView: boolean, depotsBase: Depotsbase) : Depotsbase => {
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
  const { color, optColor, optElevation, normal } = ((props.depotsBase[idx]: any): DataOption);
  const retValue = {};
  if (color) retValue.color = color;
  if (optColor) retValue.optColor = optColor;
  if (optElevation) retValue.optElevation = optElevation;
  if (normal) retValue.normal = normal;
  return retValue;
};
export const getDepots = (props: Props): DepotsData => {
  const { nonmapView, depotsBase, bounds, getDepotsOptionFunc } = props;
  const depotsData: DepotsData = [];
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
          position: [parseFloat(position[0]), parseFloat(position[1]), parseFloat(position[2])],
          ...getOptionFunction(props, i)
        };
        depotsData.push(itemmap);
      }
    }
  }
  return depotsData;
};

const defMovesOptionFunc = (props: Props, idx1: number, idx2: number) : DataOption => {
  const { color, optColor, optElevation, normal } =
    ((props.movesbase[idx1].operation[idx2]: any): DataOption);
  const retValue = {};
  if (color) retValue.color = color;
  if (optColor) retValue.optColor = optColor;
  if (optElevation) retValue.optElevation = optElevation;
  if (normal) retValue.normal = normal;
  return retValue;
};
export const getMoveObjects = (props : Props): MovedData => {
  const { movesbase, settime, timeBegin, timeLength, getMovesOptionFunc } = props;
  const movedData: MovedData = [];
  const getOptionFunction: GetMovesOptionFunc = getMovesOptionFunc || defMovesOptionFunc;

  for (let i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
    const { departuretime, arrivaltime, operation } = movesbase[i];
    if (typeof departuretime !== 'number' || typeof arrivaltime !== 'number') {
      // console.log(`バス運行実績データなし=>${i}`);
    } else
    if (timeBegin > 0 && timeLength > 0 && departuretime <= settime && settime < arrivaltime) {
      for (let j = 0, lengthj = operation.length; j < lengthj - 1; j += 1) {
        const { elapsedtime, position } = operation[j];
        const { elapsedtime: nextelapsedtime, position: nextposition } = operation[j + 1];
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
            position: [position[0] - positionprogress[0], position[1] - positionprogress[1],
              position[2] - positionprogress[2]],
            ...getOptionFunction(props, i, j),
            movesbaseidx: i
          });
        }
      }
    }
  }
  return movedData;
};

export const getClickedObjectToBeRemoved =
  (movedData: MovedData, clickedObject: ClickedObject) : boolean => {
    if (!clickedObject) {
      return false;
    }
    for (let i = 0, lengthi = movedData.length; i < lengthi; i += 1) {
      const { movesbaseidx } = movedData[i];
      if (clickedObject && clickedObject.object.movesbaseidx === movesbaseidx) {
        return false;
      }
    }
    return true;
  };

export const analyzelinemapData =
  (nonmapView: boolean, linemapData: LineMapData) : LineMapData => {
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

export const defaultMapStateToProps = (state : any) : any => getContainerProp(state);

export const connectToHarmowareVis = (App: any, moreActions: any = null,
  mapStateToProps: any = defaultMapStateToProps) => {
  const extendedActions = Object.assign({}, Actions, moreActions);

  function mapDispatchToProps(dispatch: any) {
    return { actions: bindActionCreators(extendedActions, dispatch) };
  }

  return connect(mapStateToProps, mapDispatchToProps)(App);
};

export const getCombinedReducer = (combined: Object | null) : any => {
  return combineReducers({ base: reducers, ...combined });
};
