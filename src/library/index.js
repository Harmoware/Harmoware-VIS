// @flow

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions';
import type { AnalyzedBaseData, BasedState as State, BasedProps as Props,
  Bounds, MovesbaseFile, Movesbase, MovedData, DepotsData, Viewport,
  GetDepotsOptionFunc, GetMovesOptionFunc, ClickedObject } from '../types';

export const getContainerProp = (state: any) : any => ({
  ...state.base
});

export const calcLoopTime =
(timeLength : number, secpermin: number) : number => (timeLength / 60) * 1000 * secpermin;

export const analyzeMovesBase = (inputData: Movesbase | MovesbaseFile) : AnalyzedBaseData => {
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
  if (!baseTimeBegin || !baseTimeLength || !baseBounds) {
    let timeEnd: number = 0;
    for (let i = 0, lengthi = basemovesbase.length; i < lengthi; i += 1) {
      const { departuretime, arrivaltime, operation } = basemovesbase[i];
      if (!baseTimeBegin || !baseTimeLength) {
        timeBegin = !timeBegin ? departuretime : Math.min(timeBegin, departuretime);
        timeEnd = !timeEnd ? arrivaltime : Math.max(timeEnd, arrivaltime);
      }
      for (let j = 0, lengthj = operation.length; j < lengthj; j += 1) {
        const { longitude, latitude } = operation[j];
        if (!baseBounds) {
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
  }
  const viewport: Viewport = {
    longitude: (bounds.westlongitiude + bounds.eastlongitiude) / 2,
    latitude: (bounds.southlatitude + bounds.southlatitude + bounds.northlatitude) / 3,
  };
  return { timeBegin, timeLength, bounds, movesbase, viewport };
};

export const getDepots = (props: Props): DepotsData => {
  const { depotsBase, bounds, getDepotsOptionFunc } = props;
  const depotsData: DepotsData = [];
  const getOptionFunction: GetDepotsOptionFunc = getDepotsOptionFunc || (() => {});

  if (depotsBase.length > 0 && typeof bounds !== 'undefined' && Object.keys(bounds).length > 0) {
    for (let i = 0, lengthi = depotsBase.length; i < lengthi; i += 1) {
      const { longitude, latitude } = depotsBase[i];
      if (bounds.westlongitiude <= longitude && longitude <= bounds.eastlongitiude &&
        bounds.southlatitude <= latitude && latitude <= bounds.northlatitude) {
        const itemmap = {
          position: [parseFloat(longitude), parseFloat(latitude), 1],
          ...getOptionFunction(props, i)
        };
        depotsData.push(itemmap);
      }
    }
  }
  return depotsData;
};

export const getMoveObjects = (props : Props): MovedData => {
  const { movesbase, settime, timeBegin, timeLength, getMovesOptionFunc } = props;
  const movedData: MovedData = [];
  const getOptionFunction: GetMovesOptionFunc = getMovesOptionFunc || (() => {});

  for (let i = 0, lengthi = movesbase.length; i < lengthi; i += 1) {
    const { departuretime, arrivaltime, operation } = movesbase[i];
    if (typeof departuretime !== 'number' || typeof arrivaltime !== 'number') {
      // console.log(`バス運行実績データなし=>${i}`);
    } else
    if (timeBegin > 0 && timeLength > 0 && departuretime <= settime && settime < arrivaltime) {
      for (let j = 0, lengthj = operation.length; j < lengthj - 1; j += 1) {
        const { elapsedtime, longitude, latitude } = operation[j];
        const { elapsedtime: nextelapsedtime,
          longitude: nextlongitude, latitude: nextlatitude } = operation[j + 1];
        if (elapsedtime <= settime && settime < nextelapsedtime) {
          const elapsedtimespan = settime - elapsedtime;
          const timespan = nextelapsedtime - elapsedtime;
          const longitudespan = longitude - nextlongitude;
          const latitudespan = latitude - nextlatitude;
          const longitudeprogress = longitudespan * (elapsedtimespan / timespan);
          const latitudeprogress = latitudespan * (elapsedtimespan / timespan);
          movedData.push({
            position: [longitude - longitudeprogress, latitude - latitudeprogress, 3],
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

export const defaultMapStateToProps = (state : any) : any => getContainerProp(state);

export const connectToHarmowareVis = (App: any, moreActions: any = null,
  mapStateToProps: any = defaultMapStateToProps) => {
  const extendedActions = Object.assign({}, Actions, moreActions);

  function mapDispatchToProps(dispatch: any) {
    return { actions: bindActionCreators(extendedActions, dispatch) };
  }

  return connect(mapStateToProps, mapDispatchToProps)(App);
};
