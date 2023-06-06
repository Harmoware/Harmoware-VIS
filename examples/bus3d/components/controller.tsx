import * as React from 'react';
import { Bus3dProps } from '../types';
import { AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton, ElapsedTimeRange,
  ElapsedTimeValue, SpeedRange, SpeedValue, NavigationButton } from 'harmoware-vis';
import { setupFetch, updateRoute } from '../sagas'
import i18n from '../locales/I18n';
import BusStopInfo from './busstop-info';
import XbandDataInput from './xbanddata-input';
import { State } from '../containers';

const getXbandLabelBySize = (xbandCellSize: number, label: string): string => {
  if (xbandCellSize === 0) {
    return `${label}(0)`;
  } else if (xbandCellSize <= 50) {
    return `${label}(1)`;
  } else if (xbandCellSize <= 100) {
    return `${label}(2)`;
  } else if (xbandCellSize <= 150) {
    return `${label}(3)`;
  } else if (xbandCellSize >= 200) {
    return `${label}(4)`;
  }
  return `${label}(X)`;
};

interface Props extends Bus3dProps {
  date: number,
  getIconChangeChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getOptionChangeChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getArchLayerChangeChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  state: State
}

const Checkbox = React.memo(({id,onChange,title,className='harmovis_input_checkbox',checked}:
  {id:string,onChange:React.ChangeEventHandler,title:string,className?:string,checked?:boolean})=>
  <><input type="checkbox" id={id} onChange={onChange} className={className} checked={checked} />
  <label htmlFor={id} title={title}>{title}</label></>)

const Controller = (props:Props)=>{
  const { file, settime, timeBegin, timeLength, secperhour, xbandCellSize,
    selectedBusstop, selectedBus, filelist, date, actions, t, clickedObject,
    animatePause, animateReverse, xbandFname, getOptionChangeChecked,
    getIconChangeChecked, getArchLayerChangeChecked, viewport,
    delayrange, depotsData, movesbase, movedData, busmovesbasedic, state } = props

  const [filename,setFilename] = React.useState<string>('')

  const onLanguageSelect:React.ChangeEventHandler<HTMLSelectElement> = (e)=>{
    i18n.changeLanguage(e.target.value)
  }

  const onTripSelect:React.ChangeEventHandler<HTMLSelectElement> = (e)=>{
    const file = e.target.value
    actions.setFile(file)
    setupFetch(actions,file).catch((error)=>console.log({error}))
    actions.setRoutePaths([])
    actions.setSelectedBusstop('')
    actions.setHovered(null)
    actions.setClicked(null)
    actions.setAnimatePause(false)
    actions.setAnimateReverse(false)
  }

  const onBusSelect:React.ChangeEventHandler<HTMLSelectElement> = (e)=>{
    const code = e.target.value
    const movesbaseidx = busmovesbasedic[code]
    const { busclass } = movesbase[movesbaseidx]
    const { systemcode, direction, systemname, timetable } = busclass
    const name = `${systemcode}-${direction} ${timetable}発 ${systemname}`
    const memo = ''
    const el = {
      object: { code, name, memo, movesbaseidx },
      layer: { id: 'MovesLayer' }
    }
    updateRoute([el], true, props)
    actions.setSelectedBus(code)
  }

  const onBusstopSelect:React.ChangeEventHandler<HTMLSelectElement> = (e)=>{
    const value = e.target.value;
    const busstop = depotsData.find((busstopElement) => {
      if (busstopElement.code === value) {
        return true
      }
      return false
    })
    if (!busstop) {
      return
    }
    actions.setSelectedBusstop(value)
    actions.setViewport({
      longitude: busstop.position[0],
      latitude: busstop.position[1],
      zoom: 16, transitionDuration: 100
    })
  }

  const setDelayRange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const range: number = +e.target.value
    actions.setDelayRange(range)
    updateRoute(clickedObject, false, props)
  }

  const setCellSize = ()=>{
    const nextCellSize = getNextCellSize(xbandCellSize)
    actions.setCellSize(nextCellSize)
    if (nextCellSize === 0) {
      actions.setRainfall([])
    }
  }

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const reader = new FileReader()
    const file = e.target.files[0]
    actions.setLoading(true)
    reader.readAsText(file)
    reader.onload = (ev: ProgressEvent) => {
      let readdata = null
      try {
        readdata = JSON.parse(reader.result.toString())
      } catch (exception) {
        actions.setLoading(false)
        window.alert(exception)
        return
      }
      const { timeBegin, timeLength, bounds, busmovesbase, busmovesbasedic } = readdata
      if (!timeBegin || !timeLength || !bounds || !busmovesbase || !busmovesbasedic) {
        actions.setLoading(false)
        window.alert('運行データ形式不正')
        return
      }
      actions.setFile(file.name)
      actions.setBusTripsCsv([])
      actions.setBusTripIndex({})
      actions.setMovesBase({ timeBegin, timeLength, bounds, movesbase: busmovesbase })
      actions.setBusMovesBaseDic(busmovesbasedic)
      actions.setRoutePaths([])
      actions.setBusOption({})
      actions.setBsoptFname('')
      actions.setArchBase([])
      actions.setSelectedBusstop('')
      actions.setHovered(null)
      actions.setClicked(null)
      actions.setAnimatePause(false)
      actions.setAnimateReverse(false)
      setFilename(file.name)
      actions.setLoading(false)
    }
  }

  const xBandViewLabel = React.useMemo(()=>getXbandLabelBySize(xbandCellSize, t('XbandLabel')),[xbandCellSize,t])

  const optionsTrip = React.useMemo(()=>filelist.map(ans => <option value={ans} key={ans}>{ans}</option>),[filelist])

  const getNextCellSize = (xbandCellSize: number): number => {
    if (xbandCellSize >= 200) {
      return 0;
    }
    return xbandCellSize + 50;
  }
  
  return (
    <div className="harmovis_controller">
      <ul>
        <li className="flex_row">
          <div className="container" title={`${t('title')}`}>
            <label htmlFor="language_select">{t('title')}</label>
            <select className="bus3d_select"
              id="language_select" value={t('langId')}
              onChange={onLanguageSelect}
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </div>
        </li>
        <li className="flex_row">
          <div className="container" title={`${t('trip_select')}`}>
            <label htmlFor="trip_select">{t('trip_select')}</label>
            <select className="bus3d_select"
              id="trip_select" value={file}
              onChange={onTripSelect}
            >{optionsTrip}</select>
          </div>
        </li>
        <li className="flex_row">
          <Checkbox id="IconChangeChecked" onChange={getIconChangeChecked} title={`${t('IconChangeChecked')}`} checked={state.iconChange}/>
        </li>
        <li className="flex_row">
          <Checkbox id="OptionChangeChecked" onChange={getOptionChangeChecked} title={`${t('OptionChangeChecked')}`} checked={state.optionChange}/>
        </li>
        <li className="flex_row">
          <Checkbox id="ArchLayerChangeChecked" onChange={getArchLayerChangeChecked} title={`${t('ArchLayerChangeChecked')}`} checked={state.archLayerChange}/>
        </li>
        <li className="flex_row">
          <div className="harmovis_input_button_column" title={`${t('trip_select')}`}>
            <label htmlFor="MovesInput">{t('trip_select')}
              <input type="file" accept=".json" onChange={handleChangeFile} id="MovesInput" />
            </label>
            <div>{filename}</div>
          </div>
        </li>
        <li className="flex_row">
          {animatePause ?
            <PlayButton actions={actions}>⏯️&nbsp;{t('play')}</PlayButton> :
            <PauseButton actions={actions}>⏯️&nbsp;{t('pause')}</PauseButton>
          }&nbsp;
          {animateReverse ?
            <ForwardButton actions={actions}>▶️&nbsp;{t('forward')}</ForwardButton> :
            <ReverseButton actions={actions}>◀️&nbsp;{t('reverse')}</ReverseButton>
          }
        </li>
        <li className="flex_row">
          <AddMinutesButton addMinutes={-10} actions={actions}>⏮ -10{t('minute')}</AddMinutesButton>&nbsp;
          <AddMinutesButton addMinutes={-5} actions={actions}>⏮ -5{t('minute')}</AddMinutesButton>
        </li>
        <li className="flex_row">
          <AddMinutesButton addMinutes={5} actions={actions}>5{t('minute')} ⏭</AddMinutesButton>&nbsp;
          <AddMinutesButton addMinutes={10} actions={actions}>10{t('minute')} ⏭</AddMinutesButton>
        </li>
        <li className="flex_row">
          <NavigationButton buttonType="zoom-in" actions={actions} viewport={viewport} />&nbsp;
          <NavigationButton buttonType="zoom-out" actions={actions} viewport={viewport} />&nbsp;
          <NavigationButton buttonType="compass" actions={actions} viewport={viewport} />
        </li>
        <li className="flex_column">
          <label htmlFor="ElapsedTimeRange" title={`${t('elapsedTime')}`}>{t('elapsedTime')}
          <ElapsedTimeValue settime={settime} timeBegin={timeBegin} timeLength={timeLength} actions={actions} />
          {t('sec')}</label>
          <ElapsedTimeRange settime={settime} timeLength={timeLength} timeBegin={timeBegin} actions={actions}
          id="ElapsedTimeRange" />
        </li>
        <li className="flex_column">
          <label htmlFor="SpeedRange" title={`${t('speed')}`}>{t('speed')}
          <SpeedValue secperhour={secperhour} actions={actions} />{t('sec')}/{t('hour')}</label>
          <SpeedRange secperhour={secperhour} actions={actions} id="SpeedRange" />
        </li>
        <li className="flex_column">
          <label htmlFor="delayrange" title={`${t('delayrange')}`}>{t('delayrange')}LV&nbsp;0～{delayrange}&nbsp;{t('minute')}</label>
          <input type="range" value={delayrange} min="1" max="120" step="1" title={`${delayrange}`}
          onChange={setDelayRange} id="delayrange" className="harmovis_input_range" />
        </li>
        <li className="flex_row bus3d_input_button_column">
          <button onClick={setCellSize} title={xBandViewLabel}>{xBandViewLabel}</button>
          <div>{xbandCellSize ? xbandFname : ''}</div>
        </li>
        <li className="flex_row">
          <XbandDataInput actions={actions} t={t} />
        </li>
        <li className="flex_row">
          <div className="container">
            <label htmlFor="busstop_select" title={`${t('busStopLocation')}`}>{t('busStopLocation')}</label>
            <select className="bus3d_select"
              id="busstop_select" value={selectedBusstop}
              onChange={onBusstopSelect}
            >
              <option value="">0000 {t('busstopSelect')}</option>
              {depotsData.map(
                busstop => <option
                  value={busstop.code} key={busstop.code}
                >{busstop.code} {busstop.name}</option>
              )}
            </select>
          </div>
        </li>
        <li className="flex_row">
          <BusStopInfo
            selectedBusstop={selectedBusstop} date={date} depotsData={depotsData}
          />
        </li>
        <li className="flex_row">
          {animatePause && Object.keys(busmovesbasedic).length > 0 &&
            <div className="container">
              <label htmlFor="bus_select" title={`${t('busSelect')}`}>{t('busSelect')}</label>
              <select className="bus3d_select"
                id="bus_select" value={selectedBus}
                onChange={onBusSelect}
              >
                {movedData.map(bus => <option value={bus.code} key={bus.code}>
                {`${bus.code}:${bus.name.split(' ')[0]} ${bus.name.split(' ')[1]}`}</option>)}
              </select>
            </div>
          }
        </li>
      </ul>
    </div>
  )
}
export default Controller
