import { call, put, takeEvery, select } from 'redux-saga/effects';
import Axios, {AxiosRequestConfig} from 'axios';
import * as csvtojson from 'csvtojson';
import * as iconv from 'iconv-lite';
import { settings, Actions as baseActions, getContainerProp, RoutePaths } from 'harmoware-vis';

import * as types from '../constants/action-types';
import { p02d, p04d, delaycolor } from '../library';
import * as moreActions from '../actions';
import { Bus3dState, BusStopsCsvData, Bus3dDepotsbase, Busroutes, BusTripsCsvData, RainfallData,
  Bus3dMovesbase, Bus3dMovesbaseOperation, Bus3dClickedObject, BusOptionData, ComObj, Busprop } from '../types';

const assign = Object.assign;
const {max,min} = Math;
const Actions = assign({}, baseActions, moreActions);

const DATAPATH = './data/';
const GRIDDATAPATH = './GridCellLayerData/';
const BUSSTOPSPATH = './BusStopsData/';
const ROUTESPATH = './routes/';

interface Trip { segments: number[][], color: number[][] }
interface Savebusinfo {
  routecode?: string, systemcode?: string, direction?: string, systemname?: string, timetable?: string };
interface Savebusstatus {
  busstopcode: string, elapsedtime: number, order: number, delaysec: number, busprop: Busprop };
interface Tripbase { diagramid: string, businfo: Savebusinfo, busstatus: Savebusstatus[] };

function fetchJSON(path: string, option = {}) {
  return new Promise((resolve/* , reject */) => {
    Axios.get<object>(path, option).then((data) => {
      resolve(data);
    }).catch((error) => {
      resolve(error);
    });
  });
}

function fetchCSV(path: string, useShiftJis = false) {
  return new Promise((resolve/* , reject */) => {
    const option: AxiosRequestConfig = {};
    if (useShiftJis) {
      option.responseType = 'arraybuffer';
    }
    Axios.get<string>(path, option).then((res) => {
      let data = res.data;
      if (useShiftJis) {
        data = iconv.decode(new Buffer(data), 'shift_jis').toString();
      }

      csvtojson().fromString(data).then((result: object[]) => {
        resolve(assign({}, res, {
          data: result
        }));
      });
    }).catch((error) => {
      resolve(error);
    });
  });
}

function* fetchDataList({ path }:{ path: string }) {
  yield put(Actions.setLoading(true));
  const { data } = (yield fetchJSON(path)) as { data:{ children: {file: string}[], leading: number }};
  if (!data) {
    yield put(Actions.setLoading(false));
    return;
  }
  const { children, leading } = data;
  const filelist: string[] = [];
  children.forEach((answer) => {
    filelist.push(answer.file);
  });
  const answer = filelist[0];
  yield put(Actions.setAnswers(filelist));
  yield put(Actions.setAnswer(answer));
  if (typeof leading === 'number') {
    yield put(Actions.setLeading(leading));
  }
  yield put(Actions.setLoading(false));
}

function* fetchDataByAnswer({ answer }: { answer: string }) {
  const fileextension: string[] = answer.split('.');
  if (fileextension[1] === 'json') {
    yield put(Actions.setLoading(true));
    const { data } = yield fetchJSON(`${DATAPATH}${answer}`);
    if (!data) {
      yield put(Actions.setLoading(false));
      return;
    }
    if (typeof data.busmovesbase !== 'undefined') {
      const { timeBegin, timeLength, bounds, busmovesbasedic }:Bus3dState = data; 
      const { busmovesbase: movesbase }:{ busmovesbase: Bus3dMovesbase[] } = data; 
      yield put(Actions.setBusTripsCsv([]));
      yield put(Actions.setBusTripIndex({}));
      yield put(Actions.setMovesBase({ timeBegin, timeLength, bounds, movesbase }));
      yield put(Actions.setBusMovesBaseDic(busmovesbasedic));
      yield put(Actions.setLoading(false));
      return;
    }
    const { timeBegin, timeLength, trips }:
      { timeBegin: number, timeLength: number, trips: Trip[] } = data;
    const d = new Date(timeBegin * 1000);
    const strYmdBegin = p02d(d.getFullYear()) + p02d(d.getMonth() + 1) + p02d(d.getDate());
    const fileYmd = fileextension[0].split('-')[1].substr(0, 8);
    if (strYmdBegin !== fileYmd) {
      yield put(Actions.setLoading(false));
      alert(`date error\ntimeBegin=${strYmdBegin}\nfileneme=${fileYmd}`);
      return;
    }
    const movesbase: Bus3dMovesbase[] = [];
    trips.forEach((trip) => {
      const { segments, color: colorSpec } = trip;
      const operation: Bus3dMovesbaseOperation[] = [];
      segments.forEach((tripsegment, idx) => {
        const [longitude, latitude, elapsedtime] = tripsegment;
        const color = (colorSpec && colorSpec[idx]) ? colorSpec[idx] : settings.COLOR1;
        operation.push({ elapsedtime, longitude, latitude, color });
        if (!(idx < (segments.length - 1) && (segments[(idx+1)|0][2] - tripsegment[2]) <= 10)) {
          operation.push({ elapsedtime: (elapsedtime + 10), longitude, latitude, color });
        }
      });
      movesbase.push({
        operation
      });
    });
    yield put(Actions.setBusTripsCsv([]));
    yield put(Actions.setBusTripIndex({}));
    yield put(Actions.setMovesBase({ timeBegin, timeLength, movesbase }));
    yield put(Actions.setBusMovesBaseDic({}));
    yield put(Actions.setLoading(false));
  } else if (fileextension[1] === 'csv') {
    yield put(Actions.setLoading(true));
    const result = yield fetchCSV(`${DATAPATH}${answer}`, true)
    const { data } = result as {
      data: ComObj<string>[] };
    if (!data) {
      yield put(Actions.setLoading(false));
      return;
    }
    const bustripscsv: BusTripsCsvData[] = data.map((current) => {
      return {
        diagramid: current.ダイヤＩＤ,
        routecode: current.路線コード,
        systemcode: current.系統コード,
        direction: current.上下コード || current.上下,
        systemname: current.系統表示名,
        timetable: current.所定発時刻,
        actualdep: current.実績発時刻,
        busstopcode: current.停留所コード,
        busstoporder: current.並び順 };
    });
    yield put(Actions.setBusTripsCsv(bustripscsv));
    yield put(Actions.setBusTripIndex({}));
    yield put(Actions.setLoading(false));
  }
}

function* fetchBusstopCSV() {
  const { busstopscsv } = getContainerProp<Bus3dState>(yield select());
  if (busstopscsv.length === 0) {
    yield put(Actions.setLoading(true));
    const { data } = (yield fetchCSV(`${BUSSTOPSPATH}busstops.csv`)) as {
      data: ComObj<string>[] };
    if (data) {
      const conversionData: BusStopsCsvData[] = data.map((current) => {
        return {
          code: current.停留所コード,
          name: current.停留所名,
          longitude: +current.経度,
          latitude: +current.緯度,
        };
      });
      yield put(Actions.setBusstopsCsv(conversionData));
    }
    yield put(Actions.setLoading(false));
  }
}

function* fetchBusstopRoutesJSON() {
  const { busroutes } = getContainerProp<Bus3dState>(yield select());
  if (Object.keys(busroutes).length === 0) {
    yield put(Actions.setLoading(true));
    const { data } = (yield fetchJSON(`${ROUTESPATH}busroutes.json`)) as { data: Busroutes };
    if (data) {
      yield put(Actions.setBusRoutes(data));
    }
    yield put(Actions.setLoading(false));
  }
}

function* fetchRoutesJSON() {
  const { routesdata } = getContainerProp<Bus3dState>(yield select());
  if (Object.keys(routesdata).length === 0) {
    yield put(Actions.setLoading(true));
    const { data } = (yield fetchJSON(`${ROUTESPATH}routes.json`)) as
      { data:{ dep_station_code: string[], des_station_code: string[], route: string[] }};
    if (data) {
      const { dep_station_code, des_station_code, route } = data;
      const routesdict: ComObj<string> = {};
      route.forEach((current, idx) => {
        routesdict[
          p04d(dep_station_code[idx]) + p04d(des_station_code[idx])
        ] = current;
      });
      yield put(Actions.setRoutesData(routesdict));
    }
    yield put(Actions.setLoading(false));
  }
}

function* fetchBusstopsOption() {
  const { answer } = getContainerProp<Bus3dState>(yield select());
  const bsoptFname = `${answer.split('.')[0]}-option`;
  yield put(Actions.setLoading(true));
  const { data } = (yield fetchJSON(`${BUSSTOPSPATH}${bsoptFname}.json`)) as { data: BusOptionData };
  if (data) {
    yield put(Actions.setBusOption(data));
    yield put(Actions.setBsoptFname(bsoptFname));
    yield put(Actions.setArchBase([]));
  } else {
    yield put(Actions.setBusOption({}));
    yield put(Actions.setBsoptFname(''));
    yield put(Actions.setArchBase([]));
  }
  yield put(Actions.setLoading(false));
}

function* setupByCSV() {
  const { bustripscsv, busstopscsv, routesdata, busroutes,
    answer, busoption } = getContainerProp<Bus3dState>(yield select());
  const fileextension = answer.split('.');
  if (fileextension[1] !== 'csv') {
    return;
  }
  if (!bustripscsv || bustripscsv.length === 0) {
    return;
  }
  const fileymd = fileextension[0].split('-')[1];
  const ymd = [
    +fileymd.substr(0, 4),
    +fileymd.substr(4, 2) - 1,
    +fileymd.substr(6, 2)
  ];
  let savediagramid = '';
  let savebusinfo: Savebusinfo = {};
  let savebusstatus: Savebusstatus[] = [];
  const tripbase: Tripbase[] = [];
  const busmovesbase: Bus3dMovesbase[] = [];
  const busmovesbasedic: ComObj<number> = {};

  const { busmovesoption } = busoption || {} as BusOptionData;
  let busoptionlist = null as ComObj<{
        elevation: number, color: number[], memo: string, }>;

  bustripscsv.forEach((csvdata) => {
    const { diagramid, routecode, systemcode, direction, systemname, timetable,
      actualdep, busstopcode, busstoporder } = csvdata;
    if (savediagramid !== diagramid) {
      if (savebusstatus.length > 0) {
        tripbase.push({ diagramid: savediagramid, businfo: savebusinfo, busstatus: savebusstatus });
      }
      savediagramid = diagramid;
      busoptionlist = (busmovesoption && busmovesoption[savediagramid]) || null;
      savebusinfo = { routecode, systemcode, direction, systemname, timetable };
      savebusstatus = [];
    }
    if (timetable.match(/\d{1,2}:\d\d/) && actualdep.match(/\d{1,2}:\d\d:\d\d/)) {
      const tiemConversion = (ndate: number[], sTime: string) => {
        const hms = sTime.split(':').map(current => +current);
        return new Date(ndate[0], ndate[1], ndate[2], hms[0], hms[1], hms[2] || 0).getTime();
      };
      const dtime = tiemConversion(ymd, actualdep);
      const dtime2 = tiemConversion(ymd, timetable);
      const delaysec = (dtime - dtime2) / 1000;
      const busprop = busoptionlist ?
        (busoptionlist[busstopcode + busstoporder] ||
        busoptionlist[busstopcode] || null) : null;
      const pushdata = {
        busstopcode,
        elapsedtime: dtime / 1000,
        order: +busstoporder - 1,
        delaysec, busprop
      };
      savebusstatus.push(pushdata);
    }
  });
  if (savebusstatus.length > 0) {
    tripbase.push({ diagramid: savediagramid, businfo: savebusinfo, busstatus: savebusstatus });
  }
  if (tripbase.length === 0) {
    return;
  }
  const bssidx: ComObj<number> = {};
  busstopscsv.forEach((current, idx) => {
    bssidx[current.code] = idx;
  });

  tripbase.forEach((trip, idx) => {
    const { diagramid, businfo, busstatus } = trip;
    const { systemcode, direction, systemname, timetable } = businfo;
    const operation: Bus3dMovesbaseOperation[] = [];
    let savebusoption = null as Busprop;
    const color = settings.COLOR1;
    const busclass = { systemcode, direction, systemname, diagramid, timetable };
    for (let j = 0, lengthj = busstatus.length; j < lengthj; j=(j+1)|0) {
      const { busstopcode, elapsedtime, order, delaysec, busprop } = busstatus[j];
      if (bssidx[busstopcode]) {
        const busstoplocation = busstopscsv[bssidx[busstopcode]];
        const { longitude, latitude } = busstoplocation;
        operation.push({
          elapsedtime: elapsedtime - 10, // 各経過時間 - min経過時間
          longitude, latitude, color, delaysec,
          busprop: savebusoption });

        savebusoption = busprop;
        operation.push({
          elapsedtime, // 各経過時間 - min経過時間(+10はバス停停車の仮時間)
          longitude, latitude, color, delaysec,
          busprop: savebusoption });

        if (j < busstatus.length - 1 && busstopcode !== busstatus[(j+1)|0].busstopcode) {
          const busrouteskey = `${systemcode}-${direction}`;
          const { busstopcode: nextbusstopcode, elapsedtime: nextelapsedtime,
            order: nextorder, delaysec: nextdelaysec } = busstatus[(j+1)|0];
          const bsorderlist: { busstopcode: string, nextbusstopcode: string }[] = [];
          if (busroutes[busrouteskey]) {
            const wkbusroute = busroutes[busrouteskey];
            for (let k = order; k < nextorder; k=(k+1)|0) {
              if (wkbusroute[k] !== wkbusroute[(k+1)|0]) {
                bsorderlist.push({ busstopcode: p04d(wkbusroute[k]),
                  nextbusstopcode: p04d(wkbusroute[(k+1)|0]) });
              }
            }
          } else {
            bsorderlist.push({ busstopcode: p04d(busstopcode),
              nextbusstopcode: p04d(nextbusstopcode) });
          }

          let distance = 0;
          let route: number[][] = [];
          for (const bsslist of bsorderlist) {
            if (routesdata[bsslist.busstopcode + bsslist.nextbusstopcode]) {
              const routedata: { result: string, route: number[][], distance: number } = JSON.parse(
                routesdata[bsslist.busstopcode + bsslist.nextbusstopcode]);
              if (routedata.result === 'success') {
                for (const routeElement of routedata.route) {
                  const wkroute = routeElement;
                  if (wkroute[2] < routedata.distance) {
                    route.push([wkroute[0], wkroute[1], distance + wkroute[2]]);
                  }
                }
                distance = distance + routedata.distance;
              } else {
                route = [];
                break;
              }
            } else {
              route = [];
              break;
            }
          }

          const st = elapsedtime;
          const et = nextelapsedtime - 10;
          const dt = et - st;
          for (const rt of route) {
            if (rt[2] > 0 && rt[2] < distance) {
              operation.push({
                elapsedtime: st + (dt * (rt[2] / distance)), // 経過時間
                longitude: +rt[1], latitude: +rt[0], color,
                delaysec: (delaysec + ((nextdelaysec - delaysec) *
                  (rt[2] / distance)))|0,
                busprop: savebusoption });
            }
          }
        }
      }
    }
    if (operation.length > 0) {
      busmovesbase.push({
        busclass,
        operation
      });
      busmovesbasedic[diagramid] = idx;
    }
  });
  yield put(Actions.setMovesBase({ movesbase: busmovesbase }));
  yield put(Actions.setBusMovesBaseDic(busmovesbasedic));
}

function* setupByBusstopCSV() {
  const { busstopscsv, busoption } = getContainerProp<Bus3dState>(yield select());
  if (!busoption.busstopsoption) {
    yield put(Actions.setDepotsBase(busstopscsv));
    return;
  }
  const busstopsoption = busoption.busstopsoption;
  const optionlist: {
    time: number, bscode: number, elevation: number | number[],
    color: number[] | number[][], memo: string }[] = [];
  Object.keys(busstopsoption).forEach((time) => {
    const optionvalue = busstopsoption[time];
    optionvalue.forEach((option) => {
      const { bscode, elevation, color, memo } = option;
      optionlist.push({ time: +time,
        bscode,
        elevation: elevation || null,
        color: color || null,
        memo: memo || null
      });
    });
  });
  optionlist.sort((a, b) => (a.time - b.time));
  const option: ComObj<{ stime: number, etime: number, data: {
      time: number, elevation: number | number[], color: number[] | number[][], memo: string
    }[] }> = {};
  optionlist.forEach((optiondata) => {
    const { bscode, time, elevation, color, memo } = optiondata;
    if (typeof option[bscode] === 'undefined') {
      option[bscode] = { stime: time, etime: time, data: [{ time, elevation, color, memo }] };
    } else {
      const optionvalue = option[bscode];
      optionvalue.stime = min(optionvalue.stime, time);
      optionvalue.etime = max(optionvalue.etime, time);
      optionvalue.data.push({ time, elevation, color, memo });
    }
  });
  const depotsBase: Bus3dDepotsbase[] = [];
  busstopscsv.forEach((csvdata) => {
    if(csvdata.code in option){
      depotsBase.push(assign({}, csvdata, { option: option[csvdata.code] }));
    }else{
      depotsBase.push(assign({}, csvdata));
    }
  });
  yield put(Actions.setDepotsBase(depotsBase));
}

function* setupFetch({ answer }: { answer: string }) {
  yield call(fetchDataByAnswer, { answer });
  yield call(fetchBusstopsOption);
  yield call(fetchBusstopCSV);
  yield call(fetchBusstopRoutesJSON);
  yield call(fetchRoutesJSON);
  yield call(setupByCSV);
  yield call(setupByBusstopCSV);
}

function* initializeFetch({ path }: { path: string }) {
  yield call(fetchDataList, { path });
  const { answer } = getContainerProp<Bus3dState>(yield select());
  yield call(setupFetch, { answer });
}

function* updateRoute({ el, sw }:{ el: Bus3dClickedObject[], sw: boolean }) {
  if (!el) {
    return;
  }
  const { object, layer } = el[0];
  const { movesbaseidx } = object;
  const { id } = layer;
  const { delayheight, movesbase } = getContainerProp<Bus3dState>(yield select());
  let { delayrange } = getContainerProp<Bus3dState>(yield select());
  let retel: Bus3dClickedObject[] = null;
  const routePaths: RoutePaths[] = [];

  const { operation, busclass } = movesbase[movesbaseidx];
  if (busclass) {
    if (sw) {
      const delaysecmax = operation.reduce((prev, current) => max(prev, current.delaysec), 0);
      delayrange = ((delaysecmax / 60)|0) + 1;
      if (delayrange > 120) { delayrange = 120; }
      yield put(Actions.setDelayRange(delayrange));
    }
    for (let j = 0; j < (operation.length - 1); j=(j+1)|0) {
      const { position, longitude=position[0], latitude=position[1], delaysec } = operation[j];
      const { position:nextposition,
        longitude: nextlongitude=nextposition[0], latitude: nextlatitude=nextposition[1],
        delaysec: nextdelaysec } = operation[j + 1];
      routePaths.push({
        sourcePosition: [longitude, latitude, ((delaysec / 2) * delayheight) + 2],
        targetPosition: [nextlongitude, nextlatitude,
          ((nextdelaysec / 2) * delayheight) + 2],
        routeColor: delaycolor(delaysec, delayrange),
        routeWidth: 10,
      });
    }
  } else {
    yield put(Actions.setDelayRange(1));
    for (let j = 0; j < (operation.length - 1); j=(j+1)|0) {
      const { position, longitude=position[0], latitude=position[1], color } = operation[j];
      const { position:nextposition, longitude: nextlongitude=nextposition[0],
        latitude: nextlatitude=nextposition[1] } = operation[j + 1];
      routePaths.push({
        movesbaseidx,
        sourcePosition: [longitude, latitude, 0],
        targetPosition: [nextlongitude, nextlatitude, 0],
        routeColor: color || settings.COLOR1,
        routeWidth: 10,
      });
    }
  }
  retel = [{ object, layer: { id } }];
  yield put(Actions.setClicked(retel));
  yield put(Actions.setRoutePaths(routePaths));
}


function* updateRainfall({ settime, xbandCellSize, answer, xbandFname }:
  { settime: number, xbandCellSize: number, answer: string, xbandFname: string }) {
  if (xbandCellSize === 0) {
    yield put(Actions.setXbandFname(''));
    return;
  }
  const d = new Date(settime * 1000);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const min = d.getMinutes();
  const nextXbandFname = `${answer.split('-')[0]}-${p02d(year)}${p02d(month)}${p02d(day)}-${p02d(hour)}${p02d(min)}`;
  if (nextXbandFname === xbandFname) {
    return;
  }
  yield put(Actions.setXbandFname(nextXbandFname));
  yield put(Actions.setLoading(true));
  const { data } = (yield fetchJSON(`${GRIDDATAPATH}${nextXbandFname}.json`)) as { data: RainfallData[] };

  if (data) {
    yield put(Actions.setRainfall(data));
  } else {
    yield put(Actions.setRainfall([]));
  }
  yield put(Actions.setLoading(false));
}

export default function* rootSaga() {
  yield takeEvery(types.FETCHDATALIST as any, fetchDataList);
  yield takeEvery(types.FETCHDATABYANSWER as any, fetchDataByAnswer);
  yield takeEvery(types.FETCHBUSSTOPCSV as any, fetchBusstopCSV);
  yield takeEvery(types.FETCHBUSSTOPROUTESJSON as any, fetchBusstopRoutesJSON);
  yield takeEvery(types.FETCHROUTESJSON as any, fetchRoutesJSON);
  yield takeEvery(types.FETCHBUSSTOPSOPTION as any, fetchBusstopsOption);
  yield takeEvery(types.INITIALIZEFETCH as any, initializeFetch);
  yield takeEvery(types.SETUPFETCH as any, setupFetch);
  yield takeEvery(types.UPDATEROUTE as any, updateRoute);
  yield takeEvery(types.UPDATERAINFALL as any, updateRainfall);
}
