import React, { Component } from 'react';
import { AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton,
  ElapsedTimeRange, SpeedRange } from 'harmoware-vis';
import BusStopInfo from './busstop-info';
import XbandDataInput from './xbanddata-input';

const getXbandLabelBySize = (xbandCellSize) => {
  if (xbandCellSize === 0) {
    return '雨量表示(0)';
  } else if (xbandCellSize <= 50) {
    return '雨量表示(1)';
  } else if (xbandCellSize <= 100) {
    return '雨量表示(2)';
  } else if (xbandCellSize <= 150) {
    return '雨量表示(3)';
  } else if (xbandCellSize >= 200) {
    return '雨量表示(4)';
  }
  return '雨量表示(X)';
};

const getNextCellSize = (xbandCellSize) => {
  if (xbandCellSize >= 200) {
    return 0;
  }
  return xbandCellSize + 50;
};

export default class Controller extends Component {
/*  constructor() {
    super();
  } */

  onTripSelect(e) {
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

  onBusSelect(e) {
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

  onBusstopSelect(e) {
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
      zoom: 16
    });
  }

  setDelayRange(e) {
    const range = e.target.value;
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

  handleChangeFile(e) {
    const { actions, trailing, defaultZoom, defaultPitch } = this.props;
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.readAsText(file);
    reader.onload = (ev) => {
      let readdata = '';
      try {
        readdata = JSON.parse(reader.result);
      } catch (exception) {
        window.alert(exception);
        return;
      }
      const { timeBegin, timeLength, bounds, busmovesbase, busmovesbasedic } = readdata;
      if (!timeBegin || !timeLength || !bounds || !busmovesbase || !busmovesbasedic) {
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
    };
  }

  render() {
    const {
      answer, settime, timeLength, secperhour, xbandCellSize,
      selectedBusstop, selectedBus, answers, date, actions,
      animatePause, animateReverse, xbandFname, getOptionChangeChecked,
      getArchLayerChangeChecked,
      delayrange, depotsData, movedData, busmovesbasedic
    } = this.props;

    const xBandViewLabel = getXbandLabelBySize(xbandCellSize);

    const optionsTrip = answers.map(
      ans => <option value={ans} key={ans}>{ans}</option>);

    return (
      <div className="controller">
        <ul className="controller__list">
          <li className="controller__list__item"><span>運行データ選択</span>
            <span className="controller__spacer">
              <select
                id="trip_select" value={answer}
                onChange={this.onTripSelect.bind(this)}
              >{optionsTrip}</select>
            </span>
          </li>
          <li className="controller__list__item"><span>オプション表示パターン切替</span>
            <input type="checkbox" onChange={getOptionChangeChecked} />
          </li>
          <li className="controller__list__item"><span>アーチレイヤ表示切替</span>
            <input type="checkbox" onChange={getArchLayerChangeChecked} />
          </li>
          <li className="controller__list__item">
            <input type="file" accept=".json" onChange={this.handleChangeFile.bind(this)} />
          </li>
          <li className="controller__list__item">
            {animatePause ?
              <PlayButton actions={actions}>⏯️ 　開始　</PlayButton> :
              <PauseButton actions={actions}>⏯️ 一時停止</PauseButton>
            }&nbsp;
            {animateReverse ?
              <ForwardButton actions={actions}>▶️ 正再生</ForwardButton> :
              <ReverseButton actions={actions}>◀️ 逆再生</ReverseButton>
            }
          </li>
          <li className="controller__list__item">
            <AddMinutesButton addMinutes={-10} actions={actions}>⏮ -10分</AddMinutesButton>&nbsp;
            <AddMinutesButton addMinutes={-5} actions={actions}>⏮ -5分</AddMinutesButton>&nbsp;
            <AddMinutesButton addMinutes={5} actions={actions}>5分 ⏭</AddMinutesButton>&nbsp;
            <AddMinutesButton addMinutes={10} actions={actions}>10分 ⏭</AddMinutesButton>
          </li>
          <li className="controller__list__item"><span>経過時間</span>
            <ElapsedTimeRange settime={settime} timeLength={timeLength} actions={actions} />
            <span className="controller__spacer">{Math.floor(settime)}&nbsp;秒</span>
          </li>
          <li className="controller__list__item"><span>スピード</span>
            <SpeedRange secperhour={secperhour} actions={actions} />
            <span className="controller__spacer">{secperhour}&nbsp;秒/時</span>
          </li>
          <li className="controller__list__item"><span>遅延度LV</span>
            <input
              type="range" value={delayrange} min="1" max="120" step="1"
              onChange={this.setDelayRange.bind(this)}
            />
            <span className="controller__spacer">0～{delayrange}分</span></li>
          <li className="controller__list__item">
            <button onClick={this.setCellSize.bind(this)}>{xBandViewLabel}</button>
            <span>{xbandCellSize ? xbandFname : ''}</span>
          </li>
          <li>
            <XbandDataInput actions={actions} />
          </li>
          <li className="controller__list__item">
            <span className="controller__spacer">バス停検索</span>
            <span className="controller__spacer">
              <select
                className="controller__select"
                id="busstop_select" value={selectedBusstop}
                onChange={this.onBusstopSelect.bind(this)}
              >
                <option value="">0000 バス停を選択</option>
                {depotsData.map(
                  busstop => <option
                    value={busstop.code} key={busstop.code}
                  >{busstop.code} {busstop.name}</option>
                )}
              </select>
            </span>
          </li>
          <li className="controller__list__item">
            <BusStopInfo
              selectedBusstop={selectedBusstop} date={date} depotsData={depotsData}
            />
          </li>
          <li className="controller__list__item">
            {animatePause && Object.keys(busmovesbasedic).length > 0 &&
              <div>
                運行中バス選択
                <select
                  className="controller__spacer"
                  id="bus_select" value={selectedBus} onChange={this.onBusSelect.bind(this)}>
                  {movedData.map(bus => <option value={bus.code} key={bus.code}>{`${bus.code}:${bus.name.split(' ')[0]} ${bus.name.split(' ')[1]}`}</option>)}
                </select>
              </div>
            }
          </li>
        </ul>
      </div>
    );
  }
}
