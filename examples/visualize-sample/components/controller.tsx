import * as React from 'react';
import { MovesInput, DepotsInput, LinemapInput,
  AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton,
  ElapsedTimeRange, ElapsedTimeValue, SpeedRange, SpeedValue, SimulationDateTime,
  NavigationButton, BasedProps, ClickedObject, RoutePaths } from 'harmoware-vis';
import { Icon } from 'react-icons-kit';
import { ic_delete_forever as icDeleteForever, ic_save as icSave,
  ic_layers as icLayers, ic_delete as icDelete } from 'react-icons-kit/md';

interface Props extends BasedProps{
  getMapboxChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getMoveDataChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getMoveOptionChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getMoveSvgChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getDepotOptionChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getHeatmapVisible?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getOptionChangeChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getIconChangeChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getIconCubeTypeSelected?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  iconCubeType: number
}

interface State {
  currentGroupindex: number,
  routeGroupDisplay: boolean,
  saveRouteGroup: {
    clickedObject: ClickedObject[],
    routePaths: RoutePaths[],
  }[]
}

export default class Controller extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
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
    const { settime, timeBegin, timeLength, actions, movedData, movesbase,
      secperhour, animatePause, animateReverse, getMapboxChecked,
      getMoveDataChecked, getMoveOptionChecked, getDepotOptionChecked, getHeatmapVisible,
      getOptionChangeChecked, getIconChangeChecked, getIconCubeTypeSelected, iconCubeType,
      getMoveSvgChecked, inputFileName, viewport } = this.props;

    const { currentGroupindex, routeGroupDisplay, saveRouteGroup } = this.state;
    const displayIndex = saveRouteGroup.length ? currentGroupindex + 1 : 0;
    const { movesFileName, depotsFileName, linemapFileName } = inputFileName;

    return (
      <div className="vis_sample_controller">
        <div className="container">
          <ul className="list-group">
            <li>
              <div className="vis_sample_input_button_column">
                <label htmlFor="MovesInput" className="btn btn-outline-light btn-sm w-100">
                  運行データ選択<MovesInput actions={actions} id="MovesInput" />
                </label>
                <div>{movesFileName || '選択されていません'}</div>
              </div>
            </li>
            <li>
              <div className="vis_sample_input_button_column">
                <label htmlFor="DepotsInput" className="btn btn-outline-light btn-sm w-100">
                  停留所データ選択<DepotsInput actions={actions} id="DepotsInput" />
                </label>
                <div>{depotsFileName || '選択されていません'}</div>
              </div>
            </li>
            <li>
              <div className="vis_sample_input_button_column">
                <label htmlFor="LinemapInput" className="btn btn-outline-light btn-sm w-100">
                  ラインマップデータ選択<LinemapInput actions={actions} id="LinemapInput" />
                </label>
                <div>{linemapFileName || '選択されていません'}</div>
              </div>
            </li>
            <li>
              <div>
                <input type="checkbox" id="MapboxChecked" onChange={getMapboxChecked} className="form-check-input" defaultChecked={true} />
                <label htmlFor="MapboxChecked" className="form-check-label">Mapboxマップ表示</label>
              </div>
            </li>
            <li>
              <div>
                <input type="checkbox" id="MoveDataChecked" onChange={getMoveDataChecked} className="form-check-input" defaultChecked={true} />
                <label htmlFor="MoveDataChecked" className="form-check-label">運行データ表示</label>
              </div>
            </li>
            <li>
              <div>
                <input type="checkbox" id="IconChangeChecked" onChange={getIconChangeChecked} className="form-check-input" defaultChecked={true} />
                <label htmlFor="IconChangeChecked" className="form-check-label">アイコン表示パターン切替</label>
              </div>
            </li>
            <li>
              <div className="form-select">
                <label htmlFor="IconCubeTypeSelect" className="form-select-label">３Ｄアイコン表示タイプ切替</label>
                <select id="IconCubeTypeSelect" value={iconCubeType} onChange={getIconCubeTypeSelected} >
                <option value="0">SimpleMeshLayer</option>
                <option value="1">ScenegraphLayer</option>
                </select>
              </div>
            </li>
            <li>
              <div>
                <input type="checkbox" id="MoveSvgChecked" onChange={getMoveSvgChecked} className="form-check-input" />
                <label htmlFor="MoveSvgChecked" className="form-check-label">運行データSVG表示</label>
              </div>
            </li>
            <li>
              <div>
                <input type="checkbox" id="MoveOptionChecked" onChange={getMoveOptionChecked} className="form-check-input" />
                <label htmlFor="MoveOptionChecked" className="form-check-label">運行データオプション表示</label>
              </div>
            </li>
            <li>
              <div>
                <input type="checkbox" id="DepotOptionChecked" onChange={getDepotOptionChecked} className="form-check-input" />
                <label htmlFor="DepotOptionChecked" className="form-check-label">停留所データオプション表示</label>
              </div>
            </li>
            <li>
              <div>
                <input type="checkbox" id="OptionChangeChecked" onChange={getOptionChangeChecked} className="form-check-input" />
                <label htmlFor="OptionChangeChecked" className="form-check-label">オプション表示パターン切替</label>
              </div>
            </li>
            <li>
              <div>
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
              再現中日時&nbsp;<SimulationDateTime settime={settime} />
            </li>
            <li>
              移動体（表示数/総数）&nbsp;{movedData.length}&nbsp;/&nbsp;{movesbase.length}
            </li>
            <li>
              <label htmlFor="ElapsedTimeRange">経過時間<ElapsedTimeValue settime={settime} timeBegin={timeBegin} timeLength={timeLength} actions={actions} />秒</label>
              <ElapsedTimeRange settime={settime} timeLength={timeLength} timeBegin={timeBegin} actions={actions} id="ElapsedTimeRange" />
            </li>
            <li>
              <label htmlFor="SpeedRange">スピード<SpeedValue secperhour={secperhour} actions={actions} />秒/時</label>
              <SpeedRange secperhour={secperhour} actions={actions} id="SpeedRange" />
            </li>
            <li><div>経路操作</div>
              <div className="btn-group d-flex" role="group">
                <button onClick={this.saveRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span className="button_span"><Icon icon={icSave} />&nbsp;SAVE&nbsp;
                    <span className="badge badge-light">{saveRouteGroup.length}</span>
                  </span>
                </button>
                <button onClick={this.displayRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span className="button_span"><Icon icon={icLayers} />&nbsp;DISPLAY&nbsp;
                    <span className="badge badge-light">{routeGroupDisplay ? displayIndex : 0}</span>
                  </span>
                </button>
              </div>
              <div className="btn-group d-flex" role="group">
                <button onClick={this.clearAllRoute.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span className="button_span"><Icon icon={icDeleteForever} />&nbsp;All Clear</span>
                </button>
                <button onClick={this.deleteRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span className="button_span"><Icon icon={icDelete} />&nbsp;DELETE</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
