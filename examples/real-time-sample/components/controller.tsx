import * as React from 'react';
import { DepotsInput,
  AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton,
  ElapsedTimeRange, ElapsedTimeValue, SpeedRange, SpeedValue, SimulationDateTime,
  NavigationButton, BasedProps, ClickedObject, RoutePaths } from 'harmoware-vis';
import { Icon } from 'react-icons-kit';
import { ic_delete_forever as icDeleteForever, ic_save as icSave,
  ic_layers as icLayers, ic_delete as icDelete } from 'react-icons-kit/md';
import { download } from 'react-icons-kit/ikons/download'

interface Props extends BasedProps{
  deleteMovebase?: (maxKeepSecond: number) => void,
  getMoveDataChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getMoveOptionChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getDepotOptionChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getOptionChangeChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getIconChangeChecked?: (e: React.ChangeEvent<HTMLInputElement>) => void,
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

  deleteMovebase(maxKeepSecond: number) {
    this.props.deleteMovebase(maxKeepSecond);
  }

  saveMovesBase() {
    if(this.props.movesbase.length > 0){
      const resultJson = JSON.stringify(this.props.movesbase);
      const downLoadLink = document.createElement("a");
      downLoadLink.download = 'movesbase-' + Date.now() + '.json';
      downLoadLink.href = URL.createObjectURL(new Blob([resultJson], {type: "text.plain"}));
      downLoadLink.dataset.downloadurl = ["text/plain", downLoadLink.download, downLoadLink.href].join(":");
      downLoadLink.click();
    }
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
    const { settime, timeBegin, leading, timeLength, actions,
      secperhour, animatePause, animateReverse, movesbase,
      getMoveDataChecked, getMoveOptionChecked, getDepotOptionChecked,
      getOptionChangeChecked, getIconChangeChecked, inputFileName, viewport } = this.props;

    const { currentGroupindex, routeGroupDisplay, saveRouteGroup } = this.state;
    const displayIndex = saveRouteGroup.length ? currentGroupindex + 1 : 0;
    const { depotsFileName } = inputFileName;

    return (
      <div className="real_sample_controller">
        <div className="container">
          <ul className="list-group">
            <li>
              <div className="real_sample_input_button_column">
                <label htmlFor="DepotsInput" className="btn btn-outline-light btn-sm w-100">
                  停留所データ選択<DepotsInput actions={actions} id="DepotsInput" />
                </label>
                <div>{depotsFileName || '選択されていません'}</div>
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
                <AddMinutesButton addMinutes={-5} actions={actions} className="btn btn-outline-light btn-sm w-100" />
                <AddMinutesButton addMinutes={-1} actions={actions} className="btn btn-outline-light btn-sm w-100" />
              </div>
              <div className="btn-group d-flex" role="group">
                <AddMinutesButton addMinutes={1} actions={actions} className="btn btn-outline-light btn-sm w-100" />
                <AddMinutesButton addMinutes={5} actions={actions} className="btn btn-outline-light btn-sm w-100" />
              </div>
            </li>
            <li>
              再現中日時&nbsp;<SimulationDateTime settime={settime} />
            </li>
            <li>
              <label htmlFor="ElapsedTimeRange">経過時間<ElapsedTimeValue settime={settime} timeBegin={timeBegin} timeLength={timeLength} actions={actions} />秒&nbsp;/&nbsp;全体&nbsp;{timeLength}&nbsp;秒</label>
              <ElapsedTimeRange settime={settime} timeLength={timeLength} timeBegin={timeBegin} min={-leading} actions={actions} id="ElapsedTimeRange" />
            </li>
            <li>
              <label htmlFor="SpeedRange">スピード<SpeedValue secperhour={secperhour} actions={actions} />秒/時</label>
              <SpeedRange secperhour={secperhour} actions={actions} id="SpeedRange" />
            </li>
            <li><div>移動データ操作</div>
              <div className="btn-group d-flex" role="group">
                <button onClick={this.deleteMovebase.bind(this,60)} className="btn btn-outline-light btn-sm w-100">
                  <span className="button_span"><Icon icon={icDelete} />&nbsp;1分以上前の移動データ削除</span>
                </button>
              </div>
            </li>
            <li><div>経路操作</div>
              <div className="btn-group d-flex" role="group">
                <button onClick={this.saveRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span className="button_span"><Icon icon={icSave} />&nbsp;保存&nbsp;
                    <span className="badge badge-light">{saveRouteGroup.length}</span>
                  </span>
                </button>
                <button onClick={this.displayRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span className="button_span"><Icon icon={icLayers} />&nbsp;表示&nbsp;
                    <span className="badge badge-light">{routeGroupDisplay ? displayIndex : 0}</span>
                  </span>
                </button>
              </div>
              <div className="btn-group d-flex" role="group">
                <button onClick={this.clearAllRoute.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span className="button_span"><Icon icon={icDeleteForever} />&nbsp;非表示</span>
                </button>
                <button onClick={this.deleteRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100">
                  <span className="button_span"><Icon icon={icDelete} />&nbsp;保存分削除</span>
                </button>
              </div>
            </li>
            <li></li>
            <li>
              <div className="btn-group d-flex" role="group">
                <button onClick={this.saveMovesBase.bind(this)} className="btn btn-outline-light btn-sm w-100" disabled={movesbase.length===0}>
                  <span className="button_span"><Icon icon={download} />&nbsp;移動データ保存</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
