import { createSlice } from '@reduxjs/toolkit'
import { analyzeMovesBase, getMoveObjects, getDepots, safeCheck, safeAdd, safeSubtract } from '../library';
import { BasedState, BasedProps, AnalyzedBaseData, LocationData, LocationDataOption,
  Movesbase, MovesbaseFile, Depotsbase, Viewport, ClickedObject, RoutePaths,
  GetMovesOptionFunc, GetDepotsOptionFunc, GetExtractedDataFunc, LineMapData } from '../types';

const {PI:pi,sin,cos,tan,atan2} = Math;
const radians = (degree: number) => degree * pi / 180;
const degrees = (radian: number) => radian * 180 / pi;

interface InnerState extends Partial<BasedState>{};

const initialState: BasedState = {
  viewport: {
    longitude: 136.906428,
    latitude: 35.181453,
    zoom: 11.1,
    maxZoom: 18,
    minZoom: 5,
    pitch: 30,
    bearing: 0,
    maxPitch: undefined,
    minPitch: undefined,
    width: window.innerWidth, // 共通
    height: window.innerHeight, // 共通
    transitionDuration: 0,
    transitionInterruption: undefined,
  },
  settime: 0,
  starttimestamp: 0,
  timeLength: 0,
  timeBegin: 0,
  loopTime: 0,
  leading: 100,
  trailing: 180,
  beforeFrameTimestamp: 0,
  movesbase: [],
  depotsBase: [],
  bounds: {
    westlongitiude: 0,
    eastlongitiude: 0,
    southlatitude: 0,
    northlatitude: 0
  },
  animatePause: false,
  loopEndPause: false,
  animateReverse: false,
  secperhour: 180,
  multiplySpeed:20, //(3600 / secperhour)値であること
  clickedObject: null,
  routePaths: [],
  defaultZoom: 11.1,
  defaultPitch: 30,
  getMovesOptionFunc: null,
  getDepotsOptionFunc: null,
  movedData: [],
  locationBase: [],
  locationData: [],
  locationMoveDuration: 1,
  defaultAddTimeLength: 60,
  remainingTime: 10,
  ExtractedData: undefined,
  getExtractedDataFunc: null,
  depotsData: [],
  linemapData: [],
  loading: false,
  inputFileName: {},
  noLoop: false,
  initialViewChange: true,
  iconGradation: false
};

const parameter = {
  coefficient: 0
};

const calcLoopTime = // LoopTime とは１ループにかける時間（ミリ秒）
  (timeLength : number, secperhour: number) : number => (timeLength / 3.6) * secperhour;
const assign = Object.assign;

interface Action {type:string, payload:any}
export const baseSlice = createSlice({
  name: 'base',
  initialState,
  reducers:{
		addMinutes:(state:BasedState, action:Action)=>addMinutes(state,action.payload),
		setViewport:(state:BasedState, action:Action)=>setViewport(state,action.payload),
		setDefaultViewport:(state:BasedState, action:Action)=>setDefaultViewport(state,action.payload),
		setTimeStamp:(state:BasedState, action:Action)=>setTimeStamp(state,action.payload),
		setTime:(state:BasedState, action:Action)=>setTime(state,action.payload),
		increaseTime:(state:BasedState, action:Action)=>increaseTime(state,action.payload),
		decreaseTime:(state:BasedState, action:Action)=>decreaseTime(state,action.payload),
		setLeading:(state:BasedState, action:Action)=>setLeading(state,action.payload),
		setTrailing:(state:BasedState, action:Action)=>setTrailing(state,action.payload),
		setFrameTimestamp:(state:BasedState, action:Action)=>setFrameTimestamp(state,action.payload),
		setMovesBase:(state:BasedState, action:Action)=>setMovesBase(state,action.payload),
		setDepotsBase:(state:BasedState, action:Action)=>setDepotsBase(state,action.payload),
		setLocationData:(state:BasedState, action:Action)=>setLocationData(state,action.payload),
		setLocationDataOption:(state:BasedState, action:Action)=>setLocationDataOption(state,action.payload),
		setAnimatePause:(state:BasedState, action:Action)=>setAnimatePause(state,action.payload),
		setAnimateReverse:(state:BasedState, action:Action)=>setAnimateReverse(state,action.payload),
		setSecPerHour:(state:BasedState, action:Action)=>setSecPerHour(state,action.payload),
		setMultiplySpeed:(state:BasedState, action:Action)=>setMultiplySpeed(state,action.payload),
		setClicked:(state:BasedState, action:Action)=>setClicked(state,action.payload),
		setRoutePaths:(state:BasedState, action:Action)=>setRoutePaths(state,action.payload),
		setDefaultPitch:(state:BasedState, action:Action)=>setDefaultPitch(state,action.payload),
		setMovesOptionFunc:(state:BasedState, action:Action)=>setMovesOptionFunc(state,action.payload),
		setDepotsOptionFunc:(state:BasedState, action:Action)=>setDepotsOptionFunc(state,action.payload),
		setExtractedDataFunc:(state:BasedState, action:Action)=>setExtractedDataFunc(state,action.payload),
		setLinemapData:(state:BasedState, action:Action)=>setLinemapData(state,action.payload),
		setLoading:(state:BasedState, action:Action)=>setLoading(state,action.payload),
		setInputFilename:(state:BasedState, action:Action)=>setInputFilename(state,action.payload),
		updateMovesBase:(state:BasedState, action:Action)=>updateMovesBase(state,action.payload),
		setNoLoop:(state:BasedState, action:Action)=>setNoLoop(state,action.payload),
		setInitialViewChange:(state:BasedState, action:Action)=>setInitialViewChange(state,action.payload),
		setIconGradationChange:(state:BasedState, action:Action)=>setIconGradationChange(state,action.payload),
		setTimeBegin:(state:BasedState, action:Action)=>setTimeBegin(state,action.payload),
		setTimeLength:(state:BasedState, action:Action)=>setTimeLength(state,action.payload),
		addMovesBaseData:(state:BasedState, action:Action)=>addMovesBaseData(state,action.payload),
  }
})
export default baseSlice.reducer

const addMinutes = (state:BasedState, min:number):BasedState => {
  const assignData:InnerState = {}
  assignData.loopEndPause = false
  assignData.settime = safeAdd(state.settime, (min * 60))
  if (assignData.settime < safeSubtract(state.timeBegin, state.leading)) {
    assignData.settime = safeSubtract(state.timeBegin, state.leading)
  }
  if (assignData.settime > (state.timeBegin + state.timeLength)) {
    assignData.settime = (state.timeBegin + state.timeLength)
  }
  assignData.starttimestamp = Date.now() -
    (((assignData.settime - state.timeBegin) / state.timeLength) * state.loopTime)
  return assign({}, state, assignData)
}

const setViewport = (state:BasedState, view:Viewport):BasedState => {
  const viewport = assign({}, state.viewport, view)
  return assign({}, state, {
    viewport
  })
}

const setDefaultViewport = (state:BasedState, defViewport:{defaultZoom?:number,defaultPitch?:number}={}):BasedState => {
  const {defaultZoom,defaultPitch} = defViewport
  const zoom = defaultZoom === undefined ? state.defaultZoom : defaultZoom
  const pitch = defaultPitch === undefined ? state.defaultPitch : defaultPitch
  const viewport = assign({}, state.viewport, { bearing:0, zoom, pitch })
  return assign({}, state, {
    viewport, defaultZoom:zoom, defaultPitch:pitch
  })
}

const setTimeStamp = (state:BasedState, props:BasedProps):BasedState => {
  const starttimestamp = (Date.now() + calcLoopTime(state.leading, state.secperhour));
  return assign({}, state, {
    starttimestamp, loopEndPause:false
  })
}

const setTime = (state:BasedState, settime:number):BasedState => {
  const starttimestamp = Date.now() - ((safeSubtract(settime, state.timeBegin) / state.timeLength) * state.loopTime)
  return assign({}, state, {
    settime, starttimestamp, loopEndPause:false
  })
}

const increaseTime = (state:BasedState, props:BasedProps):BasedState => {
  const assignData:InnerState = {};
  const now = Date.now();
  const difference = now - state.starttimestamp;
  if(state.noLoop){
    const margins = calcLoopTime(state.leading + state.trailing, state.secperhour);
    if(difference >= (state.loopTime - margins)){
      return assign({}, state, {loopEndPause:true});
    }
  }
  if (difference >= state.loopTime) {
    console.log('settime overlap.');
    assignData.settime = safeSubtract(state.timeBegin, state.leading);
    assignData.starttimestamp = now - ((safeSubtract(assignData.settime, state.timeBegin) / state.timeLength) * state.loopTime);
    const setProps = { ...props, ...assignData };
    const {movedData,locationData,ExtractedData} = getMoveObjects(setProps);
    if(movedData){
      assignData.movedData = movedData;
      if(assignData.movedData.length === 0){
        assignData.clickedObject = null;
        assignData.routePaths = [];
      }
    }
    if(locationData){
      assignData.locationData = locationData;
    }
    assignData.ExtractedData = ExtractedData;
    if(state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc){
      const depotsData = getDepots(setProps)
      if(depotsData){
        assignData.depotsData = depotsData;
      }
    }
    return assign({}, state, assignData);
  }else{
//    assignData.settime = ((difference / state.loopTime) * state.timeLength) + state.timeBegin;
    assignData.settime = safeAdd((difference * parameter.coefficient), state.timeBegin);
  }
  if (state.settime > assignData.settime) {
    console.log(`${state.settime} ${assignData.settime}`);
  }
  assignData.beforeFrameTimestamp = now;
  const setProps = { ...props, ...assignData };
  const {movedData,locationData,ExtractedData} = getMoveObjects(setProps);
  if(movedData){
    assignData.movedData = movedData;
    if(assignData.movedData.length === 0){
      assignData.clickedObject = null;
      assignData.routePaths = [];
    }
  }
  if(locationData){
    assignData.locationData = locationData;
  }
  assignData.ExtractedData = ExtractedData;
  if(state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc){
    const depotsData = getDepots(setProps)
    if(depotsData){
      assignData.depotsData = depotsData;
    }
  }
  return assign({}, state, assignData);
}

const decreaseTime = (state:BasedState, props:BasedProps):BasedState => {
  const now = Date.now();
  const beforeFrameElapsed = now - state.beforeFrameTimestamp;
  const assignData:InnerState = {};
  assignData.starttimestamp = state.starttimestamp + (beforeFrameElapsed << 1);
  assignData.settime = safeAdd(((now - state.starttimestamp) % state.loopTime) * parameter.coefficient, state.timeBegin);
  if (assignData.settime <= safeSubtract(state.timeBegin, state.leading)) {
    if(state.noLoop){
      return assign({}, state, {loopEndPause:true});
    }
    assignData.settime = safeAdd(state.timeBegin, state.timeLength);
    assignData.starttimestamp = now - ((safeSubtract(assignData.settime, state.timeBegin) / state.timeLength) * state.loopTime);
  }
  assignData.beforeFrameTimestamp = now;
  const setProps = { ...props, ...assignData };
  const {movedData,locationData,ExtractedData} = getMoveObjects(setProps);
  if(movedData){
    assignData.movedData = movedData;
    if(assignData.movedData.length === 0){
      assignData.clickedObject = null;
      assignData.routePaths = [];
    }
  }
  if(locationData){
    assignData.locationData = locationData;
  }
  assignData.ExtractedData = ExtractedData;
  if(state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc){
    const depotsData = getDepots(setProps)
    if(depotsData){
      assignData.depotsData = depotsData;
    }
  }
  return assign({}, state, assignData);
}

const setLeading = (state:BasedState, leading:number):BasedState => {
  safeCheck(leading);
  return assign({}, state, {
    leading
  });
}

const setTrailing = (state:BasedState, trailing:number):BasedState => {
  safeCheck(trailing);
  return assign({}, state, {
    trailing
  });
}

const setFrameTimestamp = (state:BasedState, props:BasedProps):BasedState => {
  const assignData:InnerState = {};
  const now = Date.now();
  assignData.beforeFrameTimestamp = now;
  assignData.starttimestamp = now - ((safeSubtract(state.settime, state.timeBegin) / state.timeLength) * state.loopTime);
  const setProps = { ...props, ...assignData };
  const {movedData,locationData,ExtractedData} = getMoveObjects(setProps);
  if(movedData){
    assignData.movedData = movedData;
    if(assignData.movedData.length === 0){
      assignData.clickedObject = null;
      assignData.routePaths = [];
    }
  }
  if(locationData){
    assignData.locationData = locationData;
  }
  assignData.ExtractedData = ExtractedData;
  if(state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc){
    const depotsData = getDepots(setProps)
    if(depotsData){
      assignData.depotsData = depotsData;
    }
  }
  return assign({}, state, assignData);
}

const setMovesBaseFunc = (state:BasedState, analyzeData:AnalyzedBaseData):BasedState => {
  const assignData:InnerState = {};
  assignData.loopEndPause = false;
  assignData.timeBegin = analyzeData.timeBegin;
  assignData.bounds = analyzeData.bounds;
  if(analyzeData.viewport && state.initialViewChange && analyzeData.movesbase.length > 0){
    assignData.viewport = assign({}, state.viewport,
      {bearing:0, zoom:state.defaultZoom, pitch:state.defaultPitch}, analyzeData.viewport);
  }
  assignData.settime =
    safeSubtract(analyzeData.timeBegin, (analyzeData.movesbase.length === 0 ? 0 : state.leading));
  if (analyzeData.timeLength > 0) {
    assignData.timeLength = safeAdd(analyzeData.timeLength, state.trailing);
  }else{
    assignData.timeLength = analyzeData.timeLength;
  }
  assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
  parameter.coefficient = assignData.timeLength / assignData.loopTime;
  // starttimestampはDate.now()の値でいいが、スタート時はleading分の余白時間を付加する
  assignData.starttimestamp = Date.now() + calcLoopTime(state.leading, state.secperhour);
  if(state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc){
    const depotsData = getDepots({ ...state, ...assignData })
    if(depotsData){
      assignData.depotsData = depotsData;
    }
  }
  assignData.movesbase = analyzeData.movesbase;
  assignData.movedData = [];
  console.log('setMovesBaseFunc');
  return assign({}, state, assignData);
};

const setMovesBase = (state:BasedState, base:(Movesbase[] | MovesbaseFile)):BasedState => {
  const analyzeData:Readonly<AnalyzedBaseData> = analyzeMovesBase(state, base, false);
  return setMovesBaseFunc(state, analyzeData);
}

const setDepotsBase = (state:BasedState, depotsBase:Depotsbase[]):BasedState => {
  const assignData:InnerState = {};
  assignData.depotsBase = depotsBase;
  assignData.depotsData = [];
  if(state.depotsBase.length <= 0 || state.depotsData.length <= 0 || state.getDepotsOptionFunc){
    const depotsData = getDepots({ ...state, depotsBase })
    if(depotsData){
      assignData.depotsData = depotsData;
    }
  }
  return assign({}, state, assignData);
}

const setLocationData = (state:Readonly<BasedState>, data:Readonly<LocationData>):BasedState => {
  const assignData:InnerState = {}
  if('id' in data){
    const locationBase = state.locationBase
    const firstTime = locationBase.length === 0
    let findIdx = -1
    for (let i = 0, lengthi = locationBase.length; i < lengthi; i=(i+1)|0) {
      if(data.id === locationBase[i].id){
        const { id, position, elapsedtime:datatime, ...otherData} = data
        const elapsedtime = datatime || state.settime || Date.now()/1000
        locationBase[i] = {...locationBase[i], ...otherData}
        if(locationBase[i].elapsedtime < elapsedtime){
          if('position' in data){
            let direction = 0
            if(locationBase[i].targetPosition[0] === data.position[0] && locationBase[i].targetPosition[1] === data.position[1]){
              direction = locationBase[i].direction
            }else{
              const x1 = radians(locationBase[i].targetPosition[0])
              const y1 = radians(locationBase[i].targetPosition[1])
              const x2 = radians(data.position[0])
              const y2 = radians(data.position[1])
              const deltax = x2 - x1
              direction = degrees(atan2(sin(deltax), 
                cos(y1) * tan(y2) - sin(y1) * cos(deltax))) % 360
            }
            locationBase[i].direction = direction
            locationBase[i].sourcePosition = [...locationBase[i].targetPosition]
            locationBase[i].targetPosition = [...data.position]
            if('position' in locationBase[i]){
              delete locationBase[i].position
            }
          }
          locationBase[i].elapsedtime = elapsedtime
        }
        findIdx = i
        break
      }
    }
		if(findIdx < 0){
      let i = findIdx = locationBase.length
      locationBase.push({...data})
      if('position' in data){
        locationBase[i].direction = 0
        locationBase[i].sourcePosition = [...data.position]
        locationBase[i].targetPosition = [...data.position]
        delete locationBase[i].position
      }
      locationBase[i].elapsedtime = data.elapsedtime || state.settime || Date.now()/1000
    }

    assignData.loopEndPause = false
    const targetData = locationBase[findIdx]
    if(firstTime && state.timeLength <= 0){
      assignData.timeBegin = targetData.elapsedtime
      assignData.settime = assignData.timeBegin
      assignData.timeLength = state.defaultAddTimeLength
      assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour)
      parameter.coefficient = assignData.timeLength / assignData.loopTime
      assignData.starttimestamp = Date.now()
    }else{
      if(targetData.elapsedtime < state.timeBegin){
        const difference = safeSubtract(state.timeBegin,targetData.elapsedtime)
        assignData.timeBegin = targetData.elapsedtime
        assignData.timeLength = safeAdd(state.timeLength,difference)
        assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour)
        parameter.coefficient = assignData.timeLength / assignData.loopTime
        assignData.starttimestamp =
          (Date.now() - ((safeSubtract(state.settime, assignData.timeBegin) / assignData.timeLength) * assignData.loopTime));
      }else{
        const compLength = safeSubtract(targetData.elapsedtime,state.timeBegin)
        if((state.timeLength - state.remainingTime) <= compLength){
          assignData.timeLength = state.timeLength
          do {
            assignData.timeLength = safeAdd(assignData.timeLength,state.defaultAddTimeLength)
          } while(safeSubtract(assignData.timeLength,state.remainingTime) < compLength)
          assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour)
          parameter.coefficient = assignData.timeLength / assignData.loopTime
          assignData.starttimestamp =
            (Date.now() - ((safeSubtract(state.settime, state.timeBegin) / assignData.timeLength) * assignData.loopTime));
        }
      }
    }
    assignData.locationBase = [...locationBase]
  }else{
    console.log('setLocationData id undefined')
  }
  return assign({}, state, assignData)
}

const setLocationDataOption = (state:BasedState, parameter:LocationDataOption):BasedState => {
  const assignData:InnerState = {};
  const { locationMoveDuration, defaultAddTimeLength, remainingTime } = parameter
  if(locationMoveDuration !== undefined){
    assignData.locationMoveDuration = locationMoveDuration
  }
  if(defaultAddTimeLength !== undefined){
    assignData.defaultAddTimeLength = defaultAddTimeLength
  }
  if(remainingTime !== undefined){
    assignData.remainingTime = remainingTime
  }
  return assign({}, state, assignData);
}

const setAnimatePause = (state:BasedState, animatePause:boolean):BasedState => {
  const assignData:InnerState = {};
  assignData.animatePause = animatePause;
  assignData.loopEndPause = false;
  assignData.starttimestamp = (Date.now() - ((safeSubtract(state.settime, state.timeBegin) / state.timeLength) * state.loopTime));
  return assign({}, state, assignData);
}

const setAnimateReverse = (state:BasedState, animateReverse:boolean):BasedState => {
  return assign({}, state, {
    animateReverse, loopEndPause:false
  });
}

const setSecPerHour = (state:BasedState, secperhour:number):BasedState => {
  if(secperhour === 0){
    console.log('secperhour set zero!');
    return state;
  }
  const assignData:InnerState = {};
  assignData.loopEndPause = false;
  assignData.secperhour = secperhour;
  assignData.multiplySpeed = 3600 / secperhour;
  assignData.loopTime = calcLoopTime(state.timeLength, secperhour);
  parameter.coefficient = state.timeLength / assignData.loopTime;
  if (!state.animatePause) {
    assignData.starttimestamp =
      (Date.now() - ((safeSubtract(state.settime, state.timeBegin) / state.timeLength) * assignData.loopTime));
  }
  return assign({}, state, assignData);
}

const setMultiplySpeed = (state:BasedState, multiplySpeed:number):BasedState => {
  if(multiplySpeed === 0){
    console.log('secperhour set zero!');
    return state;
  }
  const assignData:InnerState = {};
  assignData.loopEndPause = false;
  assignData.multiplySpeed = multiplySpeed;
  assignData.secperhour = 3600 / multiplySpeed;
  assignData.loopTime = calcLoopTime(state.timeLength, assignData.secperhour);
  parameter.coefficient = state.timeLength / assignData.loopTime;
  if (!state.animatePause) {
    assignData.starttimestamp =
      (Date.now() - ((safeSubtract(state.settime, state.timeBegin) / state.timeLength) * assignData.loopTime));
  }
  return assign({}, state, assignData);
}

const setClicked = (state:BasedState, clickedObject:(null | ClickedObject[])):BasedState => {
  return assign({}, state, {
    clickedObject
  });
}

const setRoutePaths = (state:BasedState, routePaths:RoutePaths[]):BasedState => {
  return assign({}, state, {
    routePaths
  });
}

const setDefaultPitch = (state:BasedState, defaultPitch:number):BasedState => {
  return assign({}, state, {
    defaultPitch
  });
}

const setMovesOptionFunc = (state:BasedState, getMovesOptionFunc:GetMovesOptionFunc):BasedState => {
  return assign({}, state, {
    getMovesOptionFunc
  });
}

const setDepotsOptionFunc = (state:BasedState, getDepotsOptionFunc:GetDepotsOptionFunc):BasedState => {
  return assign({}, state, {
    getDepotsOptionFunc
  });
}

const setExtractedDataFunc = (state:BasedState, getExtractedDataFunc:GetExtractedDataFunc):BasedState => {
  return assign({}, state, {
    getExtractedDataFunc
  });
}

const setLinemapData = (state:BasedState, linemapData:LineMapData[]):BasedState => {
  return assign({}, state, {
    linemapData
  });
}

const setLoading = (state:BasedState, loading:boolean):BasedState => {
  return assign({}, state, {
    loading
  });
}

const setInputFilename = (state:BasedState, fileName:Object):BasedState => {
  const inputFileName = assign({}, state.inputFileName, fileName);
  return assign({}, state, {
    inputFileName
  });
}

const updateMovesBase = (state:BasedState, base:Movesbase[] | MovesbaseFile):BasedState => {
  const analyzeData:Readonly<AnalyzedBaseData> = analyzeMovesBase(state, base, true);
  if(state.movesbase.length === 0){ //初回？
    return setMovesBaseFunc(state, analyzeData);
  }

  const assignData:InnerState = {};
  assignData.loopEndPause = false;
  assignData.movesbase = analyzeData.movesbase;
  const startState:InnerState = {};
  startState.timeLength = analyzeData.timeLength;
  if (startState.timeLength > 0) {
    startState.timeLength = safeAdd(startState.timeLength, state.trailing);
  }
  if(analyzeData.timeBegin !== state.timeBegin || startState.timeLength !== state.timeLength){
    startState.timeBegin = analyzeData.timeBegin;
    startState.loopTime = calcLoopTime(startState.timeLength, state.secperhour);
    parameter.coefficient = startState.timeLength / startState.loopTime;
    startState.starttimestamp =
      (Date.now() - ((safeSubtract(state.settime, startState.timeBegin) / startState.timeLength) * startState.loopTime));
    return assign({}, state, startState, assignData);
  }
  return assign({}, state, assignData);
}

const setNoLoop = (state:BasedState, noLoop:boolean):BasedState => {
  return assign({}, state, {
    noLoop, loopEndPause:false
  });
}

const setInitialViewChange = (state:BasedState, initialViewChange:boolean):BasedState => {
  return assign({}, state, {
    initialViewChange
  });
}

const setIconGradationChange = (state:BasedState, iconGradation:boolean):BasedState => {
  return assign({}, state, {
    iconGradation
  });
}

const setTimeBegin = (state:BasedState, timeBegin:number):BasedState => {
  safeCheck(timeBegin);
  const assignData:InnerState = {};
  const movesbaselength = state.movesbase.length;
  if(movesbaselength > 0){
    const firstDeparturetime = state.movesbase.reduce((acc,cur)=>Math.min(acc,cur.departuretime),Number.MAX_SAFE_INTEGER);
    if(firstDeparturetime >= timeBegin){
      assignData.timeBegin = timeBegin;
      assignData.timeLength = safeAdd(state.timeLength, safeSubtract(state.timeBegin, assignData.timeBegin));
      if(assignData.timeLength === 0){
        assignData.settime = assignData.timeBegin;
      }else{
        assignData.settime = state.settime;
      }
      assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
      parameter.coefficient = assignData.timeLength / assignData.loopTime;
      assignData.starttimestamp =
        (Date.now() - ((safeSubtract(assignData.settime, assignData.timeBegin) / assignData.timeLength) * assignData.loopTime));
    }
  }else{
    if(state.timeLength === 0){
      assignData.timeBegin = timeBegin;
      assignData.settime = assignData.timeBegin;
      assignData.starttimestamp = Date.now();
    }else
    if((state.timeBegin + state.timeLength) >= timeBegin){
      assignData.timeBegin = timeBegin;
      assignData.timeLength = safeAdd(state.timeLength, safeSubtract(state.timeBegin, assignData.timeBegin));
      if(assignData.timeLength === 0){
        assignData.settime = assignData.timeBegin;
      }else{
        assignData.settime = state.settime;
      }
      assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
      parameter.coefficient = assignData.timeLength / assignData.loopTime;
      assignData.starttimestamp =
        (Date.now() - ((safeSubtract(assignData.settime, assignData.timeBegin) / assignData.timeLength) * assignData.loopTime));
    }
  }
  return assign({}, state, assignData);
}

const setTimeLength = (state:BasedState, timeLength:number):BasedState => {
  safeCheck(timeLength);
  const assignData:InnerState = {};
  const movesbaselength = state.movesbase.length;
  if(timeLength >= 0){
    if(movesbaselength > 0){
      if(timeLength >= state.trailing){
        const lastArrivaltime = state.movesbase.reduce((acc,cur)=>Math.max(acc,cur.arrivaltime),state.timeBegin);
        if(safeSubtract(safeAdd(state.timeBegin, timeLength), state.trailing) >= lastArrivaltime){
          assignData.timeLength = timeLength;
          if(assignData.timeLength === 0){
            assignData.settime = state.timeBegin;
          }else{
            assignData.settime = state.settime;
          }
          assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
          parameter.coefficient = assignData.timeLength / assignData.loopTime;
          assignData.starttimestamp =
            (Date.now() - ((safeSubtract(assignData.settime, state.timeBegin) / assignData.timeLength) * assignData.loopTime));
        }
      }
    }else{
      assignData.timeLength = timeLength;
      if(assignData.timeLength === 0){
        assignData.settime = state.timeBegin;
      }else{
        assignData.settime = state.settime;
      }
      assignData.loopTime = calcLoopTime(assignData.timeLength, state.secperhour);
      parameter.coefficient = assignData.timeLength / assignData.loopTime;
      assignData.starttimestamp =
        (Date.now() - ((safeSubtract(assignData.settime, state.timeBegin) / assignData.timeLength) * assignData.loopTime));
    }
  }
  return assign({}, state, assignData);
}

const addMovesBaseData = (state:BasedState, movesbase:Movesbase[]):BasedState => {
  const movesbaseidxArray = movesbase.map(x=>x.movesbaseidx);
  const analyzeData:Readonly<AnalyzedBaseData> = analyzeMovesBase(state, movesbase, true);
  if(state.movesbase.length === 0){ //初回？
    return setMovesBaseFunc(state, analyzeData);
  }

  const assignData:InnerState = {};
  assignData.loopEndPause = false;
  assignData.movesbase = [...state.movesbase];
  for (let i = 0, lengthi = movesbaseidxArray.length; i < lengthi; i=(i+1)|0) {
    const movesbaseidx = movesbaseidxArray[i];
    if(movesbaseidx !== undefined && movesbaseidx < state.movesbase.length){
      assignData.movesbase[movesbaseidx] = analyzeData.movesbase[i];
      assignData.movesbase[movesbaseidx].movesbaseidx = movesbaseidx;
    }else{
      const addidx = assignData.movesbase.length;
      assignData.movesbase.push(analyzeData.movesbase[i]);
      assignData.movesbase[addidx].movesbaseidx = addidx;
    }
  }
  const startState:InnerState = {};
  if(analyzeData.timeBegin < state.timeBegin){
    startState.timeBegin = analyzeData.timeBegin;
  }else{
    startState.timeBegin = state.timeBegin;
  }
  const analyzeEndTime = safeAdd(analyzeData.timeBegin, analyzeData.timeLength);
  const stateEndTime = safeAdd(state.timeBegin, state.timeLength);
  if(analyzeEndTime > stateEndTime){
    startState.timeLength = safeSubtract(analyzeEndTime, startState.timeBegin);
  }else{
    startState.timeLength = safeSubtract(stateEndTime, startState.timeBegin);
  }
  if(startState.timeBegin !== state.timeBegin || startState.timeLength !== state.timeLength){
    startState.loopTime = calcLoopTime(startState.timeLength, state.secperhour);
    parameter.coefficient = startState.timeLength / startState.loopTime;
    startState.starttimestamp =
      (Date.now() - ((safeSubtract(state.settime, startState.timeBegin) / startState.timeLength) * startState.loopTime));
    return assign({}, state, startState, assignData);
  }
  return assign({}, state, assignData);
}
