import * as React from 'react';
import { PolygonLayer, PointCloudLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { Marker, Popup, LinearInterpolator } from 'react-map-gl';
import { Container, MovesLayer, DepotsLayer, LineMapLayer, HarmoVisLayers, MovedData,
  connectToHarmowareVis, LoadingIcon, BasedProps, EventInfo, FpsDisplay, Viewport } from 'harmoware-vis';
import Controller from '../components/controller';
import SvgIcon from '../icondata/SvgIcon';

// MovesLayer で iconCubeType=1(ScenegraphLayer) を使用する場合に登録要
const scenegraph = '../sampledata/car.glb';
const defaultInterval = 1000;
const mapStyle:string[] = [
  'mapbox://styles/mapbox/dark-v8', //0
  'mapbox://styles/mapbox/light-v8', //1
  'mapbox://styles/mapbox/streets-v8', //2
  'mapbox://styles/mapbox/satellite-v8', //3
  'mapbox://styles/mapbox/outdoors-v10', //4
];

const MAPBOX_TOKEN: string = process.env.MAPBOX_ACCESS_TOKEN;

interface State {
  mapboxVisible: boolean,
  mapStyleNo: number,
  moveDataVisible: boolean,
  moveOptionVisible: boolean,
  moveOptionArcVisible: boolean,
  moveOptionLineVisible: boolean,
  moveSvgVisible: boolean,
  depotOptionVisible: boolean,
  heatmapVisible: boolean,
  optionChange: boolean,
  iconChange: boolean,
  iconCubeType: number,
  popup: any[],
  popupInfo: MovedData,
  viewportArray: Viewport[],
  followingiconId: number,
  follwTimerId: NodeJS.Timeout,
  terrain: boolean
}

class App extends Container<BasedProps, State> {

  constructor(props: BasedProps) {
    super(props);
    this.state = {
      mapboxVisible: true,
      mapStyleNo: 0,
      moveDataVisible: true,
      moveOptionVisible: false,
      moveOptionArcVisible: false,
      moveOptionLineVisible: false,
      moveSvgVisible: false,
      depotOptionVisible: false,
      heatmapVisible: false,
      optionChange: false,
      iconChange: true,
      iconCubeType: 0,
      popup: [0, 0, ''],
      popupInfo: null,
      viewportArray: [],
      followingiconId: -1,
      follwTimerId: null,
      terrain: false
    };
    this.viewportPlayback = this.viewportPlayback.bind(this);
    this.iconFollwNext = this.iconFollwNext.bind(this);
  }

  viewportPlayback(){
    const {viewportArray} = this.state;
    if(viewportArray && viewportArray.length > 0){
      const viewport = viewportArray.shift();
      if(viewport.transitionDuration && !viewport.transitionInterpolator){
        viewport.transitionInterpolator = new LinearInterpolator();
      }
      this.props.actions.setViewport(viewport);
      this.setState({viewportArray:[...viewportArray]});
      const {transitionDuration = defaultInterval} = viewport;
      const timeoutValue = (transitionDuration === 'auto' ?
        defaultInterval : transitionDuration);
      setTimeout(this.viewportPlayback,timeoutValue);
    }
  }

  iconFollwNext(movesbaseidx:number){
    const {animateReverse,animatePause,loopEndPause,movesbase,movedData,settime,secperhour,actions} = this.props;
    const data = movedData.find(x=>x.movesbaseidx === movesbaseidx);
    if(data && data.position){
      actions.setViewport({
        longitude:data.position[0], latitude:data.position[1],bearing:data.direction
      });
    }
    const base = movesbase[movesbaseidx];
    if(base && base.operation && base.departuretime <= settime && settime < base.arrivaltime){
      if (!animatePause && !loopEndPause) {
        let next = undefined;
        let direction = 0;
        const nextIdx = base.operation.findIndex(x=>x.elapsedtime > settime);
        if (!animateReverse) {
          next = base.operation[nextIdx];
          if(nextIdx === base.operation.length - 1){
            direction = base.operation[nextIdx-1].direction;
          }else{
            direction = base.operation[nextIdx].direction;
          }
        }else{
          next = base.operation[nextIdx-1];
          direction = base.operation[nextIdx-1].direction;
        }
        if(next && next.position){
          const timeoutValue = (Math.abs(next.elapsedtime - settime)/3.6) * secperhour;
          actions.setViewport({
            longitude:next.position[0], latitude:next.position[1], bearing:direction,
            transitionDuration:timeoutValue,
            transitionInterpolator:new LinearInterpolator()
          });
          if(this.state.followingiconId === movesbaseidx){
            const follwTimerId = setTimeout(this.iconFollwNext,timeoutValue,movesbaseidx);
            this.setState({ follwTimerId });
            return;
          }
        }
      }
    }
    this.setState({ followingiconId: -1 });
  }

  getMapboxChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ mapboxVisible: e.target.checked });
  }

  getMapStyleSelected(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ mapStyleNo: +e.target.value });
  }

  getTerrainChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ terrain: e.target.checked });
  }

  getMoveDataChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ moveDataVisible: e.target.checked });
  }

  getMoveOptionChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ moveOptionVisible: e.target.checked });
  }

  getMoveOptionArcChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ moveOptionArcVisible: e.target.checked });
  }

  getMoveOptionLineChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ moveOptionLineVisible: e.target.checked });
  }

  getMoveSvgChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ moveSvgVisible: e.target.checked });
  }

  getDepotOptionChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ depotOptionVisible: e.target.checked });
  }

  getOptionChangeChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ optionChange: e.target.checked });
  }

  getIconChangeChecked(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ iconChange: e.target.checked });
  }

  getIconCubeTypeSelected(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ iconCubeType: +e.target.value });
  }

  getFollowingiconIdSelected(e: React.ChangeEvent<HTMLSelectElement>) {
    clearTimeout(this.state.follwTimerId);
    this.setState({ follwTimerId:null });
    const movesbaseidx:number = +e.target.value;
    this.setState({ followingiconId: movesbaseidx });
    if(movesbaseidx < 0) return;
    const data = this.props.movedData.find(x=>x.movesbaseidx === movesbaseidx);
    if(data && data.position){
      setTimeout(this.iconFollwNext,0,movesbaseidx);
      return;
    }
    this.setState({ followingiconId: -1 });
  }

  getHeatmapVisible(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ heatmapVisible: e.target.checked });
  }

  getViewport(viewport: Viewport|Viewport[]){
    if(Array.isArray(viewport)){
      if(viewport.length > 0){
        this.setState({viewportArray:viewport});
        this.viewportPlayback();
      }
    }else{
      this.props.actions.setViewport(viewport);
    }
  }

  getMarker(data: MovedData, index: number) {
    const { viewport } = this.props;
    const { direction, position } = data;

    if(position){
      return (<Marker key={`marker-${index}`}
      longitude={data.position[0]} latitude={data.position[1]} >
      <SvgIcon viewport={viewport} direction={direction}
      onMouseOver={() => this.setState({popupInfo: data})}
      onMouseOut={() => this.setState({popupInfo: null})} />
      </Marker>);
    }
    return null;
  }

  getPopup() {
    const {popupInfo} = this.state;

    if(popupInfo && popupInfo.position){
      const objctlist = Object.entries(popupInfo);
      return (
        <Popup tipSize={5}
          anchor="bottom"
          longitude={popupInfo.position[0]}
          latitude={popupInfo.position[1]}
          closeButton={false} >
          <div>{objctlist.map((item)=><p>{`${item[0]}: ${item[1].toString()}`}</p>)}</div>
        </Popup>
      );
    }
    return null;
  }

  getMapGlComponents(movedData: MovedData[]){
    const { moveSvgVisible } = this.state;
    if(moveSvgVisible){
      return (
        <div>
          {movedData.map( this.getMarker.bind(this) )}
          {this.getPopup()}
        </div>
      );
    }
    return null;
  }

  getPointCloudLayer(PointCloudData: any[]){
    return PointCloudData.map((pointCloudElements:{pointCloud:any[]}, idx:number)=>{
      const {pointCloud} = pointCloudElements;
      const data = pointCloud.filter(x=>x.position);
      return new PointCloudLayer({
        id: 'PointCloudLayer-' + String(idx),
        data,
        getColor: (x: any) => x.color || [255,255,255,255],
        sizeUnits: 'meters',
        pointSize: 1,
      });
    });
  }

  onHover(el: EventInfo){
    if (el && el.object) {
      let disptext = '';
      const objctlist = Object.entries(el.object);
      for (let i = 0, lengthi = objctlist.length; i < lengthi; i=(i+1)|0) {
        const strvalue = objctlist[i][1].toString();
        disptext = disptext + (i > 0 ? '\n' : '');
        disptext = disptext + (`${objctlist[i][0]}: ${strvalue}`);
      }
      this.setState({ popup: [el.x, el.y, disptext] });
    } else {
      this.setState({ popup: [0, 0, ''] });
    }
  }

  render() {
    const state = this.state;
    const props = this.props;
    const { actions, routePaths, viewport, loading,
      clickedObject, movedData, movesbase, depotsData, linemapData } = props;
    const polygonData = movedData.filter((x:any)=>(x.coordinates || x.polygon));
    const hexagonData = state.heatmapVisible ? movedData.filter(x=>x.position):[];
    const PointCloudData = movedData.filter((x:any)=>x.pointCloud);
    const sizeScale = (Math.max(17 - viewport.zoom,2)**2)*2;

    const onHover = this.onHover.bind(this);

    return (
      <div>
        <Controller
          {...props}
          mapStyleNo={state.mapStyleNo}
          iconCubeType={state.iconCubeType}
          followingiconId={state.followingiconId}
          getMapboxChecked={this.getMapboxChecked.bind(this)}
          getMapStyleSelected={this.getMapStyleSelected.bind(this)}
          getTerrainChecked={this.getTerrainChecked.bind(this)}
          getMoveDataChecked={this.getMoveDataChecked.bind(this)}
          getMoveOptionChecked={this.getMoveOptionChecked.bind(this)}
          getMoveOptionArcChecked={this.getMoveOptionArcChecked.bind(this)}
          getMoveOptionLineChecked={this.getMoveOptionLineChecked.bind(this)}
          getMoveSvgChecked={this.getMoveSvgChecked.bind(this)}
          getDepotOptionChecked={this.getDepotOptionChecked.bind(this)}
          getHeatmapVisible={this.getHeatmapVisible.bind(this)}
          getOptionChangeChecked={this.getOptionChangeChecked.bind(this)}
          getIconChangeChecked={this.getIconChangeChecked.bind(this)}
          getIconCubeTypeSelected={this.getIconCubeTypeSelected.bind(this)}
          getFollowingiconIdSelected={this.getFollowingiconIdSelected.bind(this)}
          getViewport={this.getViewport.bind(this)}
        />
        <div className="harmovis_footer">
          <a href="http://www.city.sabae.fukui.jp/users/tutujibus/web-api/web-api.html" rel="noopener noreferrer" target="_blank">
            サンプルプログラムで「つつじバスロケーションWEB API」で取得したデータを使用しています。</a>&nbsp;
          longitude:{viewport.longitude}&nbsp;
          latitude:{viewport.latitude}&nbsp;
          altitude:{viewport.altitude}&nbsp;
          zoom:{viewport.zoom}&nbsp;
          bearing:{viewport.bearing}&nbsp;
          pitch:{viewport.pitch}
        </div>
        <div className="harmovis_area">
          <HarmoVisLayers
            viewport={viewport}
            actions={actions}
            mapboxApiAccessToken={state.mapboxVisible ? MAPBOX_TOKEN : ''}
            mapStyle={state.mapboxVisible ? mapStyle[state.mapStyleNo] : ''}
            mapboxAddSourceValue={undefined}
            visible={state.mapboxVisible}
            terrain={state.terrain}
            layers={[].concat(
              depotsData.length > 0 ?
              new DepotsLayer({
                depotsData,
                /* iconDesignations Setting Example
                iconDesignations: [{type:'stop', layer:'Scatterplot'},{type:'station', layer:'SimpleMesh'}],
                /**/
                optionVisible: state.depotOptionVisible,
                optionChange: state.optionChange,
                iconChange: state.iconChange,
                onHover
              }):null,
              state.moveDataVisible && movedData.length > 0 ?
              new MovesLayer({
                // scenegraph,
                routePaths,
                movedData,
                movesbase,
                /* iconDesignations Setting Example
                iconDesignations:[{type:'car', layer:'SimpleMesh', getColor:()=>[255,0,0,255]},
                {type:'bus', layer:'Scenegraph', getScale:()=>[0.2,0.2,0.2], getOrientation:()=>[0,0,90]},
                {type:'walker', layer:'Scatterplot'},],
                /**/
                clickedObject,
                actions,
                visible: state.moveDataVisible,
                optionVisible: state.moveOptionVisible,
                optionArcVisible: state.moveOptionArcVisible,
                optionLineVisible: state.moveOptionLineVisible,
                optionChange: state.optionChange,
                iconChange: state.iconChange, // Invalid if there is iconDesignations definition
                iconCubeType: state.iconCubeType, // Invalid if there is iconDesignations definition
                sizeScale: state.iconCubeType === 0 ? sizeScale : (sizeScale/10),
                onHover
              }):null,
              linemapData.length > 0 ?
              new LineMapLayer({
                id: 'line-map',
                data: linemapData,
                onHover
              }):null,
              polygonData.length > 0  ?
              new PolygonLayer({
                id: 'PolygonLayer',
                data: polygonData,
                visible: true,
                opacity: 0.5,
                pickable: true,
                extruded: true,
                wireframe: true,
                getPolygon: (x: any) => x.coordinates || x.polygon,
                getFillColor: (x: any) => x.color || [255,255,255,255],
                getLineColor: null,
                getElevation: (x: any) => x.elevation || 3,
                onHover: onHover
              }):null,
              PointCloudData.length > 0 ? this.getPointCloudLayer(PointCloudData):null,
              state.heatmapVisible && hexagonData.length > 0 ?
              new HexagonLayer({
                id: '3d-heatmap',
                data: hexagonData,
                getPosition: (x: any) => x.position,
                radius: 100,
                opacity: 0.5,
                extruded: true,
                visible: state.heatmapVisible
              }):null
            )}
            mapGlComponents={ this.getMapGlComponents(movedData) }
          />
        </div>
        <svg width={viewport.width} height={viewport.height} className="harmovis_overlay">
          <g fill="white" fontSize="12">
            {state.popup[2].length > 0 ?
              state.popup[2].split('\n').map((value:any, index:number) =>
                <text
                  x={state.popup[0] + 10} y={state.popup[1] + (index * 12)}
                  key={index.toString()}
                >{value}</text>) : null
            }
          </g>
        </svg>
        <LoadingIcon loading={loading} />
        <FpsDisplay />
      </div>
    );
  }
}

export default connectToHarmowareVis(App);
