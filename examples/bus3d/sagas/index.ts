import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import * as csvtojson from 'csvtojson'
import * as iconv from 'iconv-lite'
import { settings, RoutePaths } from 'harmoware-vis'
import { Bus3dActionsInterface, Bus3dState, BusStopsCsvData, Bus3dDepotsbase, Busroutes, BusTripsCsvData, RainfallData,
  Bus3dMovesbase, Bus3dMovesbaseOperation, Bus3dClickedObject, BusOptionData, ComObj, Busprop, Bus3dProps } from '../types'
  
import { p02d, p04d, delaycolor } from '../library'

const DATAPATH = './data/'
const GRIDDATAPATH = './GridCellLayerData/'
const BUSSTOPSPATH = './BusStopsData/'
const ROUTESPATH = './routes/'

interface Trip { segments: number[][], color: number[][] }
interface Savebusinfo {
  routecode?: string, systemcode?: string, direction?: string, systemname?: string, timetable?: string }
interface Savebusstatus {
  busstopcode: string, elapsedtime: number, order: number, delaysec: number, busprop: Busprop }
interface Tripbase { diagramid: string, businfo: Savebusinfo, busstatus: Savebusstatus[] }

const assign = Object.assign

const fetchJSON = async (path: string, option = {}):Promise<AxiosResponse<any>>=>{
  const waitTag = new Promise((resolve:(value: AxiosResponse) => void, reject) => {
      Axios.get<object>(path, option)
      .then((res) => resolve(res))
      .catch((error) => reject(error))
  })
  return await waitTag
}

const fetchCSV = async (path: string, useShiftJis = false):Promise<AxiosResponse<any>>=>{
  const waitTag = new Promise((resolve:(value: AxiosResponse) => void, reject) => {
    const option: AxiosRequestConfig = {}
    if (useShiftJis) {
      option.responseType = 'arraybuffer'
    }
    Axios.get<string>(path, option)
    .then((res) => {
      let {data} = res
      if (useShiftJis) {
        data = iconv.decode(Buffer.from(data), 'shift_jis').toString()
      }
      csvtojson().fromString(data)
      .then((result: object[]) => {
        resolve(assign({}, res, { data: result }))
      })
    })
    .catch((error) => reject(error))
  })
  return await waitTag
}

export const initializeFetch = async (actions:Bus3dActionsInterface, path: string):Promise<void>=>{
  actions.setLoading(true)
  try{
    let file = undefined
    await fetchDataList(path)
    .then((res:Bus3dState)=>{
      const { filelist, leading } = res
      file = res.file
      actions.setFilelist(filelist)
      actions.setFile(file)
      if (typeof leading === 'number') {
        actions.setLeading(leading)
      }
    })
    .catch((error)=>{
      throw(error)
    })
    await setupFetch(actions,file)
    .then(()=>{
      actions.setLoading(false)
    })
    .catch((error)=>{
      throw(error)
    })
  }
  catch(error){
    console.log({error})
  }
}

const fetchDataList = async (path: string):Promise<Partial<Bus3dState>>=>{
  return await fetchJSON(path)
  .then((res:{ data:{ children: {file: string}[], leading: number }})=>{
    const { data:{ children, leading } } = res
    const getState:Partial<Bus3dState> = {}
    getState.filelist = children.map((child)=>child.file)
    getState.file = getState.filelist[0]
    if (typeof leading === 'number') {
      getState.leading = leading
    }
    return getState
  })
  .catch((error)=>{
    throw(error)
  })
}

export const setupFetch = async (actions:Bus3dActionsInterface, file:string):Promise<void>=>{
  actions.setLoading(true)
  try{
    let getState:Partial<Bus3dState> = {file}
    const fileextension: string[] = file.split('.')
    if(fileextension[1] === 'json'){
      await fetchTripJsonData(file)
      .then((res:Bus3dState)=>{
        const { timeBegin, timeLength, bounds, movesbase, busmovesbasedic } = getState = res
        getState.bustripscsv = []
        actions.setBusTripsCsv(getState.bustripscsv)
        getState.bustripindex = {}
        actions.setBusTripIndex(getState.bustripindex)
        actions.setMovesBase({ timeBegin, timeLength, bounds, movesbase })
        actions.setBusMovesBaseDic(busmovesbasedic)
      })
      .catch((error)=>{
        throw(error)
      })
    }else
    if(fileextension[1] === 'csv') {
      await fetchTripCsvData(file)
      .then((bustripscsv:BusTripsCsvData[])=>{
        getState.bustripscsv = bustripscsv
        actions.setBusTripsCsv(getState.bustripscsv)
        getState.bustripindex = {}
        actions.setBusTripIndex(getState.bustripindex)
      })
      .catch((error)=>{
        throw(error)
      })
    }
  
    const bsoptFname = `${file.split('.')[0]}-option`
    await fetchJSON(`${BUSSTOPSPATH}${bsoptFname}.json`)
    .then((res:{data:BusOptionData})=>{
      const { data } = res
      getState.busoption = data
      actions.setBusOption(getState.busoption)
      getState.bsoptFname = bsoptFname
      actions.setBsoptFname(getState.bsoptFname)
      getState.archbase = []
      actions.setArchBase(getState.archbase)
    })
    .catch((error)=>{
      getState.busoption = {}
      actions.setBusOption(getState.busoption)
      getState.bsoptFname = ''
      actions.setBsoptFname(getState.bsoptFname)
      getState.archbase = []
      actions.setArchBase(getState.archbase)
    })
  
    await fetchCSV(`${BUSSTOPSPATH}busstops.csv`)
    .then((res:{data:ComObj<string>[]})=>{
      const { data } = res
      const busstopscsv = data.map((current) => {
        return {
          code: current.停留所コード,
          name: current.停留所名,
          longitude: +current.経度,
          latitude: +current.緯度,
        }
      }) as BusStopsCsvData[]
      getState.busstopscsv = busstopscsv
      actions.setBusstopsCsv(getState.busstopscsv)
    })
    .catch((error)=>{
      throw(error)
    })
  
    await fetchJSON(`${ROUTESPATH}busroutes.json`)
    .then((res:{data:Busroutes})=>{
      const { data } = res
      getState.busroutes = data
      actions.setBusRoutes(getState.busroutes)
    })
    .catch((error)=>{
      throw(error)
    })
  
    await fetchJSON(`${ROUTESPATH}routes.json`)
    .then((res:{data:{ dep_station_code: string[], des_station_code: string[], route: string[] }})=>{
      const { data } = res
      const { dep_station_code, des_station_code, route } = data
      const routesdata: ComObj<string> = {}
      route.forEach((current, idx) => {
        routesdata[
          p04d(dep_station_code[idx]) + p04d(des_station_code[idx])
        ] = current
      })
      getState.routesdata = routesdata
      actions.setRoutesData(getState.routesdata)
    })
    .catch((error)=>{
      throw(error)
    })

    const ret = setupByCSV(getState)
    getState.movesbase = ret.movesbase
    actions.setMovesBase(getState.movesbase)
    getState.busmovesbasedic = ret.busmovesbasedic
    actions.setBusMovesBaseDic(getState.busmovesbasedic)
    const ret2 = setupByBusstopCSV(getState)
    getState.depotsBase = ret2.depotsBase
    actions.setDepotsBase(getState.depotsBase)
    actions.setLoading(false)
  }
  catch(error){
    throw(error)
  }
}

const setupByCSV = (State:Partial<Bus3dState>):Partial<Bus3dState>=>{
  const { bustripscsv, busstopscsv, routesdata, busroutes,
    file, busoption } = State
  const fileextension = file.split('.')
  if (fileextension[1] !== 'csv') {
    return
  }
  if (!bustripscsv || bustripscsv.length === 0) {
    return
  }
  const fileymd = fileextension[0].split('-')[1]
  const ymd = [
    +fileymd.substring(0, 4),
    +fileymd.substring(4, 6) - 1,
    +fileymd.substring(6, 8)
  ]
  let savediagramid = ''
  let savebusinfo: Savebusinfo = {}
  let savebusstatus: Savebusstatus[] = []
  const tripbase: Tripbase[] = []
  const busmovesbase: Bus3dMovesbase[] = []
  const busmovesbasedic: ComObj<number> = {}

  const { busmovesoption } = busoption || {} as BusOptionData
  let busoptionlist = null as ComObj<{
        elevation: number, color: number[], memo: string, }>

  bustripscsv.forEach((csvdata) => {
    const { diagramid, routecode, systemcode, direction, systemname, timetable,
      actualdep, busstopcode, busstoporder } = csvdata
    if (savediagramid !== diagramid) {
      if (savebusstatus.length > 0) {
        tripbase.push({ diagramid: savediagramid, businfo: savebusinfo, busstatus: savebusstatus })
      }
      savediagramid = diagramid
      busoptionlist = (busmovesoption && busmovesoption[savediagramid]) || null
      savebusinfo = { routecode, systemcode, direction, systemname, timetable }
      savebusstatus = []
    }
    if (timetable.match(/\d{1,2}:\d\d/) && actualdep.match(/\d{1,2}:\d\d:\d\d/)) {
      const tiemConversion = (ndate: number[], sTime: string) => {
        const hms = sTime.split(':').map(current => +current)
        return new Date(ndate[0], ndate[1], ndate[2], hms[0], hms[1], hms[2] || 0).getTime()
      }
      const dtime = tiemConversion(ymd, actualdep)
      const dtime2 = tiemConversion(ymd, timetable)
      const delaysec = (dtime - dtime2) / 1000
      const busprop = busoptionlist ?
        (busoptionlist[busstopcode + busstoporder] ||
        busoptionlist[busstopcode] || null) : null
      const pushdata = {
        busstopcode,
        elapsedtime: dtime / 1000,
        order: +busstoporder - 1,
        delaysec, busprop
      }
      savebusstatus.push(pushdata)
    }
  })
  if (savebusstatus.length > 0) {
    tripbase.push({ diagramid: savediagramid, businfo: savebusinfo, busstatus: savebusstatus })
  }
  if (tripbase.length === 0) {
    return
  }
  const bssidx: ComObj<number> = {}
  busstopscsv.forEach((current, idx) => {
    bssidx[current.code] = idx
  })

  tripbase.forEach((trip, idx) => {
    const { diagramid, businfo, busstatus } = trip
    const { systemcode, direction, systemname, timetable } = businfo
    const operation: Bus3dMovesbaseOperation[] = []
    let savebusoption = null as Busprop
    const color = settings.COLOR1
    const busclass = { systemcode, direction, systemname, diagramid, timetable }
    for (let j = 0, lengthj = busstatus.length; j < lengthj; j=(j+1)|0) {
      const { busstopcode, elapsedtime, order, delaysec, busprop } = busstatus[j]
      if (bssidx[busstopcode]) {
        const busstoplocation = busstopscsv[bssidx[busstopcode]]
        const { longitude, latitude } = busstoplocation
        operation.push({
          elapsedtime: elapsedtime - 10, // 各経過時間 - min経過時間
          longitude, latitude, color, delaysec,
          busprop: savebusoption })

        savebusoption = busprop
        operation.push({
          elapsedtime, // 各経過時間 - min経過時間(+10はバス停停車の仮時間)
          longitude, latitude, color, delaysec,
          busprop: savebusoption })

        if (j < busstatus.length - 1 && busstopcode !== busstatus[(j+1)|0].busstopcode) {
          const busrouteskey = `${systemcode}-${direction}`
          const { busstopcode: nextbusstopcode, elapsedtime: nextelapsedtime,
            order: nextorder, delaysec: nextdelaysec } = busstatus[(j+1)|0]
          const bsorderlist: { busstopcode: string, nextbusstopcode: string }[] = []
          if (busroutes[busrouteskey]) {
            const wkbusroute = busroutes[busrouteskey]
            for (let k = order; k < nextorder; k=(k+1)|0) {
              if (wkbusroute[k] !== wkbusroute[(k+1)|0]) {
                bsorderlist.push({ busstopcode: p04d(wkbusroute[k]),
                  nextbusstopcode: p04d(wkbusroute[(k+1)|0]) })
              }
            }
          } else {
            bsorderlist.push({ busstopcode: p04d(busstopcode),
              nextbusstopcode: p04d(nextbusstopcode) })
          }

          let distance = 0
          let route: number[][] = []
          for (const bsslist of bsorderlist) {
            if (routesdata[bsslist.busstopcode + bsslist.nextbusstopcode]) {
              const routedata: { result: string, route: number[][], distance: number } = JSON.parse(
                routesdata[bsslist.busstopcode + bsslist.nextbusstopcode])
              if (routedata.result === 'success') {
                for (const routeElement of routedata.route) {
                  const wkroute = routeElement
                  if (wkroute[2] < routedata.distance) {
                    route.push([wkroute[0], wkroute[1], distance + wkroute[2]])
                  }
                }
                distance = distance + routedata.distance
              } else {
                route = []
                break
              }
            } else {
              route = []
              break
            }
          }

          const st = elapsedtime
          const et = nextelapsedtime - 10
          const dt = et - st
          for (const rt of route) {
            if (rt[2] > 0 && rt[2] < distance) {
              operation.push({
                elapsedtime: st + (dt * (rt[2] / distance)), // 経過時間
                longitude: +rt[1], latitude: +rt[0], color,
                delaysec: (delaysec + ((nextdelaysec - delaysec) *
                  (rt[2] / distance)))|0,
                busprop: savebusoption })
            }
          }
        }
      }
    }
    if (operation.length > 0) {
      busmovesbase.push({
        busclass,
        operation
      })
      busmovesbasedic[diagramid] = idx
    }
  })
  const getState:Partial<Bus3dState> = {}
  getState.movesbase = busmovesbase
  getState.busmovesbasedic = busmovesbasedic
  return getState
}

const setupByBusstopCSV = (State:Partial<Bus3dState>):Partial<Bus3dState>=>{
  const { busstopscsv, busoption } = State
  const getState:Partial<Bus3dState> = {}
  if (!busoption.busstopsoption) {
    getState.depotsBase = busstopscsv
    return getState
  }
  const busstopsoption = busoption.busstopsoption
  const optionlist: {
    time: number, bscode: number, elevation: number | number[],
    color: number[] | number[][], memo: string }[] = []
  Object.keys(busstopsoption).forEach((time) => {
    const optionvalue = busstopsoption[time]
    optionvalue.forEach((option) => {
      const { bscode, elevation, color, memo } = option
      optionlist.push({ time: +time,
        bscode,
        elevation: elevation || null,
        color: color || null,
        memo: memo || null
      })
    })
  })
  optionlist.sort((a, b) => (a.time - b.time))
  const option: ComObj<{ stime: number, etime: number, data: {
      time: number, elevation: number | number[], color: number[] | number[][], memo: string
    }[] }> = {}
  optionlist.forEach((optiondata) => {
    const { bscode, time, elevation, color, memo } = optiondata
    if (typeof option[bscode] === 'undefined') {
      option[bscode] = { stime: time, etime: time, data: [{ time, elevation, color, memo }] }
    } else {
      const optionvalue = option[bscode]
      optionvalue.stime = Math.min(optionvalue.stime, time)
      optionvalue.etime = Math.max(optionvalue.etime, time)
      optionvalue.data.push({ time, elevation, color, memo })
    }
  })
  const depotsBase: Bus3dDepotsbase[] = []
  busstopscsv.forEach((csvdata) => {
    if(csvdata.code in option){
      depotsBase.push(assign({}, csvdata, { option: option[csvdata.code] }))
    }else{
      depotsBase.push(assign({}, csvdata))
    }
  })
  getState.depotsBase = depotsBase
  return getState
}

const fetchTripJsonData = async (file: string):Promise<Partial<Bus3dState>>=>{
  const waitTag = new Promise((resolve:(value:Partial<Bus3dState>)=>void, reject) => {
    const fileextension: string[] = file.split('.')
    fetchJSON(`${DATAPATH}${file}`)
    .then((res:{data:any})=>{
      const { data } = res
      const { timeBegin, timeLength }:Bus3dState = data
      if (typeof data.busmovesbase !== 'undefined') {
        const { bounds, busmovesbasedic }:Bus3dState = data
        const { busmovesbase: movesbase }:{ busmovesbase: Bus3dMovesbase[] } = data
        resolve({ timeBegin, timeLength, bounds, movesbase, busmovesbasedic })
      }
      const { trips }:{trips:Trip[]} = data
      const d = new Date(timeBegin * 1000)
      const strYmdBegin = p02d(d.getFullYear()) + p02d(d.getMonth() + 1) + p02d(d.getDate())
      const fileYmd = fileextension[0].split('-')[1].substring(0, 8)
      if (strYmdBegin !== fileYmd) {
        const error = `date error\ntimeBegin=${strYmdBegin}\nfileneme=${fileYmd}`
        alert(error)
        reject(error)
      }
      const movesbase: Bus3dMovesbase[] = []
      trips.forEach((trip) => {
        const { segments, color: colorSpec } = trip
        const operation: Bus3dMovesbaseOperation[] = []
        segments.forEach((tripsegment, idx) => {
          const [longitude, latitude, elapsedtime] = tripsegment
          const color = (colorSpec && colorSpec[idx]) ? colorSpec[idx] : settings.COLOR1
          operation.push({ elapsedtime, longitude, latitude, color })
          if (!(idx < (segments.length - 1) && (segments[(idx+1)|0][2] - tripsegment[2]) <= 10)) {
            operation.push({ elapsedtime: (elapsedtime + 10), longitude, latitude, color })
          }
        })
        movesbase.push({
          operation
        })
      })
      resolve({ timeBegin, timeLength, movesbase, busmovesbasedic:{} })
    })
    .catch((error)=>{
      reject(error)
    })
  })
  return await waitTag
}

const fetchTripCsvData = async (file: string):Promise<BusTripsCsvData[]>=>{
  const waitTag = new Promise((resolve:(value:BusTripsCsvData[])=>void, reject) => {
    fetchCSV(`${DATAPATH}${file}`, true)
    .then((res:{data:ComObj<string>[]})=>{
      const { data } = res
      if (!data) {
        const error = `date error\fetchTripCsvData(${DATAPATH}${file})`
        reject(error)
      }
      resolve(
        data.map((current) => {
          return {
            diagramid: current.ダイヤＩＤ,
            routecode: current.路線コード,
            systemcode: current.系統コード,
            direction: current.上下コード || current.上下,
            systemname: current.系統表示名,
            timetable: current.所定発時刻,
            actualdep: current.実績発時刻,
            busstopcode: current.停留所コード,
            busstoporder: current.並び順 }
        })
      )
    })
    .catch((error)=>{
      reject(error)
    })
  })
  return await waitTag
}

export const updateRoute = async (el: Bus3dClickedObject[], sw: boolean, props:Bus3dProps)=>{
  if (!el) {
    return
  }
  await Promise.resolve()
  const { object, layer } = el[0]
  const { movesbaseidx } = object
  const { id } = layer
  const { actions, delayheight, movesbase } = props
  let { delayrange } = props
  let retel: Bus3dClickedObject[] = null
  const routePaths: RoutePaths[] = []

  const { operation, busclass } = movesbase[movesbaseidx]
  if (busclass) {
    if (sw) {
      const delaysecmax = operation.reduce((prev, current) => Math.max(prev, current.delaysec), 0)
      delayrange = ((delaysecmax / 60)|0) + 1
      if (delayrange > 120) { delayrange = 120 }
      actions.setDelayRange(delayrange)
    }
    for (let j = 0; j < (operation.length - 1); j=(j+1)|0) {
      const { position, longitude=position[0], latitude=position[1], delaysec } = operation[j]
      const { position:nextposition,
        longitude: nextlongitude=nextposition[0], latitude: nextlatitude=nextposition[1],
        delaysec: nextdelaysec } = operation[j + 1]
      routePaths.push({
        sourcePosition: [longitude, latitude, ((delaysec / 2) * delayheight) + 2],
        targetPosition: [nextlongitude, nextlatitude,
          ((nextdelaysec / 2) * delayheight) + 2],
        routeColor: delaycolor(delaysec, delayrange),
        routeWidth: 10,
      })
    }
  } else {
    actions.setDelayRange(1)
    for (let j = 0; j < (operation.length - 1); j=(j+1)|0) {
      const { position, longitude=position[0], latitude=position[1], color } = operation[j]
      const { position:nextposition, longitude: nextlongitude=nextposition[0],
        latitude: nextlatitude=nextposition[1] } = operation[j + 1]
      routePaths.push({
        movesbaseidx,
        sourcePosition: [longitude, latitude, 0],
        targetPosition: [nextlongitude, nextlatitude, 0],
        routeColor: color || settings.COLOR1,
        routeWidth: 10,
      })
    }
  }
  retel = [{ object, layer: { id, props } }]
  actions.setClicked(retel)
  actions.setRoutePaths(routePaths)
}

export const updateRainfall = async (props:Bus3dProps):Promise<void>=>{
  const { actions, settime, xbandCellSize, file, xbandFname } = props
  if (xbandCellSize === 0) {
    actions.setXbandFname('')
    return
  }
  const d = new Date(settime * 1000)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const min = d.getMinutes()
  const nextXbandFname = `${file.split('-')[0]}-${p02d(year)}${p02d(month)}${p02d(day)}-${p02d(hour)}${p02d(min)}`
  if (nextXbandFname === xbandFname) {
    return
  }
  actions.setXbandFname(nextXbandFname)
  const waitTag = fetchJSON(`${GRIDDATAPATH}${nextXbandFname}.json`)
  .then((res:{data:RainfallData[]})=>{
    const { data } = res
    actions.setRainfall(data)
  })
  .catch((error)=>{
    actions.setRainfall([])
  })
  return await waitTag
}
