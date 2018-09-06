// @flow

import React, { Component } from 'react';
import { MovesInput, DepotsInput,
  AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton,
  ElapsedTimeRange, SpeedRange, SimulationDateTime, controllerClass } from 'harmoware-vis';
import { Icon } from 'react-icons-kit';
import { ic_delete_forever as icDeleteForever, ic_save as icSave, ic_layers as icLayers, ic_delete as icDelete } from 'react-icons-kit/md';
import type { Actions, InputEvent, ClickedObject, RoutePaths } from 'harmoware-vis';

type ControllerProps = {
  settime: number,
  timeBegin: number,
  timeLength: number,
  secperhour: number,
  animatePause: boolean,
  animateReverse: boolean,
  getMoveOptionChecked: (e: InputEvent) => void,
  getDepotOptionChecked: (e: InputEvent) => void,
  getHeatmapVisible: (e: InputEvent) => void,
  getOptionChangeChecked: (e: InputEvent) => void,
  animatePause: boolean,
  actions: Actions,
  clickedObject: null | Array<ClickedObject>,
  routePaths: Array<RoutePaths>,
}

type State = {
  currentGroupindex: number,
  routeGroupDisplay: boolean,
  saveRouteGroup: Array<Object>
}

export default class Controller extends Component<ControllerProps, State> {
  constructor() {
    super();
    this.state = {
      currentGroupindex: 0,
      routeGroupDisplay: false,
      saveRouteGroup: [],
    };
  }

  clearAllRoute() {
    this.props.actions.setClicked(null);
    this.props.actions.setRoutePaths([]);
    this.setState({ currentGroupindex: 0, routeGroupDisplay: false, saveRouteGroup: [] });
  }

  saveRouteGroup() {
    const { clickedObject, routePaths, actions } = this.props;
    if (clickedObject && routePaths.length > 0) {
      const { saveRouteGroup } = this.state;
      const currentGroupindex = saveRouteGroup.length;
      const routeGroupDisplay = false;
      this.setState({ currentGroupindex,
        routeGroupDisplay,
        saveRouteGroup: [
          ...saveRouteGroup, { clickedObject, routePaths }
        ] });
      actions.setClicked(null);
      actions.setRoutePaths([]);
    }
  }

  displayRouteGroup() {
    const { currentGroupindex, saveRouteGroup } = this.state;
    if (saveRouteGroup.length > 0) {
      const { clickedObject, routePaths, actions } = this.props;
      let displayIndex = currentGroupindex;
      let routeGroupDisplay = true;
      if (clickedObject && routePaths.length > 0) {
        displayIndex = currentGroupindex < (saveRouteGroup.length - 1) ? currentGroupindex + 1 : 0;
        if (displayIndex === 0) {
          routeGroupDisplay = false;
        }
      }
      if (routeGroupDisplay) {
        actions.setClicked(saveRouteGroup[displayIndex].clickedObject);
        actions.setRoutePaths(saveRouteGroup[displayIndex].routePaths);
      } else {
        actions.setClicked(null);
        actions.setRoutePaths([]);
      }
      this.setState({ currentGroupindex: displayIndex, routeGroupDisplay });
    }
  }

  deleteRouteGroup() {
    const { currentGroupindex, routeGroupDisplay, saveRouteGroup } = this.state;
    if (saveRouteGroup.length > 0 && routeGroupDisplay) {
      const newSaveRouteGroup = saveRouteGroup.filter(
        (current: Object, index: number) => index !== currentGroupindex);
      this.setState({ currentGroupindex: 0,
        routeGroupDisplay: false,
        saveRouteGroup: [...newSaveRouteGroup] });
      const { clickedObject, routePaths, actions } = this.props;
      if (clickedObject && routePaths.length > 0) {
        actions.setClicked(null);
        actions.setRoutePaths([]);
      }
    }
  }

  render() {
    const { settime, timeBegin, timeLength, actions,
      secperhour, animatePause, animateReverse,
      getMoveOptionChecked, getDepotOptionChecked, getHeatmapVisible,
      getOptionChangeChecked } = this.props;

    const { currentGroupindex, routeGroupDisplay, saveRouteGroup } = this.state;
    const displayIndex = saveRouteGroup.length ? currentGroupindex + 1 : 0;

    return (
      <div className={controllerClass}>
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
          <li><span>ヒートマップ表示切替</span>
            <input type="checkbox" onChange={getHeatmapVisible} />
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
            <AddMinutesButton addMinutes={-10} actions={actions} />&nbsp;
            <AddMinutesButton addMinutes={-5} actions={actions} />&nbsp;
            <AddMinutesButton addMinutes={5} actions={actions} />&nbsp;
            <AddMinutesButton addMinutes={10} actions={actions} />
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
          <li><span>経路</span>
            <button onClick={this.clearAllRoute.bind(this)}>
              <span><Icon icon={icDeleteForever} />&nbsp;All Clear</span>
            </button>
            <button onClick={this.saveRouteGroup.bind(this)}>
              <span><Icon icon={icSave} />&nbsp;SAVE ({saveRouteGroup.length})</span>
            </button>
            <button onClick={this.displayRouteGroup.bind(this)}>
              <span><Icon icon={icLayers} />&nbsp;
              DISPLAY ({routeGroupDisplay ? displayIndex : 0})</span>
            </button>
            <button onClick={this.deleteRouteGroup.bind(this)}>
              <span><Icon icon={icDelete} />&nbsp;DELETE</span>
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
