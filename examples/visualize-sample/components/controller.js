// @flow

import React, { Component } from 'react';
import { MovesInput, DepotsInput,
  AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton,
  ElapsedTimeRange, SpeedRange, SimulationDateTime, NavigationButton } from 'harmoware-vis';
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
  inputFileName: Object
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
      getOptionChangeChecked, inputFileName, viewport } = this.props;

    const { currentGroupindex, routeGroupDisplay, saveRouteGroup } = this.state;
    const displayIndex = saveRouteGroup.length ? currentGroupindex + 1 : 0;
    const { movesFileName, depotsFileName } = inputFileName;
    const nowrapstyle = { textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };

    return (
      <div id="controller_area">
        <div className="container">
          <ul className="list-group">
            <li>
              <label htmlFor="MovesInput" className="btn btn-outline-light btn-sm w-100">
                運行データ選択<MovesInput actions={actions} id="MovesInput" style={{ display: 'none' }} />
              </label>
              <div style={nowrapstyle}>{movesFileName || '選択されていません'}</div>
            </li>
            <li>
              <label htmlFor="DepotsInput" className="btn btn-outline-light btn-sm w-100">
                停留所データ選択<DepotsInput actions={actions} id="DepotsInput" style={{ display: 'none' }} />
              </label>
              <div style={nowrapstyle}>{depotsFileName || '選択されていません'}</div>
            </li>
            <li>
              <div className="form-check">
                <input type="checkbox" id="MoveOptionChecked" onChange={getMoveOptionChecked} className="form-check-input" />
                <label htmlFor="MoveOptionChecked" className="form-check-label">運行データオプション表示</label>
              </div>
            </li>
            <li>
              <div className="form-check">
                <input type="checkbox" id="DepotOptionChecked" onChange={getDepotOptionChecked} className="form-check-input" />
                <label htmlFor="DepotOptionChecked" className="form-check-label">停留所データオプション表示</label>
              </div>
            </li>
            <li>
              <div className="form-check">
                <input type="checkbox" id="OptionChangeChecked" onChange={getOptionChangeChecked} className="form-check-input" />
                <label htmlFor="OptionChangeChecked" className="form-check-label">オプション表示パターン切替</label>
              </div>
            </li>
            <li>
              <div className="form-check">
                <input type="checkbox" id="HeatmapVisible" onChange={getHeatmapVisible} className="form-check-input" />
                <label htmlFor="HeatmapVisible" className="form-check-label">ヒートマップ表示</label>
              </div>
            </li>
            <li><span>ナビゲーションパネル</span>
              <div className="btn-group d-flex" role="group">
                <NavigationButton buttonType="zoom-in" actions={actions} viewport={viewport} className="btn btn-outline-light btn-sm w-100" />
                <NavigationButton buttonType="zoom-out" actions={actions} viewport={viewport} className="btn btn-outline-light btn-sm w-100" />
                <NavigationButton buttonType="compass" actions={actions} viewport={viewport} className="btn btn-outline-light btn-sm w-100" />
              </div>
            </li>
            <li><span>コントロールパネル</span>
              <div className="btn-group d-flex" role="group">
                {animatePause ?
                  <PlayButton actions={actions} className="btn btn-outline-light btn-sm w-100" /> :
                  <PauseButton actions={actions} className="btn btn-outline-light btn-sm w-100" />
                }
                {animateReverse ?
                  <ForwardButton actions={actions} className="btn btn-outline-light btn-sm w-100" /> :
                  <ReverseButton actions={actions} className="btn btn-outline-light btn-sm w-100" />
                }
              </div>
              <div className="btn-group d-flex" role="group">
                <AddMinutesButton addMinutes={-10} actions={actions} className="btn btn-outline-light btn-sm w-100" />
                <AddMinutesButton addMinutes={-5} actions={actions} className="btn btn-outline-light btn-sm w-100" />
              </div>
              <div className="btn-group d-flex" role="group">
                <AddMinutesButton addMinutes={5} actions={actions} className="btn btn-outline-light btn-sm w-100" />
                <AddMinutesButton addMinutes={10} actions={actions} className="btn btn-outline-light btn-sm w-100" />
              </div>
            </li>
            <li>
              再現中日時&nbsp;<SimulationDateTime timeBegin={timeBegin} settime={settime} />
            </li>
            <li>
              <label htmlFor="ElapsedTimeRange">経過時間&nbsp;{Math.floor(settime)}&nbsp;秒</label>
              <ElapsedTimeRange settime={settime} timeLength={timeLength} actions={actions} id="ElapsedTimeRange" className="form-control-range" />
            </li>
            <li>
              <label htmlFor="SpeedRange">スピード&nbsp;{secperhour}&nbsp;秒/時</label>
              <SpeedRange secperhour={secperhour} actions={actions} id="SpeedRange" className="form-control-range" />
            </li>
            <li><div>経路操作</div>
              <div className="btn-group d-flex" role="group">
                <button onClick={this.saveRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span><Icon icon={icSave} />&nbsp;SAVE&nbsp;
                    <span className="badge badge-light">{saveRouteGroup.length}</span>
                  </span>
                </button>
                <button onClick={this.displayRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span><Icon icon={icLayers} />&nbsp;DISPLAY&nbsp;
                    <span className="badge badge-light">{routeGroupDisplay ? displayIndex : 0}</span>
                  </span>
                </button>
              </div>
              <div className="btn-group d-flex" role="group">
                <button onClick={this.clearAllRoute.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span><Icon icon={icDeleteForever} />&nbsp;All Clear</span>
                </button>
                <button onClick={this.deleteRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span><Icon icon={icDelete} />&nbsp;DELETE</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
