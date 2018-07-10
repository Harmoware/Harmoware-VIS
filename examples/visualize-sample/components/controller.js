// @flow

import React, { Component } from 'react';
import { MovesInput, DepotsInput,
  AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton,
  ElapsedTimeRange, SpeedRange, SimulationDateTime } from 'harmoware-vis';
import type { Actions, InputEvent } from 'harmoware-vis';

type ControllerProps = {
  settime: number,
  timeBegin: number,
  timeLength: number,
  secperhour: number,
  animatePause: boolean,
  animateReverse: boolean,
  getMoveOptionChecked: (e: InputEvent) => void,
  getDepotOptionChecked: (e: InputEvent) => void,
  getDepotOptionChecked: (e: InputEvent) => void,
  getOptionChangeChecked: (e: InputEvent) => void,
  animatePause: boolean,
  actions: Actions
}

export default class Controller extends Component<ControllerProps> {

  render() {
    const { settime, timeBegin, timeLength, actions,
      secperhour, animatePause, animateReverse,
      getMoveOptionChecked, getDepotOptionChecked,
      getOptionChangeChecked } = this.props;

    return (
      <div id="controller_area">
        <ul>
          <li>
            <span>運行データ</span>
            <MovesInput actions={actions} />
          </li>
          <li><span>運行データオプション</span>
            <input type="checkbox" onChange={getMoveOptionChecked} />
          </li>
          <li>
            <span>停留所データ</span>
            <DepotsInput actions={actions} />
          </li>
          <li><span>停留所データオプション</span>
            <input type="checkbox" onChange={getDepotOptionChecked} />
          </li>
          <li><span>オプション表示パターン切替</span>
            <input type="checkbox" onChange={getOptionChangeChecked} />
          </li>
          <li>
            {animatePause ?
              <PlayButton actions={actions} /> :
              <PauseButton actions={actions} />
            }&nbsp;
            {animateReverse ?
              <ForwardButton actions={actions} /> :
              <ReverseButton actions={actions} />
            }
          </li>
          <li>
            <AddMinutesButton addMinutes={-10} actions={actions}>⏮ -10分</AddMinutesButton>&nbsp;
            <AddMinutesButton addMinutes={-5} actions={actions}>⏮ -5分</AddMinutesButton>&nbsp;
            <AddMinutesButton addMinutes={5} actions={actions}>5分 ⏭</AddMinutesButton>&nbsp;
            <AddMinutesButton addMinutes={10} actions={actions}>10分 ⏭</AddMinutesButton>
          </li>
          <li>
            <SimulationDateTime timeBegin={timeBegin} settime={settime} />
          </li>
          <li><span>経過時間</span>
            <ElapsedTimeRange settime={settime} timeLength={timeLength} actions={actions} />
            <span>{Math.floor(settime)}&nbsp;秒</span>
          </li>
          <li><span>スピード</span>
            <SpeedRange secperhour={secperhour} actions={actions} />
            <span>{secperhour}&nbsp;秒/時</span>
          </li>
        </ul>
      </div>
    );
  }
}
