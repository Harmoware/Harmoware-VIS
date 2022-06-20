import * as React from 'react';
import { PolygonLayer, PointCloudLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { Marker, Popup } from 'react-map-gl';
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
  terrain: boolean
}
const initState:State = {
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
  terrain: false
}

const App = (props:BasedProps)=>{
  const { actions, routePaths, viewport, loading,
    animateReverse,animatePause,loopEndPause,settime,secperhour,
    clickedObject, movedData, movesbase, depotsData, linemapData } = props;

  const [state,setState] = React.useState<State>(initState)

  const viewportPlayback = async (viewportArray: Viewport[])=>{
    if(viewportArray && viewportArray.length > 0){
      await Promise.resolve()
      const viewportArrayBase = [...viewportArray]
      const viewport = viewportArrayBase.shift();
      actions.setViewport(viewport);
      const {transitionDuration = defaultInterval} = viewport;
      const timeoutValue = (transitionDuration === 'auto' ?
        defaultInterval : transitionDuration);
        App.playbackTimerId = setTimeout(viewportPlayback,timeoutValue,viewportArrayBase);
    }else{
      App.playbackTimerId = null
    }
  }

  const iconFollwNext = async (movesbaseidx:number)=>{
    await Promise.resolve()
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
          const transitionDuration = (Math.abs(next.elapsedtime - settime)/3.6) * secperhour;
          actions.setViewport({
            longitude:next.position[0], latitude:next.position[1], bearing:direction,
            transitionDuration,
          });
          App.follwTimerId = setTimeout(iconFollwNext,transitionDuration,movesbaseidx);
          App.followingiconId = movesbaseidx
        }
      }
    }
  }

  const getMapboxChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({ ...state, mapboxVisible: e.target.checked });
  }

  const getMapStyleSelected = (e: React.ChangeEvent<HTMLSelectElement>)=>{
    setState({ ...state, mapStyleNo: +e.target.value });
  }

  const getTerrainChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({ ...state, terrain: e.target.checked });
  }

  const getMoveDataChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({ ...state, moveDataVisible: e.target.checked });
  }

  const getMoveOptionChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({ ...state, moveOptionVisible: e.target.checked });
  }

  const getMoveOptionArcChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({ ...state, moveOptionArcVisible: e.target.checked });
  }

  const getMoveOptionLineChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({ ...state, moveOptionLineVisible: e.target.checked });
  }

  const getMoveSvgChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({ ...state, moveSvgVisible: e.target.checked });
  }

  const getDepotOptionChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({ ...state, depotOptionVisible: e.target.checked });
  }

  const getOptionChangeChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({ ...state, optionChange: e.target.checked });
  }

  const getIconChangeChecked = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({ ...state, iconChange: e.target.checked });
  }

  const getIconCubeTypeSelected = (e: React.ChangeEvent<HTMLSelectElement>)=>{
    setState({ ...state, iconCubeType: +e.target.value });
  }

  const getFollowingiconIdSelected = (e: React.ChangeEvent<HTMLSelectElement>)=>{
    clearTimeout(App.follwTimerId);
    App.follwTimerId = null
    const movesbaseidx:number = +e.target.value;
    if(movesbaseidx < 0) return;
    const data = movedData.find(x=>x.movesbaseidx === movesbaseidx);
    if(data && data.position){
      actions.setViewport({
        longitude:data.position[0], latitude:data.position[1], bearing:data.direction
      });
      setTimeout(iconFollwNext,0,movesbaseidx);
      App.followingiconId = movesbaseidx
      return;
    }
    App.followingiconId = -1
  }

  const getHeatmapVisible = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setState({ ...state, heatmapVisible: e.target.checked });
  }

  const getViewport = (viewport: Viewport|Viewport[])=>{
    clearTimeout(App.playbackTimerId);
    App.playbackTimerId = null
    if(Array.isArray(viewport)){
      if(viewport.length > 0){
        viewportPlayback(viewport);
      }
    }else{
      actions.setViewport(viewport);
    }
  }

  const getMarker = (data: MovedData, index: number)=>{
    const { direction, position } = data;
    if(position){
      return (<Marker key={`marker-${index}`}
      longitude={data.position[0]} latitude={data.position[1]} >
      <SvgIcon viewport={viewport} direction={direction}
      onMouseOver={() => setState({...state, popupInfo: data})}
      onMouseOut={() => setState({...state, popupInfo: null})} />
      </Marker>);
    }
    return null;
  }

  const getPopup = ()=>{
    const {popupInfo} = state;
    if(popupInfo && popupInfo.position){
      const objctlist = Object.entries(popupInfo);
      return (
        <Popup tipSize={5} anchor="bottom"
          longitude={popupInfo.position[0]} latitude={popupInfo.position[1]}
          closeButton={false} >
          <div>{objctlist.map((item)=><p>{`${item[0]}: ${item[1].toString()}`}</p>)}</div>
        </Popup>
      );
    }
    return null;
  }

  const getMapGlComponents = (movedData: MovedData[])=>{
    if(state.moveSvgVisible){
      return (<div>{movedData.map(getMarker)}{getPopup()}</div>);
    }
    return null;
  }

  const getPointCloudLayer = (PointCloudData: any[])=>{
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

  const onHover = (el: EventInfo)=>{
    if (el && el.object) {
      let disptext = '';
      const objctlist = Object.entries(el.object);
      for (let i = 0, lengthi = objctlist.length; i < lengthi; i=(i+1)|0) {
        const strvalue = objctlist[i][1].toString();
        disptext = disptext + (i > 0 ? '\n' : '');
        disptext = disptext + (`${objctlist[i][0]}: ${strvalue}`);
      }
      setState({ ...state, popup: [el.x, el.y, disptext] });
    } else {
      setState({ ...state, popup: [0, 0, ''] });
    }
  }

  const onLoad = ()=>{
    actions.setViewport({
      onTransitionInterrupt: onTransitionInterrupt
    } as any);
  }

  const onTransitionInterrupt = ()=>{
    console.log('onTransitionInterrupt')
    const {follwTimerId, playbackTimerId} = App
    if(follwTimerId){
      console.log('follwTimerId')
      clearTimeout(follwTimerId);
      App.follwTimerId = null
      App.followingiconId = -1
    }
    if(playbackTimerId){
      console.log('playbackTimerId')
      clearTimeout(playbackTimerId);
      App.playbackTimerId = null
    }
  }

  const polygonData = movedData.filter((x:any)=>(x.coordinates || x.polygon))
  const hexagonData = state.heatmapVisible ? movedData.filter(x=>x.position):[]
  const PointCloudData = movedData.filter((x:any)=>x.pointCloud)
  const sizeScale = React.useMemo(()=>(Math.max(17 - viewport.zoom,2)**2)*2,[viewport.zoom]);

  return (
    <Container<BasedProps> {...props}>
      <Controller
        {...props}
        mapStyleNo={state.mapStyleNo}
        iconCubeType={state.iconCubeType}
        followingiconId={App.followingiconId}
        getMapboxChecked={getMapboxChecked}
        getMapStyleSelected={getMapStyleSelected}
        getTerrainChecked={getTerrainChecked}
        getMoveDataChecked={getMoveDataChecked}
        getMoveOptionChecked={getMoveOptionChecked}
        getMoveOptionArcChecked={getMoveOptionArcChecked}
        getMoveOptionLineChecked={getMoveOptionLineChecked}
        getMoveSvgChecked={getMoveSvgChecked}
        getDepotOptionChecked={getDepotOptionChecked}
        getHeatmapVisible={getHeatmapVisible}
        getOptionChangeChecked={getOptionChangeChecked}
        getIconChangeChecked={getIconChangeChecked}
        getIconCubeTypeSelected={getIconCubeTypeSelected}
        getFollowingiconIdSelected={getFollowingiconIdSelected}
        getViewport={getViewport}
      />
      <div className="harmovis_footer">
        longitude:{viewport.longitude}&nbsp;
        latitude:{viewport.latitude}&nbsp;
        altitude:{viewport.altitude}&nbsp;
        zoom:{viewport.zoom}&nbsp;
        bearing:{viewport.bearing}&nbsp;
        pitch:{viewport.pitch}
      </div>
      <div className="harmovis_area">
        <HarmoVisLayers
          deckGLProps={{onLoad:onLoad}}
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
              onHover 
            }):null,
            PointCloudData.length > 0 ? getPointCloudLayer(PointCloudData):null,
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
          mapGlComponents={ getMapGlComponents(movedData) }
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
    </Container>
  );
}
App.playbackTimerId = null as NodeJS.Timeout
App.follwTimerId = null as NodeJS.Timeout
App.followingiconId = -1 as number

export default connectToHarmowareVis(App);
