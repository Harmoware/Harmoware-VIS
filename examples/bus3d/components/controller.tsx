import * as React from 'react';
import { Bus3dProps } from '../types';
import { AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton, ElapsedTimeRange,
  ElapsedTimeValue, SpeedRange, SpeedValue, NavigationButton } from 'harmoware-vis';
import i18n from '../locales/I18n';
import BusStopInfo from './busstop-info';
import XbandDataInput from './xbanddata-input';

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

const getNextCellSize = (xbandCellSize: number): number => {
  if (xbandCellSize >= 200) {
    return 0;
  }
  return xbandCellSize + 50;
};

interface Props extends Bus3dProps {
  date: number,
  getIconChangeChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getOptionChangeChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getArchLayerChangeChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  t: (key: string) => string,
}

interface State {
  filename: string
}

export default class Controller extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filename: '',
    };
  }

  onLanguageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    i18n.changeLanguage(value);
  }

  onTripSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const answer = e.target.value;
    const { actions } = this.props;
    actions.setAnswer(answer);
    actions.setupFetch(answer);
    actions.setRoutePaths([]);
    actions.setSelectedBusstop('');
    actions.setHovered(null);
    actions.setClicked(null);
    actions.setAnimatePause(false);
    actions.setAnimateReverse(false);
  }

  onBusSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const { actions, movesbase, busmovesbasedic } = this.props;
    const code = e.target.value;
    const movesbaseidx = busmovesbasedic[code];
    const { busclass } = movesbase[movesbaseidx];
    const { systemcode, direction, systemname, timetable } = busclass;
    const name = `${systemcode}-${direction} ${timetable}発 ${systemname}`;
    const memo = '';
    const el = {
      object: { code, name, memo, movesbaseidx },
      layer: { id: 'MovesLayer' }
    };
    actions.updateRoute([el], true);
    actions.setSelectedBus(code);
  }

  onBusstopSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    const { actions, depotsData } = this.props;

    const busstop = depotsData.find((busstopElement) => {
      if (busstopElement.code === value) {
        return true;
      }
      return false;
    });

    if (!busstop) {
      return;
    }

    actions.setSelectedBusstop(value);
    actions.setViewport({
      longitude: busstop.position[0],
      latitude: busstop.position[1],
      zoom: 16, transitionDuration: 100
    });
  }

  setDelayRange(e: React.ChangeEvent<HTMLInputElement>) {
    const range: number = +e.target.value;
    const { actions, clickedObject } = this.props;
    actions.setDelayRange(range);
    actions.updateRoute(clickedObject, false);
  }

  setCellSize() {
    const { xbandCellSize, actions } = this.props;
    const nextCellSize = getNextCellSize(xbandCellSize);
    actions.setCellSize(nextCellSize);
    if (nextCellSize === 0) {
      actions.setRainfall([]);
    }
  }

  handleChangeFile(e: React.ChangeEvent<HTMLInputElement>) {
    const { actions } = this.props;
    const reader = new FileReader();
    const file = e.target.files[0];
    actions.setLoading(true);
    reader.readAsText(file);
    reader.onload = (ev: ProgressEvent) => {
      let readdata = null;
      try {
        readdata = JSON.parse(reader.result.toString());
      } catch (exception) {
        actions.setLoading(false);
        window.alert(exception);
        return;
      }
      const { timeBegin, timeLength, bounds, busmovesbase, busmovesbasedic } = readdata;
      if (!timeBegin || !timeLength || !bounds || !busmovesbase || !busmovesbasedic) {
        actions.setLoading(false);
        window.alert('運行データ形式不正');
        return;
      }
      actions.setAnswer(file.name);
      actions.setBusTripsCsv([]);
      actions.setBusTripIndex({});
      actions.setMovesBase({ timeBegin, timeLength, bounds, movesbase: busmovesbase });
      actions.setBusMovesBaseDic(busmovesbasedic);
      actions.setRoutePaths([]);
      actions.setBusOption({});
      actions.setBsoptFname('');
      actions.setArchBase([]);
      actions.setSelectedBusstop('');
      actions.setHovered(null);
      actions.setClicked(null);
      actions.setAnimatePause(false);
      actions.setAnimateReverse(false);
      this.setState({ filename: file.name });
      actions.setLoading(false);
    };
  }

  render() {
    const {
      answer, settime, timeBegin, timeLength, secperhour, xbandCellSize,
      selectedBusstop, selectedBus, answers, date, actions, t,
      animatePause, animateReverse, xbandFname, getOptionChangeChecked,
      getIconChangeChecked, getArchLayerChangeChecked, viewport,
      delayrange, depotsData, movedData, busmovesbasedic
    } = this.props;

    const xBandViewLabel = getXbandLabelBySize(xbandCellSize, t('XbandLabel'));

    const optionsTrip = answers.map(
      ans => <option value={ans} key={ans}>{ans}</option>);

    return (
      <div className="harmovis_controller">
        <ul>
          <li className="flex_row">
            <div className="container" title={`${t('title')}`}>
              <label htmlFor="language_select">{t('title')}</label>
              <select className="bus3d_select"
                id="language_select" value={t('langId')}
                onChange={this.onLanguageSelect.bind(this)}
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
                id="trip_select" value={answer}
                onChange={this.onTripSelect.bind(this)}
              >{optionsTrip}</select>
            </div>
          </li>
          <li className="flex_row">
            <input type="checkbox" id="IconChangeChecked" onChange={getIconChangeChecked} className="harmovis_input_checkbox" />
            <label htmlFor="IconChangeChecked" title={`${t('IconChangeChecked')}`}>{t('IconChangeChecked')}</label>
          </li>
          <li className="flex_row">
            <input type="checkbox" id="OptionChangeChecked" onChange={getOptionChangeChecked} className="harmovis_input_checkbox" />
            <label htmlFor="OptionChangeChecked" title={`${t('OptionChangeChecked')}`}>{t('OptionChangeChecked')}</label>
          </li>
          <li className="flex_row">
            <input type="checkbox" id="ArchLayerChangeChecked" onChange={getArchLayerChangeChecked} className="harmovis_input_checkbox" />
            <label htmlFor="ArchLayerChangeChecked" title={`${t('ArchLayerChangeChecked')}`}>{t('ArchLayerChangeChecked')}</label>
          </li>
          <li className="flex_row">
            <div className="harmovis_input_button_column" title={`${t('trip_select')}`}>
              <label htmlFor="MovesInput">{t('trip_select')}
                <input type="file" accept=".json" onChange={this.handleChangeFile.bind(this)} id="MovesInput" />
              </label>
              <div>{this.state.filename}</div>
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
            onChange={this.setDelayRange.bind(this)} id="delayrange" className="harmovis_input_range" />
          </li>
          <li className="flex_row bus3d_input_button_column">
            <button onClick={this.setCellSize.bind(this)} title={xBandViewLabel}>{xBandViewLabel}</button>
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
                onChange={this.onBusstopSelect.bind(this)}
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
                  onChange={this.onBusSelect.bind(this)}
                >
                  {movedData.map(bus => <option value={bus.code} key={bus.code}>
                  {`${bus.code}:${bus.name.split(' ')[0]} ${bus.name.split(' ')[1]}`}</option>)}
                </select>
              </div>
            }
          </li>
        </ul>
      </div>
    );
  }
}
