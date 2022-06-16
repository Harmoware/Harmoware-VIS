import * as React from 'react';
import { MovesInput, DepotsInput, LinemapInput,
  AddMinutesButton, PlayButton, PauseButton, ReverseButton, ForwardButton,
  ElapsedTimeRange, ElapsedTimeValue, SpeedRange, SpeedValue, SimulationDateTime,
  NavigationButton, BasedProps, ClickedObject, RoutePaths, Viewport } from 'harmoware-vis';
import { Icon } from 'react-icons-kit';
import { ic_delete_forever as icDeleteForever, ic_save as icSave,
  ic_layers as icLayers, ic_delete as icDelete } from 'react-icons-kit/md';
import ViewportInput from './viewport-input';

interface Props extends BasedProps{
  getMapboxChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getMapStyleSelected: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  getTerrainChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getMoveDataChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getMoveOptionChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getMoveOptionArcChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getMoveOptionLineChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getMoveSvgChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getDepotOptionChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getHeatmapVisible: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getOptionChangeChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getIconChangeChecked: (e: React.ChangeEvent<HTMLInputElement>) => void,
  getIconCubeTypeSelected: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  getFollowingiconIdSelected: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  getViewport?: (viewport: Viewport|Viewport[]) => void,
  mapStyleNo: number,
  iconCubeType: number,
  followingiconId: number,
}

interface State {
  currentGroupindex: number,
  routeGroupDisplay: boolean,
  saveRouteGroup: {
    clickedObject: ClickedObject[],
    routePaths: RoutePaths[],
  }[]
}

const Checkbox = ({id,onChange,title,className1='harmovis_input_checkbox',defaultChecked=false,className2='form-check-label'}:
  {id:string,onChange:React.ChangeEventHandler,title:string,className1?:string,defaultChecked?:boolean,className2?:string})=>
<div>
  <input type="checkbox" id={id} onChange={onChange} className={className1} defaultChecked={defaultChecked} />
  <label htmlFor={id} className={className2} title={title}>{title}</label>
</div>

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

  seticonGradation(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.actions.setIconGradationChange(e.target.checked);
  }

  listExpansion(id: string){
    let obj=document.getElementById(id).style;
    obj.display=(obj.display==='none')?'block':'none';
  }

  render() {
    const { settime, timeBegin, timeLength, actions, movedData, movesbase, mapStyleNo,
      multiplySpeed, animatePause, animateReverse, getMapboxChecked,
      getMoveDataChecked, getMoveOptionChecked, getMoveOptionArcChecked, getDepotOptionChecked, getHeatmapVisible,
      getOptionChangeChecked, getIconChangeChecked, getIconCubeTypeSelected, getFollowingiconIdSelected,
      iconCubeType, followingiconId, getMoveSvgChecked, getMoveOptionLineChecked, getViewport, getMapStyleSelected,
      getTerrainChecked, inputFileName, viewport } = this.props;

    const { currentGroupindex, routeGroupDisplay, saveRouteGroup } = this.state;
    const displayIndex = saveRouteGroup.length ? currentGroupindex + 1 : 0;
    const { movesFileName, depotsFileName, linemapFileName } = inputFileName;

    return (
      <div className="vis_sample_controller">
        <div className="container">
          <ul className="list-group">
            <li>
              <div className="vis_sample_input_button_column">
                <label htmlFor="MovesInput" className="btn btn-outline-light btn-sm w-100" title='運行データ選択'>
                  運行データ選択<MovesInput actions={actions} id="MovesInput" />
                </label>
                <div>{movesFileName || '選択されていません'}</div>
              </div>
            </li>
            <li>
              <div className="form-select" title='移動アイコン追従'>
                <label htmlFor="IconFollowSelect" className="form-select-label">移動アイコン追従</label>
                <select id="IconFollowSelect" value={followingiconId} onChange={getFollowingiconIdSelected} >
                <option value="-1">追従なし</option>
                {movedData.map(x=><option value={x.movesbaseidx} key={x.movesbaseidx}>{x.movesbaseidx}</option>)}
                </select>
              </div>
            </li>
            <li></li>
            <li>
              <div className="vis_sample_input_button_column">
                <label htmlFor="DepotsInput" className="btn btn-outline-light btn-sm w-100" title='停留所データ選択'>
                  停留所データ選択<DepotsInput actions={actions} id="DepotsInput" />
                </label>
                <div>{depotsFileName || '選択されていません'}</div>
              </div>
            </li>
            <li></li>
            <li>
              <div className="vis_sample_input_button_column">
                <label htmlFor="LinemapInput" className="btn btn-outline-light btn-sm w-100" title='ラインマップデータ選択'>
                  ラインマップデータ選択<LinemapInput actions={actions} id="LinemapInput" />
                </label>
                <div>{linemapFileName || '選択されていません'}</div>
              </div>
            </li>
            <li></li>
            <li>
              <span onClick={this.listExpansion.bind(this,'expand1')} >
                <a style={{'cursor':'pointer'}} >▼ 表示切替スイッチパネル</a>
              </span>
              <ul className="list-group">
                <span id="expand1" style={{'display': 'none','clear': 'both'}}>
                  <li>
                    <Checkbox id="MapboxChecked" onChange={getMapboxChecked} title='Mapboxマップ表示' defaultChecked={true} />
                  </li>
                  <li>
                    <div className="form-select" title='マップスタイル切替'>
                      <label htmlFor="MapStyleSelected" className="form-select-label">マップスタイル切替</label>
                      <select id="MapStyleSelected" value={mapStyleNo} onChange={getMapStyleSelected} >
                      <option value="0">dark</option>
                      <option value="1">light</option>
                      <option value="2">streets</option>
                      <option value="3">satellite</option>
                      <option value="4">outdoors</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    <Checkbox id="TerrainChecked" onChange={getTerrainChecked} title='３Ｄ地形表示' />
                  </li>
                  <li>
                    <Checkbox id="MoveDataChecked" onChange={getMoveDataChecked} title='運行データ表示' defaultChecked={true} />
                  </li>
                  <li>
                    <Checkbox id="IconGradationChecked" onChange={this.seticonGradation.bind(this)} title='アイコン色グラデーション' />
                  </li>
                  <li>
                    <Checkbox id="IconChangeChecked" onChange={getIconChangeChecked} title='アイコン表示パターン切替' defaultChecked={true} />
                  </li>
                  <li>
                    <div className="form-select" title='３Ｄアイコン表示タイプ切替'>
                      <label htmlFor="IconCubeTypeSelect" className="form-select-label">３Ｄアイコン表示タイプ切替</label>
                      <select id="IconCubeTypeSelect" value={iconCubeType} onChange={getIconCubeTypeSelected} >
                      <option value="0">SimpleMeshLayer</option>
                      <option value="1">ScenegraphLayer</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    <Checkbox id="MoveSvgChecked" onChange={getMoveSvgChecked} title='運行データSVG表示' />
                  </li>
                  <li>
                    <Checkbox id="MoveOptionChecked" onChange={getMoveOptionChecked} title='運行データグラフ表示' />
                  </li>
                  <li>
                    <Checkbox id="MoveOptionArcChecked" onChange={getMoveOptionArcChecked} title='運行データアーチ表示' />
                  </li>
                  <li>
                    <Checkbox id="MoveOptionLineChecked" onChange={getMoveOptionLineChecked} title='運行データライン表示' />
                  </li>
                  <li>
                    <Checkbox id="DepotOptionChecked" onChange={getDepotOptionChecked} title='停留所データオプション表示' />
                  </li>
                  <li>
                    <Checkbox id="OptionChangeChecked" onChange={getOptionChangeChecked} title='オプション表示パターン切替' />
                  </li>
                  <li>
                    <Checkbox id="HeatmapVisible" onChange={getHeatmapVisible} title='ヒートマップ表示' />
                  </li>
                </span>
              </ul>
            </li>
            <li></li>
            <li><span>ナビゲーションパネル</span>
              <div className="btn-group d-flex" role="group">
                <NavigationButton buttonType="zoom-in" actions={actions} viewport={viewport} className="btn btn-outline-light btn-sm w-100" />
                <NavigationButton buttonType="zoom-out" actions={actions} viewport={viewport} className="btn btn-outline-light btn-sm w-100" />
                <NavigationButton buttonType="compass" actions={actions} viewport={viewport} className="btn btn-outline-light btn-sm w-100" />
              </div>
            </li>
            <li>
              <div className="vis_sample_input_button_column">
                <label htmlFor="ViewportInput" className="btn btn-outline-light btn-sm w-100" title='視点移動データ選択'>
                  視点移動データ選択<ViewportInput getViewport={getViewport} id="ViewportInput" />
                </label>
              </div>
            </li>
            <li></li>
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
            <li></li>
            <li>
              再現中日時&nbsp;<SimulationDateTime settime={settime} />
            </li>
            <li></li>
            <li>
              移動体（表示数/総数）&nbsp;{movedData.length}&nbsp;/&nbsp;{movesbase.length}
            </li>
            <li></li>
            <li>
              <label htmlFor="ElapsedTimeRange">経過時間
              <ElapsedTimeValue settime={settime} timeBegin={timeBegin} timeLength={timeLength} actions={actions} />&nbsp;/&nbsp;
              <input type="number" value={timeLength} onChange={e=>actions.setTimeLength(+e.target.value)} className="harmovis_input_number" min={0} max={timeLength} />&nbsp;秒
              </label>
              <ElapsedTimeRange settime={settime} timeLength={timeLength} timeBegin={timeBegin} actions={actions} id="ElapsedTimeRange" />
            </li>
            <li>
              <label htmlFor="SpeedRange">スピード<SpeedValue multiplySpeed={multiplySpeed} actions={actions} />倍速</label>
              <SpeedRange multiplySpeed={multiplySpeed} actions={actions} id="SpeedRange" />
            </li>
            <li></li>
            <li>
              開始 UNIX TIME 設定&nbsp;<input type="number" value={timeBegin} onChange={e=>actions.setTimeBegin(+e.target.value)} className="harmovis_input_number" />
            </li>
            <li>
              開始 日付&nbsp;{(new Date(timeBegin * 1000)).toLocaleString('ja-JP',
                {year: 'numeric',month: '2-digit',day: '2-digit',hour: '2-digit',minute: '2-digit',second: '2-digit',weekday: 'short' })}
            </li>
            <li></li>
            <li>
              <span onClick={this.listExpansion.bind(this,'expand2')} >
                <a style={{'cursor':'pointer'}} >▼ 経路線操作パネル</a>
              </span>
              <span id="expand2" style={{'display': 'none','clear': 'both'}}>
                <div className="btn-group d-flex" role="group">
                  <button onClick={this.saveRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100" title='SAVE'>
                    <span className="button_span"><Icon icon={icSave} />&nbsp;SAVE&nbsp;
                      <span className="badge badge-light">{saveRouteGroup.length}</span>
                    </span>
                  </button>
                  <button onClick={this.displayRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100" title='DISPLAY'>
                    <span className="button_span"><Icon icon={icLayers} />&nbsp;DISPLAY&nbsp;
                      <span className="badge badge-light">{routeGroupDisplay ? displayIndex : 0}</span>
                    </span>
                  </button>
                </div>
                <div className="btn-group d-flex" role="group">
                  <button onClick={this.clearAllRoute.bind(this)} className="btn btn-outline-light btn-sm w-100" title='All Clear'>
                    <span className="button_span"><Icon icon={icDeleteForever} />&nbsp;All Clear</span>
                  </button>
                  <button onClick={this.deleteRouteGroup.bind(this)} className="btn btn-outline-light btn-sm w-100" title='DELETE'>
                    <span className="button_span"><Icon icon={icDelete} />&nbsp;DELETE</span>
                  </button>
                </div>
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
