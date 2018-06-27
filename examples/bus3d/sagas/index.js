import { call, put, takeEvery, select } from 'redux-saga/effects';
import axios from 'axios';
import csvtojson from 'csvtojson';
import iconv from 'iconv-lite';
import { settings, Actions as baseActions } from 'harmoware-vis';

import * as types from '../constants/action-types';
import { p02d, p04d, delaycolor, getContainerProp } from '../library';
import * as moreActions from '../actions';

const Actions = Object.assign({}, baseActions, moreActions);

const { COLOR1 } = settings;
const DATAPATH = './data/';
const GRIDDATAPATH = './GridCellLayerData/';
const BUSSTOPSPATH = './BusStopsData/';
const ROUTESPATH = './routes/';

function fetchJSON(path, option = {}) {
  return new Promise((resolve/* , reject */) => {
    axios.get(path, option).then((data) => {
      resolve(data);
    }).catch((error) => {
      resolve(error);
    });
  });
}

function fetchCSV(path, useShiftJis = false) {
  return new Promise((resolve/* , reject */) => {
    const option = {};
    if (useShiftJis) {
      option.responseType = 'arraybuffer';
    }
    axios.get(path, option).then((res) => {
      let data = res.data;
      if (useShiftJis) {
        data = iconv.decode(new Buffer(data), 'shift_jis').toString('utf8');
      }
      csvtojson().fromString(data).on('end_parsed', (result) => {
        resolve(Object.assign({}, res, {
          data: result
        }));
      });
    }).catch((error) => {
      resolve(error);
    });
  });
}

function* fetchDataList({ path }) {
  const { data } = yield fetchJSON(path);
  if (!data) {
    return;
  }
  const { children, leading } = data;
  const filelist = [];
  children.forEach((answer) => {
    filelist.push(answer.file);
  });
  const answer = filelist[0];
  yield put(Actions.setAnswers(filelist));
  yield put(Actions.setAnswer(answer));
  if (typeof leading === 'number') {
    yield put(Actions.setLeading(leading));
  }
}

function* fetchDataByAnswer({ answer }) {
  const fileextension = answer.split('.');
  const { leading, trailing, defaultZoom, defaultPitch
  } = getContainerProp(yield select());
  if (fileextension[1] === 'json') {
    const { data } = yield fetchJSON(`${DATAPATH}${answer}`);
    if (!data) {
      return;
    }
    if (typeof data.busmovesbase !== 'undefined') {
      const { timeBegin, timeLength, bounds, busmovesbase, busmovesbasedic } = data;
      yield put(Actions.setBusTripsCsv([]));
      yield put(Actions.setBusTripIndex({}));
      yield put(Actions.setMovesBase({ timeBegin, timeLength, bounds, movesbase: busmovesbase }));
      yield put(Actions.setBusMovesBaseDic(busmovesbasedic));
      return;
    }
    const { timeBegin, timeLength, trips } = data;
    const d = new Date(timeBegin * 1000);
    const strYmdBegin = p02d(d.getFullYear()) + p02d(d.getMonth() + 1) + p02d(d.getDate());
    const fileYmd = fileextension[0].split('-')[1].substr(0, 8);
    if (strYmdBegin !== fileYmd) {
      alert(`date error\ntimeBegin=${strYmdBegin}\nfileneme=${fileYmd}`);
      return;
    }
    const busmovesbase = [];
    trips.forEach((trip) => {
      const { segments, color } = trip;
      const operation = [];
      segments.forEach((tripsegment, idx) => {
        const tripcolor = (color && color[idx]) ? color[idx] : COLOR1;
        operation.push({
          elapsedtime: tripsegment[2],
          longitude: tripsegment[0],
          latitude: tripsegment[1],
          color: tripcolor });
        if (!(idx < (segments.length - 1) && (segments[idx + 1][2] - tripsegment[2]) <= 10)) {
          operation.push({
            elapsedtime: tripsegment[2] + 10,
            longitude: tripsegment[0],
            latitude: tripsegment[1],
            color: tripcolor });
        }
      });
      busmovesbase.push({
        departuretime: segments[0][2],
        arrivaltime: segments[segments.length - 1][2],
        operation
      });
    });
    yield put(Actions.setBusTripsCsv([]));
    yield put(Actions.setBusTripIndex({}));
    yield put(Actions.setMovesBase({ timeBegin, timeLength, movesbase: busmovesbase }));
    yield put(Actions.setBusMovesBaseDic({}));
  } else if (fileextension[1] === 'csv') {
    const { data } = yield fetchCSV(`${DATAPATH}${answer}`, true);
    if (!data) {
      return;
    }
    const bustripscsv = data.map((current) => {
      const returnvalue = {
        diagramid: current.ダイヤＩＤ,
        routecode: current.路線コード,
        systemcode: current.系統コード,
        direction: current.上下コード || current.上下,
        systemname: current.系統表示名,
        timetable: current.所定発時刻,
        actualdep: current.実績発時刻,
        busstopcode: current.停留所コード,
        busstoporder: current.並び順 };
      return returnvalue;
    });
    yield put(Actions.setBusTripsCsv(bustripscsv));
    yield put(Actions.setBusTripIndex({}));
  }
}

function* fetchBusstopCSV() {
  const { busstopscsv } = getContainerProp(yield select());
  if (busstopscsv.length === 0) {
    const { data } = yield fetchCSV(`${BUSSTOPSPATH}busstops.csv`);
    if (data) {
      const conversionData = data.map((current) => {
        const returnvalue = {
          code: current.停留所コード,
          name: current.停留所名,
          longitude: current.経度,
          latitude: current.緯度 };
        return returnvalue;
      });
      yield put(Actions.setBusstopsCsv(conversionData));
    }
  }
}

function* fetchBusstopRoutesJSON() {
  const { busroutes } = getContainerProp(yield select());
  if (Object.keys(busroutes).length === 0) {
    const { data } = yield fetchJSON(`${ROUTESPATH}busroutes.json`);
    if (data) {
      yield put(Actions.setBusRoutes(data));
    }
  }
}

function* fetchRoutesJSON() {
  const { routesdata } = getContainerProp(yield select());
  if (Object.keys(routesdata).length === 0) {
    const { data } = yield fetchJSON(`${ROUTESPATH}routes.json`);
    if (data) {
      const { dep_station_code, des_station_code, route } = data;
      const routesdict = {};
      route.forEach((current, idx) => {
        routesdict[
          p04d(String(dep_station_code[idx])) + p04d(String(des_station_code[idx]))
        ] = current;
      });
      yield put(Actions.setRoutesData(routesdict));
    }
  }
}

function* fetchBusstopsOption() {
  const { answer } = getContainerProp(yield select());
  const bsoptFname = `${answer.split('.')[0]}-option`;
  const { data } = yield fetchJSON(`${BUSSTOPSPATH}${bsoptFname}.json`);
  if (data) {
    yield put(Actions.setBusOption(data));
    yield put(Actions.setBsoptFname(bsoptFname));
    yield put(Actions.setArchBase([]));
  } else {
    yield put(Actions.setBusOption({}));
    yield put(Actions.setBsoptFname(''));
    yield put(Actions.setArchBase([]));
  }
}

function* setupByCSV() {
  const { bustripscsv, busstopscsv, routesdata, busroutes,
    answer, leading, trailing, busoption, defaultZoom, defaultPitch
  } = getContainerProp(yield select());
  const fileextension = answer.split('.');
  if (fileextension[1] !== 'csv') {
    return;
  }
  if (!bustripscsv || bustripscsv.length === 0) {
    return;
  }
  const fileymd = fileextension[0].split('-')[1];
  const ymd = [
    parseInt(fileymd.substr(0, 4), 10), parseInt(fileymd.substr(4, 2), 10) - 1,
    parseInt(fileymd.substr(6, 2), 10)
  ];
  let savediagramid = '';
  let savebusinfo = {};
  let savebusstatus = [];
  const tripbase = [];
  const busmovesbase = [];
  const busmovesbasedic = {};

  const busmovesoption = busoption.busmovesoption || {};
  let busoptionlist = null;

  bustripscsv.forEach((csvdata) => {
    const { diagramid, routecode, systemcode, direction, systemname, timetable,
      actualdep, busstopcode, busstoporder } = csvdata;
    if (savediagramid !== diagramid) {
      if (savebusstatus.length > 0) {
        tripbase.push({ diagramid: savediagramid, businfo: savebusinfo, busstatus: savebusstatus });
      }
      savediagramid = diagramid;
      busoptionlist = busmovesoption[savediagramid] || null;
      savebusinfo = { routecode, systemcode, direction, systemname, timetable };
      savebusstatus = [];
    }
    if (timetable.match(/\d{1,2}:\d\d/) && actualdep.match(/\d{1,2}:\d\d:\d\d/)) {
      const tiemConversion = (ndate, sTime) => {
        const hms = sTime.split(':').map(current => parseInt(current, 10));
        return new Date(...ndate, hms[0], hms[1], hms[2] || 0).getTime();
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
        order: parseInt(busstoporder, 10) - 1,
        delaysec,
        busprop
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
  const bssidx = {};
  busstopscsv.forEach((current, idx) => {
    bssidx[current.code] = idx;
  });

  tripbase.forEach((trip, idx) => {
    const { diagramid, businfo, busstatus } = trip;
    const { systemcode, direction, systemname, timetable } = businfo;
    const operation = [];
    let savebusoption = null;
    const busclass = { systemcode, direction, systemname, diagramid, timetable };
    for (let j = 0, lengthj = busstatus.length; j < lengthj; j += 1) {
      const { busstopcode, elapsedtime, order, delaysec, busprop } = busstatus[j];
      if (bssidx[busstopcode]) {
        const busstoplocation = busstopscsv[bssidx[busstopcode]];
        operation.push({
          elapsedtime: elapsedtime - 10, // 各経過時間 - min経過時間
          longitude: busstoplocation.longitude,
          latitude: busstoplocation.latitude,
          color: COLOR1,
          delaysec,
          busprop: savebusoption });

        savebusoption = busprop;
        operation.push({
          elapsedtime, // 各経過時間 - min経過時間(+10はバス停停車の仮時間)
          longitude: busstoplocation.longitude,
          latitude: busstoplocation.latitude,
          color: COLOR1,
          delaysec,
          busprop: savebusoption });

        if (j < busstatus.length - 1 && busstopcode !== busstatus[j + 1].busstopcode) {
          const busrouteskey = `${systemcode}-${direction}`;
          const { busstopcode: nextbusstopcode, elapsedtime: nextelapsedtime,
            order: nextorder, delaysec: nextdelaysec } = busstatus[j + 1];
          const bsorderlist = [];
          if (busroutes[busrouteskey]) {
            const wkbusroute = busroutes[busrouteskey];
            for (let k = order; k < nextorder; k += 1) {
              if (wkbusroute[k] !== wkbusroute[k + 1]) {
                bsorderlist.push({ busstopcode: p04d(wkbusroute[k]),
                  nextbusstopcode: p04d(wkbusroute[k + 1]) });
              }
            }
          } else {
            bsorderlist.push({ busstopcode: p04d(busstopcode),
              nextbusstopcode: p04d(nextbusstopcode) });
          }

          let distance = 0;
          let route = [];
          for (let m = 0; m < bsorderlist.length; m += 1) {
            const bsslist = bsorderlist[m];
            if (routesdata[bsslist.busstopcode + bsslist.nextbusstopcode]) {
              const routedata = JSON.parse(
                routesdata[bsslist.busstopcode + bsslist.nextbusstopcode]);
              if (routedata.result === 'success') {
                for (let n = 0; n < routedata.route.length; n += 1) {
                  const wkroute = routedata.route[n];
                  if (wkroute[2] < routedata.distance) {
                    route.push([wkroute[0], wkroute[1], distance + wkroute[2]]);
                  }
                }
                distance += routedata.distance;
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
          for (let p = 0; p < route.length; p += 1) {
            const rt = route[p];
            if (rt[2] > 0 && rt[2] < distance) {
              operation.push({
                elapsedtime: st + (dt * (rt[2] / distance)), // 経過時間
                longitude: String(rt[1]),
                latitude: String(rt[0]),
                color: COLOR1,
                delaysec: Math.floor(delaysec + ((nextdelaysec - delaysec) *
                  (rt[2] / distance))),
                busprop: savebusoption });
            }
          }
        }
      }
    }
    if (operation.length > 0) {
      busmovesbase.push({
        departuretime: operation[0].elapsedtime,
        arrivaltime: operation[operation.length - 1].elapsedtime,
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
  const { busstopscsv, busoption } = getContainerProp(yield select());
  if (!busoption.busstopsoption) {
    yield put(Actions.setDepotsBase(busstopscsv));
    return;
  }
  const busstopsoption = busoption.busstopsoption;
  const optionlist = [];
  Object.keys(busstopsoption).forEach((time) => {
    const optionvalue = busstopsoption[time];
    optionvalue.forEach((option) => {
      const { bscode, elevation, color, memo } = option;
      optionlist.push({ time: parseInt(time, 10),
        bscode,
        elevation: elevation || null,
        color: color || null,
        memo: memo || null
      });
    });
  });
  optionlist.sort((a, b) => (a.time - b.time));
  const option = {};
  optionlist.forEach((optiondata) => {
    const { bscode, time, elevation, color, memo } = optiondata;
    if (typeof option[bscode] === 'undefined') {
      option[bscode] = { stime: time, etime: time, data: [{ time, elevation, color, memo }] };
    } else {
      const optionvalue = option[bscode];
      optionvalue.stime = Math.min(optionvalue.stime, time);
      optionvalue.etime = Math.max(optionvalue.etime, time);
      optionvalue.data.push({ time, elevation, color, memo });
    }
  });
  const depotsBase = [];
  busstopscsv.forEach((csvdata) => {
    depotsBase.push({ ...csvdata,
      option: option[csvdata.code] || null
    });
  });
  yield put(Actions.setDepotsBase(depotsBase));
}

function* setupFetch({ answer }) {
  yield call(fetchDataByAnswer, { answer });
  yield call(fetchBusstopsOption);
  yield call(fetchBusstopCSV);
  yield call(fetchBusstopRoutesJSON);
  yield call(fetchRoutesJSON);
  yield call(setupByCSV);
  yield call(setupByBusstopCSV);
}

function* initializeFetch({ path }) {
  yield call(fetchDataList, { path });
  const { answer } = getContainerProp(yield select());
  yield call(setupFetch, { answer });
}

function* updateRoute({ el, sw }) {
  if (!el) {
    return;
  }
  const { object, layer } = el;
  const { code, name, memo, movesbaseidx } = object;
  const { id } = layer;
  const { delayheight, movesbase } = getContainerProp(yield select());
  let { delayrange } = getContainerProp(yield select());
  let retel = null;
  const routePaths = [];

  const { operation, busclass } = movesbase[movesbaseidx];
  if (busclass) {
    if (sw) {
      const delaysecmax = operation.reduce((prev, current) => Math.max(prev, current.delaysec), 0);
      delayrange = Math.floor(delaysecmax / 60) + 1;
      if (delayrange > 120) { delayrange = 120; }
      yield put(Actions.setDelayRange(delayrange));
    }
    for (let j = 0; j < (operation.length - 1); j += 1) {
      const { longitude, latitude, delaysec } = operation[j];
      const { longitude: nextlongitude, latitude: nextlatitude,
        delaysec: nextdelaysec } = operation[j + 1];
      routePaths.push({
        sourcePosition: [longitude, latitude, ((delaysec / 2) * delayheight) + 2],
        targetPosition: [nextlongitude, nextlatitude,
          ((nextdelaysec / 2) * delayheight) + 2],
        color: delaycolor(delaysec, delayrange)
      });
    }
  } else {
    yield put(Actions.setDelayRange(1));
    for (let j = 0; j < (operation.length - 1); j += 1) {
      const { longitude, latitude, color } = operation[j];
      const { longitude: nextlongitude, latitude: nextlatitude } = operation[j + 1];
      routePaths.push({
        sourcePosition: [longitude, latitude, 0],
        targetPosition: [nextlongitude, nextlatitude, 0],
        color: color || COLOR1
      });
    }
  }
  retel = { object, layer: { id } };
  yield put(Actions.setClicked(retel));
  yield put(Actions.setRoutePaths(routePaths));
}


function* updateRainfall({ settime, timeBegin, xbandCellSize, answer, xbandFname }) {
  if (xbandCellSize === 0) {
    yield put(Actions.setXbandFname(''));
    return;
  }
  const d = new Date((timeBegin + settime) * 1000);
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
  const { data } = yield fetchJSON(`${GRIDDATAPATH}${nextXbandFname}.json`);

  if (data) {
    yield put(Actions.setRainfall(data));
  } else {
    yield put(Actions.setRainfall([]));
  }
}

export default function* rootSaga() {
  yield takeEvery(types.FETCHDATALIST, fetchDataList);
  yield takeEvery(types.FETCHDATABYANSWER, fetchDataByAnswer);
  yield takeEvery(types.FETCHBUSSTOPCSV, fetchBusstopCSV);
  yield takeEvery(types.FETCHBUSSTOPROUTESJSON, fetchBusstopRoutesJSON);
  yield takeEvery(types.FETCHROUTESJSON, fetchRoutesJSON);
  yield takeEvery(types.FETCHBUSSTOPSOPTION, fetchBusstopsOption);
  yield takeEvery(types.INITIALIZEFETCH, initializeFetch);
  yield takeEvery(types.SETUPFETCH, setupFetch);
  yield takeEvery(types.UPDATEROUTE, updateRoute);
  yield takeEvery(types.UPDATERAINFALL, updateRainfall);
}
